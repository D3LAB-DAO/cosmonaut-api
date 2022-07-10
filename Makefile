.PHONY: rust-build clippy clean rust-init cargofmt rustfmt

DOCKER_IMG = "cosmo-rust:1.0"
CONTAINER_NAME ?= "cosmonaut"
OWNER ?= "tkxkd0159"
PROJ ?= "lesson1"
LEC ?= "ch1"
TARGET_PATH = "cosm/$(OWNER)/$(PROJ)/$(LEC)"

FMTCON_NAME ?= "cosmrustfmt"
rustfmt:
	@docker run --rm -i -a stdout $(DOCKER_IMG) rustfmt;

cargofmt:
	@docker run -d --rm -v $(CURDIR)/cargo-projects/$(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo fmt";

cosm-init:
	@docker run -d --rm -v $(CURDIR)/cargo-projects:/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "./scripts/init.sh --path $(TARGET_PATH) --clean";

cosm-build:
	@docker run --rm -a stderr -a stdout \
	-v $(CURDIR)/cargo-projects/$(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo run";

cosm-clean:
	@docker run -d --rm -v $(CURDIR)/cargo-projects/$(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo clean";

clippy:
	@docker run --rm  -a stderr -a stdout \
	-v $(CURDIR)/cargo-projects/$(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo clippy 2>&1";

TARGET_RM = $(shell docker ps -a --format "{{.Names}}"|grep "^$(CONTAINER_NAME)$$")
clean:
	@if docker ps -a --format "{{.Names}}" | grep "^$(CONTAINER_NAME)$$" > /dev/null; \
	then docker stop $(TARGET_RM) > /dev/null && docker rm $(TARGET_RM); \
	else echo "** There is no target container to remove **"; fi
