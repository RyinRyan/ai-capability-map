import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Planet, Territory, GalaxyType } from '../app/types';
import { rdPlanets, digitalPlanets } from '../app/data/defaultData';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'capability-map.db');

let db: Database.Database | null = null;

// Ensure data directory exists
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('[DB] Created data directory:', DATA_DIR);
  }
}

export function getDb(): Database.Database {
  if (!db) {
    ensureDataDir();
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

// Check if a column exists in a table
function columnExists(db: Database.Database, table: string, column: string): boolean {
  try {
    const result = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
    return result.some(col => col.name === column);
  } catch {
    return false;
  }
}

// Check if a table exists
function tableExists(db: Database.Database, table: string): boolean {
  try {
    const result = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table);
    return !!result;
  } catch {
    return false;
  }
}

export function initDb() {
  console.log('[DB] Initializing database...');
  
  const db = getDb();
  let isNewDatabase = false;

  // Check if this is a new database (no tables exist)
  const hasUsersTable = tableExists(db, 'users');
  const hasPlanetsTable = tableExists(db, 'planets');
  
  if (!hasUsersTable && !hasPlanetsTable) {
    isNewDatabase = true;
    console.log('[DB] New database detected, creating tables...');
  }

  // Create tables if not exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      is_first_login INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS planets (
      id TEXT PRIMARY KEY,
      galaxy TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      size INTEGER NOT NULL,
      color TEXT NOT NULL,
      icon_color TEXT NOT NULL,
      gradient TEXT NOT NULL,
      text_color TEXT NOT NULL,
      status_count TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS territories (
      id TEXT PRIMARY KEY,
      planet_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      markers TEXT NOT NULL,
      link TEXT,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (planet_id) REFERENCES planets(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS facilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      territory_id TEXT NOT NULL,
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      link TEXT,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY (territory_id) REFERENCES territories(id) ON DELETE CASCADE
    );
  `);

  // Check and add missing columns (for existing databases)
  if (!columnExists(db, 'users', 'is_first_login')) {
    console.log('[DB] Adding is_first_login column to users table...');
    db.exec('ALTER TABLE users ADD COLUMN is_first_login INTEGER DEFAULT 1');
    // Set existing users to not first login (preserve existing behavior)
    db.exec('UPDATE users SET is_first_login = 0');
  }

  // Add link column to facilities table if not exists
  if (!columnExists(db, 'facilities', 'link')) {
    console.log('[DB] Adding link column to facilities table...');
    db.exec('ALTER TABLE facilities ADD COLUMN link TEXT');
  }

  // Note: territories.link column is kept for backward compatibility but no longer used
  // New data structure stores link in facilities table instead

  // Insert default root user if not exists (password: root)
  const rootUser = db.prepare('SELECT * FROM users WHERE username = ?').get('root');
  if (!rootUser) {
    console.log('[DB] Creating default root user...');
    db.prepare('INSERT INTO users (username, password, is_first_login) VALUES (?, ?, ?)').run('root', 'root', 1);
  }

  // Check if planets exist, if not insert defaults
  const planetCount = db.prepare('SELECT COUNT(*) as count FROM planets').get() as { count: number };
  if (planetCount.count === 0) {
    console.log('[DB] Inserting default planet data...');
    insertDefaultData(db);
  }

  console.log('[DB] Database initialization complete.');
  return isNewDatabase;
}

function insertDefaultData(db: Database.Database) {
  const insertPlanet = db.prepare(`
    INSERT INTO planets (id, galaxy, name, description, icon, size, color, icon_color, gradient, text_color, status_count, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertTerritory = db.prepare(`
    INSERT INTO territories (id, planet_id, name, description, icon, color, markers, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertFacility = db.prepare(`
    INSERT INTO facilities (territory_id, name, status, link, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  // Insert R&D planets
  rdPlanets.forEach((planet, pIndex) => {
    insertPlanet.run(
      planet.id,
      'rd',
      planet.name,
      planet.description,
      planet.icon,
      planet.size,
      planet.color,
      planet.iconColor,
      planet.gradient,
      planet.textColor,
      planet.statusCount,
      pIndex
    );

    planet.territories.forEach((territory, tIndex) => {
      insertTerritory.run(
        territory.id,
        planet.id,
        territory.name,
        territory.description,
        territory.icon,
        territory.color,
        JSON.stringify(territory.markers),
        tIndex
      );

      territory.facilities.forEach((facility, fIndex) => {
        insertFacility.run(territory.id, facility.name, facility.status, facility.link || null, fIndex);
      });
    });
  });

  // Insert Digital planets
  digitalPlanets.forEach((planet, pIndex) => {
    insertPlanet.run(
      planet.id,
      'digital',
      planet.name,
      planet.description,
      planet.icon,
      planet.size,
      planet.color,
      planet.iconColor,
      planet.gradient,
      planet.textColor,
      planet.statusCount,
      pIndex
    );

    planet.territories.forEach((territory, tIndex) => {
      insertTerritory.run(
        territory.id,
        planet.id,
        territory.name,
        territory.description,
        territory.icon,
        territory.color,
        JSON.stringify(territory.markers),
        tIndex
      );

      territory.facilities.forEach((facility, fIndex) => {
        insertFacility.run(territory.id, facility.name, facility.status, facility.link || null, fIndex);
      });
    });
  });
}

export function verifyUser(username: string, password: string): boolean {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
  return !!user;
}

export function isFirstLogin(username: string): boolean {
  const db = getDb();
  const user = db.prepare('SELECT is_first_login FROM users WHERE username = ?').get(username) as { is_first_login: number } | undefined;
  return user ? user.is_first_login === 1 : false;
}

export function updatePassword(username: string, newPassword: string): void {
  const db = getDb();
  db.prepare('UPDATE users SET password = ?, is_first_login = 0 WHERE username = ?').run(newPassword, username);
}

export function getPlanets(galaxy: GalaxyType): Planet[] {
  const db = getDb();
  
  const planets = db.prepare(`
    SELECT * FROM planets WHERE galaxy = ? ORDER BY sort_order
  `).all(galaxy) as any[];

  return planets.map(planet => {
    const territories = db.prepare(`
      SELECT * FROM territories WHERE planet_id = ? ORDER BY sort_order
    `).all(planet.id) as any[];

    return {
      id: planet.id,
      name: planet.name,
      description: planet.description,
      icon: planet.icon,
      size: planet.size,
      color: planet.color,
      iconColor: planet.icon_color,
      gradient: planet.gradient,
      textColor: planet.text_color,
      statusCount: planet.status_count,
      territories: territories.map(territory => {
        const facilities = db.prepare(`
          SELECT * FROM facilities WHERE territory_id = ? ORDER BY sort_order
        `).all(territory.id) as any[];

        return {
          id: territory.id,
          name: territory.name,
          description: territory.description,
          icon: territory.icon,
          color: territory.color,
          markers: JSON.parse(territory.markers),
          facilities: facilities.map(f => ({
            name: f.name,
            status: f.status,
            link: f.link
          }))
        };
      })
    };
  });
}

export function addTerritory(planetId: string, territory: Omit<Territory, 'id'>): Territory {
  const db = getDb();
  const id = `${planetId}-${Date.now()}`;
  
  db.prepare(`
    INSERT INTO territories (id, planet_id, name, description, icon, color, markers, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    planetId,
    territory.name,
    territory.description,
    territory.icon,
    territory.color,
    JSON.stringify(territory.markers),
    999
  );

  // Insert facilities
  territory.facilities.forEach((facility, index) => {
    db.prepare(`
      INSERT INTO facilities (territory_id, name, status, link, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, facility.name, facility.status, facility.link || null, index);
  });

  return { ...territory, id };
}

export function updateTerritory(territoryId: string, updates: Partial<Territory>): void {
  const db = getDb();
  
  if (updates.name !== undefined) {
    db.prepare('UPDATE territories SET name = ? WHERE id = ?').run(updates.name, territoryId);
  }
  if (updates.description !== undefined) {
    db.prepare('UPDATE territories SET description = ? WHERE id = ?').run(updates.description, territoryId);
  }
  if (updates.icon !== undefined) {
    db.prepare('UPDATE territories SET icon = ? WHERE id = ?').run(updates.icon, territoryId);
  }
  if (updates.color !== undefined) {
    db.prepare('UPDATE territories SET color = ? WHERE id = ?').run(updates.color, territoryId);
  }
  if (updates.markers !== undefined) {
    db.prepare('UPDATE territories SET markers = ? WHERE id = ?').run(JSON.stringify(updates.markers), territoryId);
  }

  // Update facilities if provided
  if (updates.facilities !== undefined) {
    db.prepare('DELETE FROM facilities WHERE territory_id = ?').run(territoryId);
    updates.facilities.forEach((facility, index) => {
      db.prepare(`
        INSERT INTO facilities (territory_id, name, status, link, sort_order)
        VALUES (?, ?, ?, ?, ?)
      `).run(territoryId, facility.name, facility.status, facility.link || null, index);
    });
  }
}

export function deleteTerritory(territoryId: string): void {
  const db = getDb();
  db.prepare('DELETE FROM territories WHERE id = ?').run(territoryId);
}

export function resetToDefault(): void {
  const db = getDb();
  db.prepare('DELETE FROM facilities').run();
  db.prepare('DELETE FROM territories').run();
  db.prepare('DELETE FROM planets').run();
  insertDefaultData(db);
}
