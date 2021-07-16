# Batumbu Test Number 8 


# Generate Keyfile

Generate keyfile for authentication mongo instances.
```
openssl rand -base64 768 > mongo-replicas.key
```

If already, change the permissions and owner of keyfile.
```
chmod 400 mongo-replicas.key
```
```
sudo chown 999:999 mongo-replicas.key
```


# Prepare Code

docker-compose.yml 

```
version: "3.3"
services:
  mongodb_1:
    image: mongo:4.4
    command: mongod --serviceExecutor adaptive --replSet rs1 --port 27017 --keyFile /etc/mongo-replicas.key
    ports:
      - 27017:27017
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root_user
      - MONGO_INITDB_ROOT_PASSWORD=root_pass
    volumes:
      - mongodb_1_data:/data/db
      - ./mongo-replicas.key:/etc/mongo-replicas.key
  mongodb_2:
    image: mongo:4.4
    command: mongod --serviceExecutor adaptive --replSet rs1 --port 27017 --keyFile /etc/mongo-replicas.key
    ports:
      - 27117:27017
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root_user
      - MONGO_INITDB_ROOT_PASSWORD=root_pass
    volumes:
      - mongodb_2_data:/data/db
      - ./mongo-replicas.key:/etc/mongo-replicas.key
  mongodb_3:
    image: mongo:4.4
    command: mongod --serviceExecutor adaptive --replSet rs1 --port 27017 --keyFile /etc/mongo-replicas.key
    ports:
      - 27217:27017
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root_user
      - MONGO_INITDB_ROOT_PASSWORD=root_pass
    volumes:
      - mongodb_3_data:/data/db
      - ./mongo-replicas.key:/etc/mongo-replicas.key
volumes:
  mongodb_1_data:
  mongodb_2_data:
  mongodb_3_data:
```

replication.js
```
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
```

mongo-create-user.js
```
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
```

# Cluster Deploy

Start containers with command:

```
$ docker-compuse up -d
```

Initialize replica set.

```
docker run  mongo:4.4 mongo --username root_user --password root_pass --host 172.0.0.1:27017  --authenticationDatabase admin admin  --eval "$(< replication.js)"
```
```
MongoDB shell version v4.4.6
connecting to: mongodb://172.17.0.1:27017/admin?authSource=admin&compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("dd50244f-bd66-4061-97c1-aa644f6e7592") }
MongoDB server version: 4.4.6
{ "ok" : 1 }
```

Check replica set status

