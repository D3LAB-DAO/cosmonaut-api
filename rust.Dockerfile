FROM rust:1.61

WORKDIR /workspace
RUN rustup update
RUN rustup component add clippy && rustup component add rustfmt

ARG USER_ID
ARG GROUP_ID
RUN addgroup --gid $GROUP_ID ljs
RUN adduser --disabled-password --gecos '' --uid $USER_ID --gid $GROUP_ID ljs
USER ljs

CMD ["/bin/bash"]