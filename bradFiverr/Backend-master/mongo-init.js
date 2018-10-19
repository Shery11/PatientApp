//db.assets.createIndex({name: "text"});

db.createUser({ user: 'adminsmt', pwd: 'adminsmt2016', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });
db.updateUser('adminsmt', {roles: ['userAdminAnyDatabase', 'readWriteAnyDatabase', 'dbAdminAnyDatabase', 'clusterAdmin']});

db.assets.createIndex({location: "2dsphere"});
db.users.createIndex({email: 1},{ unique: true });
db.logs.createIndex({time: 1});

