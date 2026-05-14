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
      // 1. Handle Initial Sign In
      if (account && profile) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = Date.now() + (account.expires_at! * 1000);
        token.picture = profile.picture; // Google picture

        // Upsert user into DB using avatar_url column
        const users = await sql`
          INSERT INTO users (email, name, avatar_url)
          VALUES (${profile.email ?? null}, ${profile.name ?? null}, ${profile.picture ?? null})
          ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            avatar_url = EXCLUDED.avatar_url,
            updated_at = NOW()
          RETURNING id, avatar_url
        `;
        
        token.dbId = users[0].id;
        token.picture = users[0].avatar_url; // Use DB value
      }

      // 2. Continuous Synchronization (ensure picture is always in token)
      if (!token.picture && token.email) {
          const users = await sql`SELECT id, avatar_url FROM users WHERE email = ${token.email}`;
          if (users.length > 0) {
              token.dbId = users[0].id;
              token.picture = users[0].avatar_url;
          }
      }

      // 3. Handle Token Refresh
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      // 4. Map Token Data to Session User
      if (session.user) {
        session.user.id = (token.dbId as string) || token.sub!;
        // Force the DB picture (avatar_url) into the session image property
        session.user.image = (token.picture as string) || (session.user.image as string);
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  }
});
