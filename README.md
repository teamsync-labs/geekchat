# GeekChat

MVP видеочата (P2P) — учебный проект командной стажировки TeamSync Labs.

**Статус:** Development

## Roadmap

MVP · фаза 1 · P2P

| Неделя | Цель |
|--------|------|
| 1 | ☐ Kickoff & Dev Setup |
| 2 | ☐ Design & Signaling |
| 3 | ☐ P2P |
| 4 | ☐ Auth & Rooms |
| 5 | ☐ Landing & Call UI |
| 6 | ☐ MVP Ready |

## Структура

```
backend/           API, signaling
frontend/          клиент
docs/              спецификации
infra/             деплой и окружения
.github/workflows/ CI/CD
```

## Документация

- [SRS](docs/SRS_GeekChat.md)
- [Участие в разработке](CONTRIBUTING.md)

## Локальный запуск

```bash
docker compose up
```
