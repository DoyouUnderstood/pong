import db from "../db/sqlite.js";
import { execute } from '../db/helpers.js';

export async function createUserDB(username, password) {
    return await execute(db, 
    `INSERT INTO User (username, password, email) VALUES(?, ?, ?)`,
    [username, password, `${username}@hotmail.fr`]
    );    
}