```
docker run  mongo:4.4 mongo --username root_user --password root_pass --host 172.17.0.1:27017  --authenticationDatabase admin admin  --eval "rs.status()"
```
```
MongoDB shell version v4.4.6
connecting to: mongodb://172.17.0.1:27017/admin?authSource=admin&compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("3a0a3c65-10ea-4374-9045-de616c51df28") }
MongoDB server version: 4.4.6
{
	"set" : "rs1",
	"date" : ISODate("2021-06-06T12:57:41.690Z"),
	"myState" : 1,
	"term" : NumberLong(1),
	"syncSourceHost" : "",
	"syncSourceId" : -1,
	"heartbeatIntervalMillis" : NumberLong(2000),
	"majorityVoteCount" : 2,
	"writeMajorityCount" : 2,
	"votingMembersCount" : 3,
	"writableVotingMembersCount" : 3,
	"optimes" : {
		"lastCommittedOpTime" : {
			"ts" : Timestamp(1622984261, 1),
			"t" : NumberLong(1)
		},
		"lastCommittedWallTime" : ISODate("2021-06-06T12:57:41.001Z"),
		"readConcernMajorityOpTime" : {
			"ts" : Timestamp(1622984261, 1),
			"t" : NumberLong(1)
		},
		"readConcernMajorityWallTime" : ISODate("2021-06-06T12:57:41.001Z"),
		"appliedOpTime" : {
			"ts" : Timestamp(1622984261, 1),
			"t" : NumberLong(1)
		},
		"durableOpTime" : {
			"ts" : Timestamp(1622984261, 1),
			"t" : NumberLong(1)
		},
		"lastAppliedWallTime" : ISODate("2021-06-06T12:57:41.001Z"),
		"lastDurableWallTime" : ISODate("2021-06-06T12:57:41.001Z")
	},
	"lastStableRecoveryTimestamp" : Timestamp(1622984231, 1),
	"electionCandidateMetrics" : {
		"lastElectionReason" : "electionTimeout",
		"lastElectionDate" : ISODate("2021-06-06T12:55:10.883Z"),
		"electionTerm" : NumberLong(1),
		"lastCommittedOpTimeAtElection" : {
			"ts" : Timestamp(0, 0),
			"t" : NumberLong(-1)
		},
		"lastSeenOpTimeAtElection" : {
			"ts" : Timestamp(1622984099, 1),
			"t" : NumberLong(-1)
		},
		"numVotesNeeded" : 2,
		"priorityAtElection" : 1,
		"electionTimeoutMillis" : NumberLong(10000),
		"numCatchUpOps" : NumberLong(0),
		"newTermStartDate" : ISODate("2021-06-06T12:55:10.966Z"),
		"wMajorityWriteAvailabilityDate" : ISODate("2021-06-06T12:55:11.129Z")
	},
	"members" : [
		{
			"_id" : 0,
			"name" : "mongodb_1:27017",
			"health" : 1,
			"state" : 1,
			"stateStr" : "PRIMARY",
			"uptime" : 373,
			"optime" : {
				"ts" : Timestamp(1622984261, 1),
				"t" : NumberLong(1)
			},
			"optimeDate" : ISODate("2021-06-06T12:57:41Z"),
			"syncSourceHost" : "",
			"syncSourceId" : -1,
			"infoMessage" : "",
			"electionTime" : Timestamp(1622984110, 1),
			"electionDate" : ISODate("2021-06-06T12:55:10Z"),
			"configVersion" : 1,
			"configTerm" : 1,
			"self" : true,
			"lastHeartbeatMessage" : ""
		},
		{
			"_id" : 1,
			"name" : "mongodb_2:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 161,
			"optime" : {
				"ts" : Timestamp(1622984251, 1),
				"t" : NumberLong(1)
			},
			"optimeDurable" : {
				"ts" : Timestamp(1622984251, 1),
				"t" : NumberLong(1)
			},
			"optimeDate" : ISODate("2021-06-06T12:57:31Z"),
			"optimeDurableDate" : ISODate("2021-06-06T12:57:31Z"),
			"lastHeartbeat" : ISODate("2021-06-06T12:57:40.963Z"),
			"lastHeartbeatRecv" : ISODate("2021-06-06T12:57:39.691Z"),
			"pingMs" : NumberLong(0),
			"lastHeartbeatMessage" : "",
			"syncSourceHost" : "mongodb_1:27017",
			"syncSourceId" : 0,
			"infoMessage" : "",
			"configVersion" : 1,
			"configTerm" : 1
		},
		{
			"_id" : 2,
			"name" : "mongodb_3:27017",
			"health" : 1,
			"state" : 2,
			"stateStr" : "SECONDARY",
			"uptime" : 161,
			"optime" : {
				"ts" : Timestamp(1622984251, 1),
				"t" : NumberLong(1)
			},
			"optimeDurable" : {
				"ts" : Timestamp(1622984251, 1),
				"t" : NumberLong(1)
			},
			"optimeDate" : ISODate("2021-06-06T12:57:31Z"),
			"optimeDurableDate" : ISODate("2021-06-06T12:57:31Z"),
			"lastHeartbeat" : ISODate("2021-06-06T12:57:40.964Z"),
			"lastHeartbeatRecv" : ISODate("2021-06-06T12:57:39.691Z"),
			"pingMs" : NumberLong(0),
			"lastHeartbeatMessage" : "",
			"syncSourceHost" : "mongodb_1:27017",
			"syncSourceId" : 0,
			"infoMessage" : "",
			"configVersion" : 1,
			"configTerm" : 1
		}
	],
	"ok" : 1,
	"$clusterTime" : {
		"clusterTime" : Timestamp(1622984261, 1),
		"signature" : {
			"hash" : BinData(0,"4dhE9/LqXQwIPQGUNq8QoJR4quM="),
			"keyId" : NumberLong("6970663674377666563")
		}
	},
	"operationTime" : Timestamp(1622984261, 1)
}
```

Create test user

```
docker run  mongo:4.4 mongo --username root_user --password root_pass --host 172.17.0.1:27017  --authenticationDatabase admin admin  --eval "$(< mongo-create-user.js)"
```
```
MongoDB shell version v4.4.6
connecting to: mongodb://172.17.0.1:27017/admin?authSource=admin&compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("ac012f72-134a-4c50-af2d-77555d575974") }
MongoDB server version: 4.4.6
Successfully added user: {
	"user" : "tes_user",
	"roles" : [
		{
			"role" : "dbOwner",
			"db" : "tes_database"
		}
	]
}
```


# Connect to the MongoDB Cluster

```
mongodb://test_user:test_pass@mongodb_1:27017,mongodb_2:27017,mongodb_3:27017/test_database?replicaSet=rs1
```
```
mongodb://test_user:test_pass@172.17.0.1:27017,172.17.0.1:27117,172.17.0.1:27217/test_database?replicaSet=rs1
```

