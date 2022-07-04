FROM rust:1.61

RUN rustup update
RUN rustup component add clippy && rustup component add rustfmt

CMD ["/bin/bash"]