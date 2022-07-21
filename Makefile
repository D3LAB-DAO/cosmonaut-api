.PHONY: rust-build clippy clean rust-init cargofmt rustfmt

DOCKER_IMG ?="cosmo-rust:1.0"
TARGET_PATH =
SAVE_PATH ?="cargo-projects"

COMPOSE_MAIN ?= "cosmonaut-api-1"
COMPOSE_COSM_IMG ?= "cosmo-rust:dind"

.PHONY: test

rustfmt:
ifeq (${COMPOSE},true)
	@docker run --rm -i -a stdout $(COMPOSE_COSM_IMG) rustfmt
else
	@docker run --rm -i -a stdout $(DOCKER_IMG) rustfmt
endif

cosm-init:
ifeq (${COMPOSE},true)
	@docker run -d --rm --volumes-from $(COMPOSE_MAIN) -w /workspace $(COMPOSE_COSM_IMG) \
	bash -c "cd $(SAVE_PATH) && ./scripts/init.sh --path $(TARGET_PATH) --clean"
else
	@docker run -d --rm -v $(CURDIR)/$(SAVE_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "./scripts/init.sh --path $(TARGET_PATH) --clean"
endif

cargofmt:
ifeq (${COMPOSE},true)
	@docker run -d --rm --volumes-from $(COMPOSE_MAIN) -w $(TARGET_PATH) $(COMPOSE_COSM_IMG) \
	bash -c "cargo fmt"
else
	@docker run -d --rm -v $(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo fmt
endif

cosm-build:
ifeq (${COMPOSE},true)
	@docker run --rm -a stderr -a stdout --volumes-from $(COMPOSE_MAIN) -w $(TARGET_PATH) $(COMPOSE_COSM_IMG) \
	bash -c "cargo run"
else
	@docker run --rm -a stderr -a stdout -v $(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo run"
endif

cosm-clean:
ifeq (${COMPOSE},true)
	@docker run -d --rm --volumes-from $(COMPOSE_MAIN) -w $(TARGET_PATH) $(COMPOSE_COSM_IMG) \
	bash -c "cargo clean"
else
	@docker run -d --rm -v $(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo clean"
endif

clippy:
ifeq (${COMPOSE},true)
	@docker run --rm -a stderr -a stdout --volumes-from $(COMPOSE_MAIN) -w $(TARGET_PATH) $(COMPOSE_COSM_IMG) \
	bash -c "cargo clippy 2>&1"
else
	@docker run --rm -a stderr -a stdout -v $(TARGET_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "cargo clippy 2>&1"
endif

skeleton-init:
ifeq (${COMPOSE},true)
	@docker run -d --rm --volumes-from $(COMPOSE_MAIN) -w /workspace $(COMPOSE_COSM_IMG) \
	bash -c "cd $(SAVE_PATH) && ./scripts/init_skeleton.sh ${USER_ID} ${WHICH_LESSON} ${WHICH_CHAPTER}
else
	@docker run -d --rm -v $(CURDIR)/$(SAVE_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "./scripts/init_skeleton.sh ${USER_ID} ${WHICH_LESSON} ${WHICH_CHAPTER}
endif

run-contract:
ifeq (${COMPOSE},true)
	@docker run -d --rm --volumes-from $(COMPOSE_MAIN) -w /workspace $(COMPOSE_COSM_IMG) \
	bash -c "cd $(SAVE_PATH) && ./scripts/run.sh ${USER_ID} ${WHICH_LESSON} ${WHICH_CHAPTER}
else
	@docker run -d --rm -v $(CURDIR)/$(SAVE_PATH):/workspace -w /workspace $(DOCKER_IMG) \
	bash -c "./scripts/run.sh ${USER_ID} ${WHICH_LESSON} ${WHICH_CHAPTER}
endif