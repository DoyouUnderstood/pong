import {
    findUserById,
    updateUserById,
    findUserByUsername,
    checkUsernameExists,
    checkEmailExists,
    createUser,
  } from '../models/userModels.js';
  
  import {
    disableUserTwoFA,
    enableUserTwoFA,
    updateUserTwoFAMethod,
    updateUserTwoFASecret,
    findUserTwoFASecret,
    updateUserTempTwoFASecret,
  } from '../models/twoFAModels.js';
  
  import { bcryptLib } from '../plugins/bcrypt.js';
  import { throwIf} from '../utils/errors.js';
  
  export default function userServiceFactory() {
    return {
      async disableUserTwoFA(id) {
        await disableUserTwoFA(id);
      },
  
      async signup({ username, password, email, avatar}) {
        throwIf(await checkUsernameExists(username), "Ce pseudo est déjà utilisé.", 409);
        throwIf(await checkEmailExists(email), "Cet email est déjà enregistré.", 409);
  
        const hashedPassword = await bcryptLib.hash(password);
        const user = await createUser(username, hashedPassword, email, avatar);
  
        throwIf(!user, "Erreur lors de la création du compte.", 500);
  
        return {
            id: user.id,
            username: user.username,
            email: user.email,
        };
      },
  
      async validateCredentials({ username, password }) {
        const user = await findUserByUsername(username);
        throwIf(!user, "Identifiants invalides.", 401);
  
        const isValidPassword = await bcryptLib.compare(password, user.password);
        throwIf(!isValidPassword, "Identifiants invalides.", 401);
  
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          twoFAEnabled: user.twoFAEnabled,
          twoFAMethod: user.twoFAMethod,
        };
      },
  
      async update({ id, username, password, email }) {
        const user = await findUserById(id);
        throwIf(!user, "Utilisateur non trouvé.", 404);
  
        const usernameTaken = await checkUsernameExists(username);
        throwIf(usernameTaken && user.username !== username, "Ce pseudo est déjà utilisé.", 409);
  
        const hashedPassword = await bcryptLib.hash(password);
        const updatedUser = await updateUserById(username, hashedPassword, email, id);
  
        throwIf(!updatedUser, "Erreur lors de la mise à jour de l'utilisateur.", 500);
  
        return {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
        };
      },
  
      async getSecret(id) {
        return await findUserTwoFASecret(id);
      },
      async getById(id) {
        return await findUserById(id);
      },
      async save2FASecret(id, secret) {
        return await updateUserTwoFASecret(id, secret);
      },
      async enable2FA(id, method) {
        await enableUserTwoFA(id);
        await updateUserTwoFAMethod(method, id);
      },
      async saveTemp2FASecret(id, secret) {
        return await updateUserTempTwoFASecret(id, secret);
      },
    };
  }
  
