import userServiceFactory from './services/userService.js';

export function buildContainer({ bcrypt })
{
    return { 
        userService: userServiceFactory({ bcrypt }),
    }
}
