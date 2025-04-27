import { getUserById, updateUserDB, getUserByUsername, isUsernameTaken, isEmailTaken, signupUserDB, setUser2FAEnabled } from '../models/userModels.js'

import { bcryptLib } from '../plugins/bcrypt.js'; // <-- assure-toi d'importer la bonne version

export default function userServiceFactory() {


    return {
        async signup({ username, password, email }) {
            if (await isUsernameTaken(username)) {
                const error = new Error("Ce pseudo est déjà utilisé.")
                error.statusCode = 409
                throw error
            }

            if (await isEmailTaken(email)) {
                const error = new Error("Cet email est déjà enregistré.")
                error.statusCode = 409
                throw error
            }

            const hashedPassword = await bcryptLib.hash(password)

            const user = await signupUserDB(username, hashedPassword, email)

            if (!user) {
                const error = new Error("Erreur lors de la création du compte.")
                error.statusCode = 500
                throw error
            }

            return {
                id: user.id,
                username: user.username,
                email: user.email,
            }
        },
        async login({ username, password }) {
    const user = await getUserByUsername(username)

    if (!user) {
        const error = new Error("Identifiants invalides.")
        error.statusCode = 401
        throw error
    }
    console.log("skkrt - avant bcrypt.compare");
        
            console.log("Comparaison entre :", password, user.password);
    try {
        const isValidPassword = await bcryptLib.compare(password, user.password)
        console.log("skkrt - après bcrypt.compare");

        if (!isValidPassword) {
            const error = new Error("Identifiants invalides.");
            error.statusCode = 401;
            throw error;
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
        };
    } catch (err) {
        console.error("Erreur bcrypt.compare:", err);
        throw err;
    }
},

        async update({ id, username, password, email }) {
            const user = await getUserById(id);
                
            console.log("Comparaison entre :", password, user.password);
            if (!user) {
                const error = new Error("Utilisateur non trouvé.");
                error.statusCode = 404;
                throw error;
            }

            const usernameTaken = await isUsernameTaken(username);
            if (usernameTaken && user.username !== username) {
                const error = new Error("Ce pseudo est déjà utilisé.");
                error.statusCode = 409;
                throw error;
            }
            const hashedPassword = await bcryptLib.hash(password);
            const updatedUser = await updateUserDB(username, hashedPassword, email, id);

            if (!updatedUser) {
                const error = new Error("Erreur lors de la mise à jour de l'utilisateur.");
                error.statusCode = 500;
                throw error;
            }

            return {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
            };
        },
        async getById(id) {
            return await getUserById(id);
        },
        async save2FASecret(id, secret) {
            return await updateUser2FASecret(id, secret); // À créer dans models
        },
        async enable2FA(id) {
            return await setUser2FAEnabled(id); // À créer dans models
        }

    }
}
