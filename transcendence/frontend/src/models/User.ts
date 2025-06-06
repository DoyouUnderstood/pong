import { UserI } from '../interfaces/UserInterface'

export class User implements UserI 
{
    id?: number;
    username: string;
    password: string;
    email: string;
    avatar: string;
    token?: string;
    twoFAEnabled?: number;
    twoFAMethod?: string;
    constructor(username: string, password: string,  email: string, avatar: string, twoFAEnabled?: number, twoFAMethod?: string, id?: number, token?: string) {
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
