# Bashscript to reset test database
# Only used to clear all data
$(> db/test.sqlite)
cat db/migrate.sql | sqlite3 db/test.sqlite