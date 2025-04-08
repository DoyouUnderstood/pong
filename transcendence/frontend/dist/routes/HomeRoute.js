export class HomeRoute {
    constructor() {
        this.partial = 'home.html';
        this.authentification = "loginRequired";
    }
    async setup(container) {
        const event = addEventListener("click", () => {
            console.log("salut mon pote !");
        });
    }
}
