#!/bin/bash

DB_PATH="database/tr.db"

echo "tables presentes dans $DB_PATH :"
sqlite3 "$DB_PATH" ".tables"
echo
echo "schema present: "
sqlite3 "$DB_PATH" ".schema"
echo
echo "donnees presentes dans la base de donnees: "
sqlite3 "$DB_PATH" "SELECT * FROM User;"
