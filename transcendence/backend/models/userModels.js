import db from "../db/sqlite.js";
import {executeInsert, execute, selectOne } from '../db/helpers.js';

export async function updateUser2FASecret(id, secret) {
    return await execute(db, `UPDATE User SET totpSecret = ? WHERE id = ?`, [secret, id]);
}

export async function setUser2FAEnabled(id) {
    return await execute(db, `UPDATE User SET twofaEnabled = 1 WHERE id = ?`, [id]);
}

export async function getUserById(id) {
    return await selectOne(db,
        `SELECT * FROM User WHERE id = ?`,
        [id]
    )
}


export async function updateUserDB(username, password, email, id) {
    
    const result = await execute(db, 
        `UPDATE User SET username = ?, password = ?, email = ? WHERE id = ?`,
        [username, password, email, id]
    );

    if (result.changes === 0)
        return null; // pas de lignes modifiées = erreur

    return await selectOne(db, 
        `SELECT * FROM User WHERE id = ?`,
        [id]
    );
}

export async function getUserByUsername(username) {
    return await selectOne(db,
        `SELECT * FROM User WHERE username = ?`,
        [username]
    )
}

export async function signupUserDB(username, password, email) 
{

    const result = await executeInsert(db, 
        `INSERT INTO User (username, password, email) VALUES(?, ?, ?)`,
        [username, password, email]
    );

    // On recupere l'user complet via l'id genere
    return await selectOne(db, 
        `SELECT * FROM User WHERE id = ?`,
        [result.lastID]
    );
}

export async function isEmailTaken(email)
{
    const result = await selectOne(db, 
        `SELECT * FROM User WHERE email = ?`,
        [email]
    );
    if (result)
        return true;
    return false;
}

export async function isUsernameTaken(username) {
    const result = await selectOne(db, 
        `SELECT * FROM User WHERE username = ?`,
        [username]
    );
    if (result)
        return true;
    return false;
}
