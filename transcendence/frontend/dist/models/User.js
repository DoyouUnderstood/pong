export class User {
    constructor(username, password, email) {
        this.username = username;
        this.password = password;
        if (email)
            this.email = email;
    }
}
