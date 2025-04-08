export class SignupRoute {
    constructor() {
        this.partial = "signup.html";
        this.authentification = "loginNotRequired";
    }
    async setup(container) {
        console.log("bienvenue dans signup!");
    }
}
