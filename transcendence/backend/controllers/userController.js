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

export async function connectUser(request, reply, userService, jwtService) {
    const { username, password } = request.body

    try {
        const user = await userService.login({ username, password })
        const token = jwtService.generateToken({user: user.username, id: user.id});
        console.log("ICI EST LE TOKEN WOWOWOOW", token);
        reply.setCookie('jwt', token, {
            httpOnly: false,
            secure: process.env.JWT_SECRET,
            sameSite: 'lax',
            path: '/'
        })
        .send({
            status: 200,
            message: "Connexion réussie !",
            user,
            token
        })
    } catch (err) {
        reply.status(err.statusCode || 500).send({ message: err.message })
    }
}

export async function signupUser(request, reply, userService)
{
    const { username, password, email } = request.body;
    
    try {
        const user = await userService.signup({ username, password, email })

        reply.send({
            status: 200,
            message: "Inscription réussie !",
            user,
        })
    } catch (err) {
        reply.status(err.statusCode || 500).send({ message: err.message })
    }

}

