FROM rust:1.61

WORKDIR /workspace
RUN rustup update
RUN rustup component add clippy && rustup component add rustfmt

RUN ln -s /workspace/cargo-projects/cosm-base /usr/local/cargo/registry

CMD ["/bin/bash"]