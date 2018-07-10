PROJECT_OWNER=warmans
PROJECT_NAME=fakt
PROJECT_VERSION=4.0.0
DOCKER_NAME=$(PROJECT_OWNER)/$(PROJECT_NAME)

# Test
#-------------------------------------------------------------------

.PHONY: test.api
test.api:
	@go test ./api/pkg/server/...

.PHONY: test.ui
test.ui:
	@cd ui; npm run test

# Build
#-------------------------------------------------------------------

.PHONY: build
build: build.api build.ui

.PHONY: build.api
build.api:
	@GO15VENDOREXPERIMENT=1 GOOS=linux \
	go build \
	-ldflags "-X github.com/warmans/fakt/api/pkg/server.Version=$(PROJECT_VERSION)" \
	-o build/${PROJECT_NAME} \
	`go list ./api/cmd/server`

.PHONY: build.ui
build.ui:
	@cd ui; npm run ng build --prod --aot

# Packaging
#-----------------------------------------------------------------------

.PHONY: docker.build
docker.build:
	@docker build -t $(DOCKER_NAME):$(PROJECT_VERSION) .

.PHONY: docker.publish
docker.publish:
	@docker push $(DOCKER_NAME):$(PROJECT_VERSION)

.PHONY: publish
publish: build docker.build docker.publish

# Deployment
#----------------------------------------------------------------------

.PHONY: deploy
deploy:
	@cd ansible; ansible-playbook -i hosts playbook.yml

# Dev
#-------------------------------------------------------------------

.PHONY: start
start:
	$(MAKE) -j2 start.api start.ui

.PHONY: start.api
start.api:
	@mkdir -p tmp/static;
	@./build/fakt \
	  -db.path=tmp/db.sqlite3 \
	  -log.verbose=true \
	  -static.path=tmp/static \
	  -ui.path=ui/dist \
	  -migrations.path=api/migrations

.PHONY: start.ui
start.ui:
	@cd ui; npm run start.dev
