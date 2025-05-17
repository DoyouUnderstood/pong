import db from "../db/sqlite.js";
import {execute, selectOne } from '../db/helpers.js';


export async function updateUserTempTwoFASecret(userId, secret) {
  return await execute(db,`UPDATE User SET twoFATempSecret = ? WHERE id = ?`, [secret, userId]);
}

export async function disableUserTwoFA(id)
{
    await execute(db, `UPDATE User SET twofaEnabled = 0, twoFAMethod = NULL, totpSecret = NULL WHERE id = ?`, [id]);
}
export async function findUserTwoFASecret(id)
{
    return await selectOne(db, `SELECT totpSecret from User WHERE id = ?`, [id]);
}
export async function updateUserTwoFASecret(id, secret) {
    return await execute(db, `UPDATE User SET totpSecret = ? WHERE id = ?`, [secret, id]);
}

export async function enableUserTwoFA(id) {
    return await execute(db, `UPDATE User SET twofaEnabled = 1 WHERE id = ?`, [id]);
}

export async function updateUserTwoFAMethod(method, id)
{
    return await execute(db, `UPDATE User SET twoFAMethod = ? WHERE id = ?`, [method, id]);
}


