#!/bin/bash

mongosh --username root --password password admin <<-EOF
	use festival-fanatic;
    db.dropDatabase();
EOF