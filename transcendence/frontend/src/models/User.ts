import { UserI } from "../interfaces/UserInterface.js";

export class User implements UserI 
{
    id?: number;
    username: string;
    password: string;
    email?: string;

    constructor(username: string, password: string, email?: string, id?: number) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.id = id;
    }
}
