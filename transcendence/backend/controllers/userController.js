import { loginUserDB, signupUserDB, updateUserDB } from '../models/userModels.js';
import { isUsernameTaken, isEmailTaken } from '../models/userModels.js';

export async function updateUser(request, reply)
{
    const { id, username, password, email } = request.body;
    console.log("voici id , username, password et email:", id, username, password, email);
    if (await isUsernameTaken(username) && (await isEmailTaken(email)))
        return reply.status(409).send({message: "Nom d'utilisateur ou Email deja utilise."});

    const user = await updateUserDB(username, password, email, id);

    if (!user)       
    {
        console.log("updateUser payload:", id, username, password, email);
        return reply.status(500).send({message: "Erreur lors de la mise à jour."});
    }
    reply.send({
        status: 200,
        message: "Mise à jour réussie !",
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            password: "",
        }
    });
}

export async function connectUser(request, reply)
{
    console.log("Requête reçue:", request.body);
    const { username, password } = request.body;
    const user = await loginUserDB(username, password);

    if (!user)
        return reply.status(401).send({message: "Identifiants Invalides"});

    reply.send({ 
        status: 200, 
        message: "Connexion réussie !", 
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        }
    });
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

    reply.send({ 
        status: 200, 
        message: "Inscription réussie !", 
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            password: "",
        }
    });
}

