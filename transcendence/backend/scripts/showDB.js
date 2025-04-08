import sqlite3 from "sqlite3";

// Change le chemin vers ta base
const db = new sqlite3.Database("./db/tr.db");

const showTables = async () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`, (err, tables) => {
      if (err) return reject(err);
      resolve(tables.map(t => t.name));
    });
  });
};

const showAllData = async (tableName) => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const showSchema = async (tableName) => {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${tableName});`, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const main = async () => {
  try {
    const tables = await showTables();

    for (const table of tables) {
      console.log(`\n=== TABLE: ${table} ===`);
      const schema = await showSchema(table);
      console.log("Structure:");
      schema.forEach(col => {
        console.log(`- ${col.name} (${col.type})${col.pk ? " [PK]" : ""}`);
      });

      const rows = await showAllData(table);
      console.log("\nContenu:");
      if (rows.length === 0) {
        console.log("(vide)");
      } else {
        rows.forEach((row, index) => {
          console.log(`${index + 1}.`, row);
        });
      }
    }
  } catch (err) {
    console.error("Erreur lors de la lecture de la base :", err);
  } finally {
    db.close();
  }
};

main();

