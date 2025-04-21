import userServiceFactory from './services/userService.js';
import jwtServiceFactory from './services/jwtService.js';

export function buildContainer({ bcrypt, jwt })
{
    return { 
        userService: userServiceFactory({ bcrypt }),
        jwtService: jwtServiceFactory({ jwt }),  
    }
}
