# CI/CD — GeekChat

Модель: runner → `docker save` → scp → `docker load` → `compose up` без `--build`. Registry нет.

## Workflows

| Событие | Workflow | Действие |
|---------|----------|----------|
| PR → `main` / `dev` | `ci.yml` | сборка образов + import-smoke |
| merge PR → `main` | `deploy-main.yml` | deploy **prod** |
| merge PR → `dev` | `deploy-dev.yml` | deploy **dev** (Environment пока не создаём) |
| `workflow_dispatch` | deploy-* | ручной redeploy |

## Environment `prod`

Пользователь VPS: `geekchat-prod`. Хост/пути — только в GitHub Variables.

### Secrets

| Name | Значение |
|------|----------|
| `SSH_PRIVATE_KEY` | deploy-ключ пользователя `geekchat-prod` (private) |
| `POSTGRES_PASSWORD` | сырой пароль БД |

`DATABASE_URL` **не** нужен — собирается в `scripts/vps-write-deploy-env.sh` (`postgresql+asyncpg://…@db:5432/…`, URL-encode пароля, `$` → `$$` для Compose).  
`BASE_URL` тоже пишется из `APP_PUBLIC_URL` (публичный URL для join-ссылок).

### Variables

| Name | Смысл / пример |
|------|----------------|
| `SERVER_HOST` | IP VPS |
| `SERVER_USER` | `geekchat-prod` |
| `SERVER_PATH` | каталог кода prod |
| `DATA_PATH` | каталог данных prod |
| `COMPOSE_PROJECT_NAME` | `geekchat-prod` |
| `NGINX_PORT` | `3121` |
| `ACCESS_VIA_DOMAIN` | `false` до TLS |
| `APP_DOMAIN` | `geek-chat.ru` |

Опционально (есть дефолты): `POSTGRES_USER=geekchat`, `POSTGRES_DB=geekchat`.

### VPS

На сервере: Docker, Compose plugin, **rsync**.

Пока `ACCESS_VIA_DOMAIN=false`: healthcheck `http://$SERVER_HOST:3121/health`.  
После host nginx + TLS: `ACCESS_VIA_DOMAIN=true` → `https://geek-chat.ru/health`.

Хостовый nginx (позже): `deploy/host-nginx/` — выкладка в `/etc/nginx` вручную.

### Сборка frontend

Перед `docker build` нужен `frontend/dist/` (`npm ci && npm run build`). В CI/deploy это шаг workflow; локально — вручную (в образе только nginx + static).
