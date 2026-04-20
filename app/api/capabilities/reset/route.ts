import { NextRequest, NextResponse } from 'next/server';
import { resetToDefault, initDb } from '@/lib/db';

// Initialize DB on first request
let initialized = false;

function checkAuth(request: NextRequest): boolean {
  const authCookie = request.cookies.get('auth');
  if (authCookie) {
    try {
      const auth = JSON.parse(authCookie.value);
      return auth.loggedIn === true;
    } catch {
      return false;
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  if (!initialized) {
    initDb();
    initialized = true;
  }
  
  if (!checkAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    resetToDefault();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
