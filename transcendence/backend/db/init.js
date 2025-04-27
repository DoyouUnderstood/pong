
import db from './sqlite.js';

import { execute } from './helpers.js';

export async function initDB() {
//        await execute(db, `DROP TABLE IF EXISTS User`);

    await execute(db, ` CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL,
        twofaEnabled INTEGER DEFAULT 0,
        totpSecret TEXT 
    );`
    );
} 
