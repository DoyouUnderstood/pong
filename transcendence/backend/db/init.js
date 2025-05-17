
import db from './sqlite.js';

import { execute } from './helpers.js';

export async function initDB() {
    // pour changer la db. attention supprime toute la db !
 //   await execute(db, `DROP TABLE IF EXISTS User`);

    await execute(db, ` CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL,
        avatar TEXT DEFAULT NULL,
        twoFAEnabled BOOLEAN DEFAULT 0,
        twoFAMethod TEXT DEFAULT NULL,
        totpSecret TEXT DEFAULT NULL,
        twoFATempSecret TEXT DEFAULT NULL
    );`
    );
} 
