# template-testing-tool

## Table of contents

- [Project spec](#project-spec)
- [Installation](#installation)
  - [Execute Test API](#execute-test-api)
  - [Execute Test E2E](#execute-test-e2e)
- [Package Manager](#package-manager)
- [Git](#git)
  - [Commit](#commit)
  - [File name convention](#file-name-convention)
- [Tool](#tool)
  - [Script Editor](#script-editor)

---

### Project spec

|                  |                            |
| ---------------- | -------------------------- |
| Language         | `NodeJS:22.13.1`           |
| Datetime format  | `2025-01-31T17:00:00.000Z` |
| Lint style       | `prettier`                 |
| Unit test        | `playwright`               |
| Package Manager  | `pnpm`                     |

- Install package manager `npm install -g pnpm`
- Install libraries `pnpm install`
- Install test browser `npx playwright install`

---

### Installation

#### Execute Test API

run command:

```shell
pnpm run test:api
```

#### Execute Test E2E

run command:

```shell
pnpm run test:e2e
```

---

### Package Manager

This project uses [pnpm](https://pnpm.io/) as the package manager. See [PNPM.md](PNPM.md) for more details about working with pnpm in this project.

---

### Git

#### Commit

[Git commit message convention that you can follow](https://dev.to/i5han3/git-commit-message-convention-that-you-can-follow-1709)

</br>

---

#### File name convention

Use lower-case for naming file ex. `hello-world.js`

</br>

---

### Tool

- VS Code

#### Script Editor

- VS Code
  - Plugins
    - Follow file [extensions.json](.vscode/extensions.json)
