import { createUserDB } from '../models/userModels.js';
export async function connectUser(req, res)
{
    const { username, password } = req.body;
    await createUserDB(username, password);
    req.send({status: 200});
}
