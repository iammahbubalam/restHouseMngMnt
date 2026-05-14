import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { ALLOWED_EMAILS } from './auth-config';
import { sql } from './db';

// Helper to handle refreshing Google OAuth token
async function refreshAccessToken(token: any) {
  try {
    const url = "https://oauth2.googleapis.com/token?" + new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken as string,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 120 * 24 * 60 * 60, // 120 days
  },
  callbacks: {
    async signIn({ user }) {
      // GATE: Only allowed emails can sign in
      return ALLOWED_EMAILS.includes(user.email?.toLowerCase() ?? '');
    },
    async jwt({ token, account, profile }) {
      if (account) {
        // First login: save tokens + upsert user in DB
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = Date.now() + (account.expires_at! * 1000);

        // Upsert user into Neon
        const users = await sql`
          INSERT INTO users (email, name, avatar_url)
          VALUES (${profile?.email}, ${profile?.name}, ${profile?.picture})
          ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            avatar_url = EXCLUDED.avatar_url,
            updated_at = NOW()
          RETURNING id
        `;
        
        token.dbId = users[0].id;
      }

      // If we don't have a dbId on the token yet, try to fetch it
      if (!token.dbId && token.email) {
          const users = await sql`SELECT id FROM users WHERE email = ${token.email}`;
          if (users.length > 0) {
              token.dbId = users[0].id;
          }
      }

      // Refresh token if expired
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      // Attach the DB ID to the session user so it's easily accessible in the app
      session.user.id = (token.dbId as string) || token.sub!;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Error code passed in query string as ?error=
  }
});
