# Webpack Template

[![Node.js CI](https://github.com/potykalov/webpack-template/actions/workflows/node-ci.yml/badge.svg)](https://github.com/potykalov/webpack-template/actions/workflows/node-ci.yml)
[![CodeQL](https://github.com/potykalov/webpack-template/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/potykalov/webpack-template/actions/workflows/github-code-scanning/codeql)
[![Dependabot Updates](https://github.com/potykalov/webpack-template/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/potykalov/webpack-template/actions/workflows/dependabot/dependabot-updates)

Шаблон JavaScript-проекта с готовым окружением для сборки, тестирования, линтинга и автоматических проверок.

Репозиторий настроен как **GitHub Template Repository** и предназначен для быстрого создания новых учебных JavaScript-проектов.

## Инструменты

- **Webpack 5** — development- и production-сборка
- **Webpack Dev Server** — локальный сервер с горячим обновлением
- **HTML, CSS, изображения и шрифты** — обработка ресурсов при сборке
- **Babel 8** — транспиляция JavaScript
- **Core-js** — полифиллы
- **Jest 30** — тестирование и покрытие кода
- **ESLint 10** — статический анализ кода
- **Husky 9** — pre-commit проверки
- **GitHub Actions** — CI
- **Dependabot** — обновление зависимостей
- **CodeQL** — анализ безопасности через GitHub default setup
- **Browserslist** — настройка поддержки браузеров
- **EditorConfig** — единый стиль файлов
- **Prettier ignore** — исключения для форматирования в Prettier, в том числе через расширение VS Code
- **Git attributes** — нормализация текстовых файлов

## Требования

- Node.js 26
- npm

## Использование

Нажмите **Use this template → Create a new repository** на странице репозитория.

После создания нового проекта клонируйте его:

```bash
git clone https://github.com/USERNAME/PROJECT-NAME.git
cd PROJECT-NAME
```

Установите зависимости:

```bash
npm install
```

После этого замените `PROJECT-NAME` в `package.json` на имя нового проекта и обновите:

- `repository.url`
- `bugs.url`
- `homepage`

Основная точка входа:

```text
src/index.js
```

## Команды

| Команда | Назначение |
| --- | --- |
| `npm start` | Сервер разработки на http://localhost:8080 |
| `npm run dev` | Development-сборка |
| `npm run prod` | Production-сборка |
| `npm test` | Запуск Jest |
| `npm run coverage` | Запуск Jest с отчётом о покрытии |
| `npm run lint` | Проверка ESLint |

Production-сборка создаётся в директории `dist/`.

## Тестирование

Jest собирает покрытие для JavaScript-файлов внутри `src/`, исключая тестовые файлы из `__tests__`.

Для покрытия строк установлен глобальный порог:

```text
100%
```

Названия отдельных тестов выводятся благодаря `verbose: true`.

Сам шаблон не содержит тестов. Обычный запуск:

```bash
npm test
```

завершится сообщением `No tests found`, пока в проект не будет добавлен хотя бы один тест.

Для Husky и CI отсутствие тестов обработано отдельно, чтобы пустой template repository мог проходить автоматические проверки.

## Husky

Перед каждым коммитом выполняются:

```bash
npm test -- --passWithNoTests && npm run lint
```

`--passWithNoTests` разрешает коммит, если тестовые файлы ещё не созданы.

Если тесты существуют и хотя бы один из них падает, коммит будет остановлен. После тестов также выполняется ESLint.

## CI

Workflow `.github/workflows/node-ci.yml` запускается при:

- `push` в `main`
- `pull_request` в `main`

Используется Node.js 26 и минимальное разрешение:

```yaml
permissions:
  contents: read
```

Основные этапы CI:

```text
npm ci
проверка наличия тестов
npm run coverage   # только если тесты найдены
npm run lint
npm run prod
```

Перед запуском coverage workflow проверяет наличие тестов через:

```bash
npx jest --listTests
```

Если тестов нет, coverage пропускается. Если тесты есть, выполняется:

```bash
npm run coverage
```

и применяется установленный в Jest порог покрытия.

Husky в GitHub Actions отключён через:

```text
HUSKY=0
```

поскольку необходимые проверки CI запускает самостоятельно.

## Dependabot

Dependabot автоматически проверяет обновления:

- npm-зависимостей — **раз в неделю**
- GitHub Actions — **раз в месяц**

Конфигурация находится в:

```text
.github/dependabot.yml
```

## CodeQL

CodeQL включён через **GitHub default setup**, поэтому отдельного CodeQL workflow в `.github/workflows/` нет.

После создания нового репозитория из шаблона при необходимости проверьте настройку CodeQL в **Settings → Security → Code security**.

## Структура

```text
.
├── .github/
│   ├── workflows/
│   │   └── node-ci.yml
│   └── dependabot.yml
├── .husky/
│   └── pre-commit
├── src/
│   ├── app.js
│   ├── index.js
│   ├── index.html
│   └── css/
│       └── style.css
├── .browserslistrc
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .prettierignore
├── babel.config.js
├── eslint.config.js
├── jest.config.js
├── package.json
├── package-lock.json
├── webpack.config.js
├── LICENSE
└── README.md
```

## Дополнительные настройки

### `.gitignore`

Из Git исключены:

```text
node_modules/
dist/
coverage/
```

### `.gitattributes`

```gitattributes
* text=auto
```

Git автоматически определяет текстовые файлы и нормализует окончания строк.

### `.editorconfig`

Для файлов используются:

- UTF-8
- отступ в 2 пробела
- LF
- финальный перенос строки

### `.browserslistrc`

```text
defaults
```

### `.prettierignore`

```text
dist/
```

Директория сборки исключена из форматирования Prettier. Файл также используется расширением Prettier в VS Code.

## Лицензия

MIT
