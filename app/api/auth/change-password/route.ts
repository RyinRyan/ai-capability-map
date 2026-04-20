import { NextRequest, NextResponse } from 'next/server';
import { verifyUser, updatePassword, initDb } from '@/lib/db';

// Initialize DB on first request
let initialized = false;

export async function POST(request: NextRequest) {
  if (!initialized) {
    initDb();
    initialized = true;
  }

  try {
    const { username, oldPassword, newPassword } = await request.json();

    if (!username || !oldPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify old password
    const isValid = verifyUser(username, oldPassword);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    // Update password
    updatePassword(username, newPassword);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
