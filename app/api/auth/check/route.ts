import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  
  if (authCookie) {
    try {
      const auth = JSON.parse(authCookie.value);
      if (auth.loggedIn) {
        return NextResponse.json({ loggedIn: true, username: auth.username });
      }
    } catch {
      // Invalid cookie
    }
  }
  
  return NextResponse.json({ loggedIn: false });
}
