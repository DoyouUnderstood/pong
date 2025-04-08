import { loginUserDB, signupUserDB } from '../models/userModels.js';

export async function connectUser(request, reply)
{
    console.log("Requête reçue:", request.body); // ✅ ici tu vois le contenu du POST
    const { username, password } = request.body;
    const user = await loginUserDB(username, password);
    if (!user)
        return reply.status(402).send({message: "Identifiants Invalides"});
    reply.send({status: 200, message: "Connexion Reussie!"});
}

export async function signupUser(request, reply)
{
    console.log("requete recu:", request.body);
    const { username, password, email } = request.body;
    const user = await signupUserDB(username, password, email);
    if (!user)
        return reply.send({message: "erreur signup!"});
    reply.send({status:200});
}
