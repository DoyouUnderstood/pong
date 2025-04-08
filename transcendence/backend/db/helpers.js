export const execute = async (db, sql, params = []) => {
  if (params && params.length > 0) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) 
          return reject(err);
        resolve(this.lastID);
      });
    });
  }
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) 
        return reject(err);
      resolve();
    });
  });
};

export const selectOne = async (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row); // `null` si aucun résultat
    });
  });
};
