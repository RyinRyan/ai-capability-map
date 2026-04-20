import { NextRequest, NextResponse } from 'next/server';
import { verifyUser, isFirstLogin, initDb } from '@/lib/db';

// Initialize DB on first request
let initialized = false;

export async function POST(request: NextRequest) {
  if (!initialized) {
    initDb();
    initialized = true;
  }

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const isValid = verifyUser(username, password);

    if (isValid) {
      // Check if first login
      const firstLogin = isFirstLogin(username);
      
      // Create response with cookie
      const response = NextResponse.json({ 
        success: true, 
        username,
        isFirstLogin: firstLogin 
      });
      
      // Set auth cookie
      response.cookies.set('auth', JSON.stringify({ username, loggedIn: true }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return response;
    } else {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
