#!/usr/bin/env bash
# Пишет .env для Docker Compose (не bash source).
# Не использовать printf %q — shell-экранирование ломает Compose/--env-file.
set -euo pipefail

ENV_FILE="${1:?usage: vps-write-deploy-env.sh <outfile>}"

: >"$ENV_FILE"

write_kv_compose() {
  local key="$1"
  local value="$2"
  local escaped="$value"
  escaped="${escaped//\\/\\\\}"
  escaped="${escaped//\"/\\\"}"
  escaped="${escaped//\$/\$\$}"
  printf '%s="%s"\n' "$key" "$escaped" >>"$ENV_FILE"
}

: "${IMAGE_PREFIX:?}"
: "${IMAGE_TAG:?}"
: "${COMPOSE_PROJECT_NAME:?}"
: "${POSTGRES_USER:?}"
: "${POSTGRES_PASSWORD:?}"
: "${POSTGRES_DB:?}"
: "${NGINX_PORT:?}"
: "${NGINX_BIND:?}"
: "${ACCESS_VIA_DOMAIN:?}"
: "${APP_DOMAIN:?}"
: "${APP_PUBLIC_URL:?}"
: "${HEALTHCHECK_URL:?}"
: "${DATA_PATH:?}"
: "${JWT_SECRET:?}"

pass_enc="$(
  POSTGRES_PASSWORD="$POSTGRES_PASSWORD" python3 -c \
    'import os, urllib.parse; print(urllib.parse.quote(os.environ["POSTGRES_PASSWORD"], safe=""))'
)"
# GeekChat backend — async SQLAlchemy (postgresql+asyncpg://), хост сервиса `db`
DATABASE_URL="postgresql+asyncpg://${POSTGRES_USER}:${pass_enc}@db:5432/${POSTGRES_DB}"

write_kv_compose IMAGE_PREFIX "$IMAGE_PREFIX"
write_kv_compose IMAGE_TAG "$IMAGE_TAG"
write_kv_compose COMPOSE_PROJECT_NAME "$COMPOSE_PROJECT_NAME"

write_kv_compose POSTGRES_USER "$POSTGRES_USER"
write_kv_compose POSTGRES_PASSWORD "$POSTGRES_PASSWORD"
write_kv_compose POSTGRES_DB "$POSTGRES_DB"
write_kv_compose DATABASE_URL "$DATABASE_URL"

# join_url и публичные ссылки backend
write_kv_compose BASE_URL "$APP_PUBLIC_URL"
write_kv_compose APP_PUBLIC_URL "$APP_PUBLIC_URL"

# auth (algorithm/TTL — дефолты в backend/core/config.py)
write_kv_compose JWT_SECRET "$JWT_SECRET"

write_kv_compose NGINX_PORT "$NGINX_PORT"
write_kv_compose NGINX_BIND "$NGINX_BIND"
write_kv_compose ACCESS_VIA_DOMAIN "$ACCESS_VIA_DOMAIN"
write_kv_compose APP_DOMAIN "$APP_DOMAIN"
write_kv_compose HEALTHCHECK_URL "$HEALTHCHECK_URL"

write_kv_compose DATA_PATH "$DATA_PATH"

chmod 600 "$ENV_FILE"
