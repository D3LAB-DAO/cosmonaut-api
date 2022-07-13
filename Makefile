.PHONY: rust-build clippy clean rust-init cargofmt rustfmt

DOCKER_IMG = "cosmo-rust:1.0"
TARGET_PATH =
SAVE_PATH= "cargo-projects"

COMPOSE_MAIN = "cosmonaut-api-1"
COMPOSE_COSM_IMG = "cosmo-rust:dind"


rustfmt:
	@docker run --rm -i -a stdout $(DOCKER_IMG) rustfmt;

cosm-init:
	@if [ ${COMPOSE} = "true" ]; \
	then docker run -d --rm --volumes-from $(COMPOSE_MAIN) -w /workspace $(COMPOSE_COSM_IMG) \
	bash -c "cd $(SAVE_PATH) && ./scripts/init.sh --path $(TARGET_PATH) --clean"; \
	else docker run -d --rm -v $(CURDIR)/$(SAVE_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "./scripts/init.sh --path $(TARGET_PATH) --clean"; fi

cargofmt:
	@if [ ${COMPOSE} = "true" ]; \
	then docker run -d --rm --volumes-from $(COMPOSE_MAIN) -w $(TARGET_PATH) $(COMPOSE_COSM_IMG) \
	bash -c "cargo fmt"; \
	docker run -d --rm -v $(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo fmt"; fi

cosm-build:
	@if [ ${COMPOSE} = "true" ]; \
	then docker run --rm -a stderr -a stdout --volumes-from $(COMPOSE_MAIN) -w $(TARGET_PATH) $(COMPOSE_COSM_IMG) \
	bash -c "cargo run"; \
	else docker run --rm -a stderr -a stdout \
	-v $(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo run"; fi

cosm-clean:
	@if [ ${COMPOSE} = "true" ]; \
	then docker run -d --rm --volumes-from $(COMPOSE_MAIN) -w $(TARGET_PATH) $(COMPOSE_COSM_IMG) \
	bash -c "cargo clean"; \
	docker run -d --rm -v $(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo clean"; fi

clippy:
	@if [ ${COMPOSE} = "true" ]; \
	then docker run --rm -a stderr -a stdout --volumes-from $(COMPOSE_MAIN) -w $(TARGET_PATH) $(COMPOSE_COSM_IMG) \
	bash -c "cargo clippy 2>&1"; \
	else docker run --rm -a stderr -a stdout \
	-v $(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo clippy 2>&1"; fi
