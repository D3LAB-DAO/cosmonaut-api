.PHONY: rust-build clippy clean rust-init cargofmt

DOCKER_IMG = "cosmo-rust:1.0"
CONTAINER_NAME ?= "cosmonaut"
OWNER ?= "tkxkd0159"
PROJ ?= "lesson1"
LEC ?= "ch1"
TARGET_PATH = "cosm/$(OWNER)/$(PROJ)/$(LEC)"

cargofmt:
	docker run -d --rm -v $(CURDIR)/cargo-projects/$(TARGET_PATH):/workspace -w /workspace \
	cosmo-rust:1.0 bash -c "cargo fmt";

cosm-init:
	docker run -d --rm -v $(CURDIR)/cargo-projects:/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "./scripts/init.sh --path $(TARGET_PATH) --clean";

cosm-build:
	docker run -d --rm -v $(CURDIR)/cargo-projects:/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "./scripts/build.sh --path=$(TARGET_PATH)";

cosm-clean:
	docker run -d --rm -v $(CURDIR)/cargo-projects:/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "./scripts/clean.sh --path=$(TARGET_PATH)";

clippy:
	docker run -d --rm -v $(CURDIR)/cargo-projects:/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "./scripts/build.sh --path=$(TARGET_PATH)";

TARGET_RM = $(shell docker ps -a --format "{{.Names}}"|grep "^$(CONTAINER_NAME)$$")
clean:
	@if docker ps -a --format "{{.Names}}" | grep "^$(CONTAINER_NAME)$$" > /dev/null; \
	then docker stop $(TARGET_RM) > /dev/null && docker rm $(TARGET_RM); \
	else echo "** There is no target container to remove **"; fi
