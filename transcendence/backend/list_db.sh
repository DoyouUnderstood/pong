#!/bin/bash

DB_PATH="database/tr.db"

if [ "$1" == "reset" ]; then
    echo "VIDAGE DE LA DB..."
    sqlite3 "$DB_PATH" "DELETE FROM User;"
    sqlite3 "$DB_PATH" "DELETE FROM sqlite_sequence WHERE name='User';"
    echo "DB vidée."
    exit 0
fi

echo "tables presentes dans $DB_PATH :"
sqlite3 "$DB_PATH" ".tables"
echo
echo "schema present: "
sqlite3 "$DB_PATH" ".schema"
echo
echo "donnees presentes dans la base de donnees: "
sqlite3 "$DB_PATH" "SELECT * FROM User;"
