#!/bin/sh
set -e

: ${SERVER_BIND:=":8080"}
: ${CRAWLER_STRESSFAKTOR_URI:="https://stressfaktor.squat.net/termine.php?days=all"}
: ${CRAWLER_LOCATION:="Europe/Berlin"}
: ${DB_PATH:="/opt/fakt/db/db.sqlite3"}
: ${LOG_VERBOSE:=false}
: ${MIGRATIONS_PATH:="/opt/fakt/migrations"}
: ${MIGRATIONS_DISABLED:="false"}

if [ "$1" = 'fakt' ]; then
	cd /opt/fakt;
	exec ./fakt \
		-server.bind=${SERVER_BIND} \
		-crawler.stressfaktor.uri=${CRAWLER_STRESSFAKTOR_URI} \
		-crawler.location=${CRAWLER_LOCATION} \
		-db.path=${DB_PATH} \
		-log.verbose=${LOG_VERBOSE} \
		-migrations.path=${MIGRATIONS_PATH} \
		-migrations.disabled=${MIGRATIONS_DISABLED}
fi

exec "$@"