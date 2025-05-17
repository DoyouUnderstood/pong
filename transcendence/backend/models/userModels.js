import db from "../db/sqlite.js";
import {executeInsert, execute, selectOne } from '../db/helpers.js';

export async function findUserById(id) {
    return await selectOne(db,
        `SELECT * FROM User WHERE id = ?`,
        [id]
    )
}

export async function updateUserById(username, password, email, id) {
    
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

export async function findUserByUsername(username) {
    return await selectOne(db,
        `SELECT * FROM User WHERE username = ?`,
        [username]
    )
}

export async function createUser(username, password, email, avatar) 
{

    const result = await executeInsert(db, 
        `INSERT INTO User (username, password, email, avatar) VALUES(?, ?, ?, ?)`,
        [username, password, email, avatar]
    );

    // On recupere l'user complet via l'id genere
    return await selectOne(db, 
        `SELECT * FROM User WHERE id = ?`,
        [result.lastID]
    );
}

export async function findUserAvatar(id)
{
    return await selectOne(db, `SELECT avatar FROM User WHERE id = ?`, [id]);
}
export async function checkEmailExists(email)
{
    const result = await selectOne(db, 
        `SELECT * FROM User WHERE email = ?`,
        [email]
    );
    if (result)
        return true;
    return false;
}

export async function checkUsernameExists(username) {
    const result = await selectOne(db, 
        `SELECT * FROM User WHERE username = ?`,
        [username]
    );
    if (result)
        return true;
    return false;
}
