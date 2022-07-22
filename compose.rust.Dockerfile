FROM rust:1.61

WORKDIR /workspace
RUN rustup update
RUN rustup component add clippy && rustup component add rustfmt

RUN ln -s /workspace/cargo-projects/cosm-base /usr/local/cargo/registry

# just for test env
RUN apt-get update
RUN apt-get install vim -y

CMD ["/bin/bash"]