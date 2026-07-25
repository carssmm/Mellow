import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { config as appConfig } from "@/lib/config";

export async function proxy(request: NextRequest) {
  // First update session (refreshes auth token if needed and returns response with updated cookies)
  const response = await updateSession(request);

  // Now create a temporary client just to check the user status
  const supabase = createServerClient(
    appConfig.supabase.url,
    appConfig.supabase.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // We don't need to set cookies here since updateSession already handled it
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage = request.nextUrl.pathname === '/login';

  // If not authenticated and not on login page, redirect to login
  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated and on login page, redirect to dashboard
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Otherwise, proceed
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
