# Tony engine runtime.
#
# Runs the vendored Letta Code source from this repository (letta-code/) in
# Bun dev mode — NOT the upstream npm artifact — so local changes to the
# vendored source take effect. See docs/05-dev-guide.md.

FROM node:22.19-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

# System deps mirroring letta-code/docker/Dockerfile (runtimes & tools the
# agent may use), minus the npm global install of letta-code itself.
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
      ca-certificates \
      cron \
      curl \
      dnsutils \
      file \
      git \
      iproute2 \
      iputils-ping \
      jq \
      lsof \
      make \
      g++ \
      netcat-openbsd \
      openssh-client \
      procps \
      python3 \
      wget; \
    ln -sf /usr/bin/python3 /usr/local/bin/python; \
    rm -rf /var/lib/apt/lists/*

# Bun (pinned 1.3.x line, matching letta-code packageManager bun@1.3.0)
COPY --from=oven/bun:1.3 /usr/local/bin/bun /usr/local/bin/bun

# Vendored engine source
WORKDIR /app
COPY letta-code/ ./
RUN bun install --frozen-lockfile

# Cron dirs used by the engine's scheduling feature
ENV LETTA_SYSTEM_CRON_DIR=/root/.letta/system-cron \
    LETTA_SYSTEM_ROOT_CRONTAB=/root/.letta/system-crontab/root

# Terminal defaults required by the TUI (Ink) inside the container
ENV TERM=xterm-256color \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

COPY --chmod=755 docker/entrypoint.sh /usr/local/bin/tony-entrypoint

# The agent works on /workspace (mount whatever Tony should access).
WORKDIR /workspace
ENTRYPOINT ["/usr/local/bin/tony-entrypoint"]
