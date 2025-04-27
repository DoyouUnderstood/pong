import bcrypt from 'bcryptjs';

export const bcryptLib = {
  async hash(password) {
    const salt = await bcrypt.genSalt(12);
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) return reject(err);
        resolve(hash);
      });
    });
  },

  async compare(password, hashedPassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) return reject(err);
        resolve(isMatch);
      });
    });
  }
};

