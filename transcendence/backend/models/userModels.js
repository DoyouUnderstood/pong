import db from "../db/sqlite.js";
import { execute, selectOne } from '../db/helpers.js';

export async function loginUserDB(username, password) {
    return await selectOne(db, 
    `SELECT * FROM User WHERE username = ? AND password = ?`,
    [username, password]
    );    
}

export async function signupUserDB(username, password, email) {
    
    return await execute(db, 
    `INSERT INTO User (username, password, email) VALUES(?, ?, ?)`,
    [username, password, email]
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
