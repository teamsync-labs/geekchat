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
## Запуск из виртуального окружения

1. В Windows запустите командную оболочку cmd.exe или PowerShell, в Linux запустите терминал.
<br><br>
2. В локальном репозитории перейдите в директорию приложения:
- OS Windows >
```
cd .\geekchat\backend
```
- OS Linux >
```
cd ./geekchat/backend
```
3. Создайте виртуальное окружение:
- OS Windows >
```
python -m venv venv
```
- OS Linux >
```
python3 -m venv venv
```
4. Активируйте окружение:
- OS Windows >
```
.\venv\Scripts\activate
```
- OS Linux >
```
source venv/bin/activate
```
    После активации в командной строке появится префикс (venv) — это значит, что всё, что вы запускаете и устанавливаете, относится к окружению.
    Деактивировать можно командой: 'deactivate'
5. Установите зависимости проекта:
```
pip install -r requirements.txt
```
6. Запустите сервер:
```
uvicorn main:app
```
- После успешного запуска перейдите в браузере по ссылке: [http://localhost:8000/health](http://localhost:8000/health)
```
Вы должны увидеть успешный статус !   Status: OK
```
- Чтобы посмотреть спецификацию API, перейдите по ссылке: [http://localhost:8000/docs](http://localhost:8000/docs)
---

## Запуск фронтенда (GeekChat)

Проект находится в папке `frontend/`.

### Требования
- Node.js (версия 18 или выше)
- npm

### Установка и запуск

```bash
# Перейдите в папку фронтенда
cd frontend

# Установите зависимости
npm install

# Запустите сервер разработки
npm run dev
```
