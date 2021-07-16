db.auth('root_user', 'root_pass');
rs.initiate(
    {_id: "rs1", version: 1,
        members: [
            { _id: 0, host : "mongodb_1:27017" },
            { _id: 1, host : "mongodb_2:27017" },
            { _id: 2, host : "mongodb_3:27017" }
        ]
    }
);
