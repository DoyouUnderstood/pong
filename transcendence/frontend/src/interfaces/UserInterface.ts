export interface UserI
{
    id?: number; 
    username: string;
    password: string;
    email: string; 
    token?: string;
    twoFAEnabled?: number; 
    twoFAMethod?: string;
}
