FROM rust:1.61

WORKDIR /workspace
RUN rustup update
RUN rustup component add clippy && rustup component add rustfmt

CMD ["/bin/bash"]