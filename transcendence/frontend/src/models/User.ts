import { UserI } from "../interfaces/UserInterface.js";

export class User implements UserI 
{
    id?: number;
    username: string;
    password: string;
    email?: string;
    token?: string;
    constructor(username: string, password: string, email?: string, id?: number, token?: string) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.id = id;
        this.token = token;
    }
}
