.PHONY: rust-build clippy clean rust-init cargofmt rustfmt

DOCKER_IMG = "cosmo-rust:1.0"
TARGET_PATH =

rustfmt:
	@docker run --rm -i -a stdout $(DOCKER_IMG) rustfmt;

cosm-init:
	@docker run -d --rm -v $(CURDIR)/cargo-projects:/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "./scripts/init.sh --path $(TARGET_PATH) --clean";

cargofmt:
	@docker run -d --rm -v $(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo fmt";

cosm-build:
	@docker run --rm -a stderr -a stdout \
	-v $(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo run";

cosm-clean:
	@docker run -d --rm -v $(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo clean";

clippy:
	@docker run --rm  -a stderr -a stdout \
	-v $(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo clippy 2>&1";
