db.auth('root_user', 'root_pass');
db = db.getSiblingDB('tes_database');
db.createUser({
  user: 'tes_user',
  pwd: 'tes_pass',
  roles: [
    {
      role: 'dbOwner',
      db: 'tes_database',
    },
  ],
});
