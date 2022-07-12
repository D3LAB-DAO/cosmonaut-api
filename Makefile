.PHONY: rust-build clippy clean rust-init cargofmt rustfmt

DOCKER_IMG = "cosmo-rust:1.0"
OWNER ?= "test-account"
PROJ ?= "lesson1"
LEC ?= "ch1"
PREFIX_PATH ?= "cargo-projects/cosm"
TARGET_PATH = "$(OWNER)/$(PROJ)/$(LEC)"

rustfmt:
	@docker run --rm -i -a stdout $(DOCKER_IMG) rustfmt;

cosm-init:
	@docker run -d --rm -v $(CURDIR)/cargo-projects:/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "./scripts/init.sh --path cosm/$(TARGET_PATH) --clean";

cargofmt:
	@docker run -d --rm -v $(CURDIR)/$(PREFIX_PATH)/$(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo fmt";

cosm-build:
	@docker run --rm -a stderr -a stdout \
	-v $(CURDIR)/$(PREFIX_PATH)/$(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo run";

cosm-clean:
	@docker run -d --rm -v $(CURDIR)/$(PREFIX_PATH)/$(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo clean";

clippy:
	@docker run --rm  -a stderr -a stdout \
	-v $(CURDIR)/$(PREFIX_PATH)/$(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo clippy 2>&1";
