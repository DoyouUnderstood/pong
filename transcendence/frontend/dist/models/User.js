export class User {
    constructor(username, password, email, avatar, twoFAEnabled, twoFAMethod, id, token) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.avatar = avatar;
        this.id = id;
        this.token = token;
        this.twoFAMethod = twoFAMethod;
        this.twoFAEnabled = twoFAEnabled;
    }
}
