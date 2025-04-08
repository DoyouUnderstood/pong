import { UserI } from "../interfaces/UserInterface.js";

export class User implements UserI 
{
    username: string;
    password: string;
    email?: string;

    constructor(username: string, password: string, email?: string) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
}
