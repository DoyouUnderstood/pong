export async function getUserCredential(request, reply, userService)
{
    const user = await userService.getById(request.user.id);
    console.log(user);
    reply.send({status: 200, message: "voici l'user", user})
}

export async function logoutUser(request, reply)
{
    reply.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });

  reply.send({ message: "Logged out successfully" });
}

export async function updateUser(request, reply, userService)
{
    const { id, username, password, email } = request.body;

    try 
    {
        const user = await userService.update({ id, username, password, email });

        reply.send({
            status: 200,
            message: "Utilisateur mis à jour avec succès.",
            user
        });

    } catch (err) {
        reply.status(err.statusCode || 500).send({ message: err.message });
    }
}

export async function connectUser(request, reply, authService) {
    const { username, password } = request.body;
    try {

        const result = await authService.login({ username, password });
        if (result.twoFARequired) 
            return reply.send({ twoFARequired: true, userId: result.userId });

        reply.setCookie('jwt', result.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
        }).send({
            message: "Connexion réussie !",
            user: result.user,
        });

    } catch (err) {
        reply.sendError(err);
    }
}

export async function signupUser(request, reply, userService)
{
    const { username, password, email, avatar} = request.body;
    console.log("voici les infos:", username, password, email, avatar);
    try {
        const user = await userService.signup({ username, password, email, avatar })
        console.log("voici le user: ", user);
        reply.send({
            status: 200,
            message: "Inscription réussie !",
            user,
        })
    } catch (err)
    {
        console.log("ceci est le log de signup", err);
        reply.sendError(err);
    }
}

/*
    */
