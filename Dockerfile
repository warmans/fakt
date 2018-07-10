
FROM alpine:latest

#enable CGO (required for sqlite) and tzdata (required for time.Location)
RUN apk update && \
	apk --no-cache add ca-certificates &&\
	update-ca-certificates && \
	apk add openssl && \
	apk add --update curl gnupg tzdata && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://raw.githubusercontent.com/sgerrand/alpine-pkg-glibc/master/sgerrand.rsa.pub &&\
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.23-r3/glibc-2.23-r3.apk && apk add glibc-2.23-r3.apk

RUN mkdir -p /opt/fakt/static && \
    mkdir -p /opt/fakt/db && \
    mkdir -p /opt/fakt/migrations && \
    mkdir -p /opt/fakt/ui

COPY ./build /opt/fakt
COPY ./docker-entrypoint.sh /opt/fakt
COPY ./api/migrations/ /opt/fakt/migrations
COPY ./ui/dist/ /opt/fakt/dist

EXPOSE 8080
ENTRYPOINT ["/opt/fakt/docker-entrypoint.sh"]
CMD ["fakt"]
