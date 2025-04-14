import { getUserById, updateUserDB, getUserByUsername, isUsernameTaken, isEmailTaken, signupUserDB } from '../models/userModels.js'

export default function userServiceFactory({ bcrypt }) {
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

            const hashedPassword = await bcrypt.hash(password)

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

            const isValidPassword = await bcrypt.compare(password, user.password)

            if (!isValidPassword) {
                const error = new Error("Identifiants invalides.")
                error.statusCode = 401
                throw error
            }

            return {
                id: user.id,
                username: user.username,
                email: user.email,
            }
        },
        async update({ id, username, password, email }) {
            const userExist = await getUserById(id);

            if (!userExist) {
                const error = new Error("Utilisateur non trouvé.");
                error.statusCode = 404;
                throw error;
            }

            const usernameTaken = await isUsernameTaken(username);
            if (usernameTaken && userExist.username !== username) {
                const error = new Error("Ce pseudo est déjà utilisé.");
                error.statusCode = 409;
                throw error;
            }

            const hashedPassword = await bcrypt.hash(password);

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
        }
    }
}

