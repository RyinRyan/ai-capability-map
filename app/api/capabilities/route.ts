import { NextRequest, NextResponse } from 'next/server';
import { getPlanets, initDb, addTerritory, updateTerritory, deleteTerritory, resetToDefault } from '@/lib/db';
import { GalaxyType } from '@/app/types';

// Initialize DB on first request
let initialized = false;

function ensureInitialized() {
  if (!initialized) {
    initDb();
    initialized = true;
  }
}

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

// GET /api/capabilities?galaxy=rd
export async function GET(request: NextRequest) {
  ensureInitialized();
  
  try {
    const { searchParams } = new URL(request.url);
    const galaxy = searchParams.get('galaxy') as GalaxyType;
    
    if (!galaxy || !['rd', 'digital'].includes(galaxy)) {
      return NextResponse.json(
        { error: 'Invalid galaxy parameter' },
        { status: 400 }
      );
    }

    const planets = getPlanets(galaxy);
    return NextResponse.json({ planets });
  } catch (error) {
    console.error('Get capabilities error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/capabilities - Add new territory
export async function POST(request: NextRequest) {
  ensureInitialized();
  
  if (!checkAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { planetId, territory } = await request.json();
    
    if (!planetId || !territory) {
      return NextResponse.json(
        { error: 'Planet ID and territory are required' },
        { status: 400 }
      );
    }

    const newTerritory = addTerritory(planetId, territory);
    return NextResponse.json({ territory: newTerritory });
  } catch (error) {
    console.error('Add territory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/capabilities - Update territory
export async function PUT(request: NextRequest) {
  ensureInitialized();
  
  if (!checkAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { territoryId, updates } = await request.json();
    
    if (!territoryId || !updates) {
      return NextResponse.json(
        { error: 'Territory ID and updates are required' },
        { status: 400 }
      );
    }

    updateTerritory(territoryId, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update territory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/capabilities?territoryId=xxx
export async function DELETE(request: NextRequest) {
  ensureInitialized();
  
  if (!checkAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const territoryId = searchParams.get('territoryId');
    
    if (!territoryId) {
      return NextResponse.json(
        { error: 'Territory ID is required' },
        { status: 400 }
      );
    }

    deleteTerritory(territoryId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete territory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
