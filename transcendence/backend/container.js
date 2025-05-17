import { jwtLib } from './plugins/jwtLib.js';
import { bcryptLib } from './plugins/bcrypt.js';
import userServiceFactory from './services/userService.js';
import twoFAServiceFactory from './services/twoFAService.js';
import authServiceFactory from './services/authService.js';

export function buildContainer() 
{
	const userService = userServiceFactory({ bcryptLib });
	const twoFAService = twoFAServiceFactory();
	const authService = authServiceFactory({ userService, jwtLib, twoFAService });

	return {
		userService,
		twoFAService,
		authService,
	};
}
