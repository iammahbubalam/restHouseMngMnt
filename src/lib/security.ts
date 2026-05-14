import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ALLOWED_EMAILS } from "./auth-config";

/**
 * Senior-level Security Guard
 * Checks for both Authentication AND Authorization via the ALLOWED_EMAILS list.
 */
export async function checkAccess() {
  const session = await auth();
  
  if (!session?.user?.email) {
    return { 
      authorized: false, 
      response: NextResponse.json({ error: 'Unauthenticated' }, { status: 401 }),
      session: null
    };
  }

  // Check the strict Whitelist from auth-config.ts
  const isAuthorized = ALLOWED_EMAILS.includes(session.user.email);

  if (!isAuthorized) {
    console.warn(`SECURITY ALERT: Unauthorized access attempt by ${session.user.email}`);
    return { 
      authorized: false, 
      response: NextResponse.json({ 
        error: 'Access Denied: Your email is not on the authorized list.' 
      }, { status: 403 }),
      session
    };
  }

  return { authorized: true, session, email: session.user.email };
}
