import { loginUserDB, signupUserDB } from '../models/userModels.js';
import { isUsernameTaken, isEmailTaken } from '../models/userModels.js';
export async function connectUser(request, reply)
{
    console.log("Requête reçue:", request.body);
    const { username, password } = request.body;
    const user = await loginUserDB(username, password);
    if (!user)
        return reply.status(401).send({message: "Identifiants Invalides"});
    reply.send({status: 200, message: "Connexion Reussie!"});
}

export async function signupUser(request, reply)
{
    const { username, password, email } = request.body;

    if (await isUsernameTaken(username)) {
        return reply.status(409).send({ message: "Ce pseudo est déjà utilisé." });
    }

    if (await isEmailTaken(email)) {
        return reply.status(409).send({ message: "Cet email est déjà enregistré." });
    }

    const user = await signupUserDB(username, password, email);
    if (!user)
        return reply.status(500).send({ message: "Erreur lors de la création du compte." });

    reply.send({ status: 200, message: "Inscription réussie !" });
}

