.PHONY: rust-build clippy clean rust-init cargofmt rustfmt


TARGET_PATH =

USER_ID =
LESSON =
CHAPTER =
COSM_ROOT = "/workspace/cargo-projects"
COSM_LIB = "cosm-base"
SKELETON_PATH = "skeleton/lesson${LESSON}/chapter${CHAPTER}/contracts"
RUNNER_PATH = "lessons/lesson$(LESSON)/chapter$(CHAPTER)"
USER_CONTRACT_PATH = "cosm/${USER_ID}/lesson${LESSON}/chapter${CHAPTER}"

# For local machine
DOCKER_IMG ?="cosmo-rust:1.0"
SAVE_ROOT ?="$(CURDIR)/cargo-projects"

# For Docker Compose
COMPOSE_MAIN ?= "cosmonaut-1"
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
	@mkdir -p $(COSM_ROOT)/$(USER_CONTRACT_PATH)
	@cp -r $(COSM_ROOT)/$(COSM_LIB)/$(SKELETON_PATH) $(COSM_ROOT)/$(USER_CONTRACT_PATH)
	@cp -r $(COSM_ROOT)/$(COSM_LIB)/$(RUNNER_PATH)/* $(COSM_ROOT)/$(USER_CONTRACT_PATH)/
else
	@mkdir -p $(SAVE_ROOT)/$(USER_CONTRACT_PATH)
	@cp -r $(SAVE_ROOT)/$(COSM_LIB)/$(SKELETON_PATH) $(SAVE_ROOT)/$(USER_CONTRACT_PATH)
	@cp -r $(SAVE_ROOT)/$(COSM_LIB)/$(RUNNER_PATH)/* $(SAVE_ROOT)/$(USER_CONTRACT_PATH)/
endif

cargofmt:
ifeq (${COMPOSE},true)
	@docker run --rm -a stderr -a stdout \
	--volumes-from $(COMPOSE_MAIN) -v $(COSM_ROOT)/$(COSM_LIB)/$(COSM_ROOT)/$(COSM_LIB) \
	-w $(TARGET_PATH) $(COMPOSE_COSM_IMG) \
	bash -c "cargo fmt"
else
	@docker run -d --rm -v $(SAVE_ROOT):$(COSM_ROOT) -w $(TARGET_PATH) $(DOCKER_IMG) \
	bash -c "cargo fmt
endif

cosm-build:
ifeq (${COMPOSE},true)
	@docker run --rm -a stderr -a stdout \
	--volumes-from $(COMPOSE_MAIN) -v $(COSM_ROOT)/$(COSM_LIB)/$(COSM_ROOT)/$(COSM_LIB) \
	-w $(TARGET_PATH) $(COMPOSE_COSM_IMG) \
	bash -c "cargo run"
else
	@docker run --rm -a stderr -a stdout -v $(SAVE_ROOT):$(COSM_ROOT) -w $(TARGET_PATH) $(DOCKER_IMG) \
	bash -c "cargo run"
endif

cosm-clean:
ifeq (${COMPOSE},true)
	@docker run --rm -a stderr -a stdout \
	--volumes-from $(COMPOSE_MAIN) -v $(COSM_ROOT)/$(COSM_LIB)/$(COSM_ROOT)/$(COSM_LIB) \
	-w $(TARGET_PATH) $(COMPOSE_COSM_IMG) \
	bash -c "cargo clean"
else
	@docker run -d --rm -v $(SAVE_ROOT):$(COSM_ROOT) -w $(TARGET_PATH) $(DOCKER_IMG) \
	bash -c "cargo clean"
endif

clippy:
ifeq (${COMPOSE},true)
	@docker run --rm -a stderr -a stdout \
	--volumes-from $(COMPOSE_MAIN) -v $(COSM_ROOT)/$(COSM_LIB)/$(COSM_ROOT)/$(COSM_LIB) \
	-w $(TARGET_PATH) $(COMPOSE_COSM_IMG) \
	bash -c "cargo clippy 2>&1"
else
	@docker run --rm -a stderr -a stdout -v $(SAVE_ROOT):$(COSM_ROOT) -w $(TARGET_PATH) $(DOCKER_IMG) \
	bash -c "cargo clippy 2>&1"
endif