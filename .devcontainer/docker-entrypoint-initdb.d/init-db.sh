#!/bin/bash

mongosh --username root --password password admin <<-EOF
	use festival-fanatic;
    db.createUser({user: "festival-fanatic", pwd: "password", roles: [ { role: "readWrite", db: "festival-fanatic"} ]});
EOF