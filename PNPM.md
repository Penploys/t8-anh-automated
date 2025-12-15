# Using pnpm in this project

This project uses [pnpm](https://pnpm.io/) as the package manager instead of npm. pnpm offers several advantages:

- Faster installation speeds
- Efficient disk space usage through content-addressable storage
- Strict dependency management
- Improved security with a non-flat node_modules structure

## Getting Started

If you haven't installed pnpm yet, you can install it via npm:

```bash
npm install -g pnpm
```

Or with other methods as described in the [official documentation](https://pnpm.io/installation).

## Common Commands

Replace `npm` with `pnpm` in all commands:

| npm command         | pnpm equivalent  | Description               |
| ------------------- | ---------------- | ------------------------- |
| `npm install`       | `pnpm install`   | Install all dependencies  |
| `npm run test`      | `pnpm test`      | Run tests                 |
| `npm run build`     | `pnpm build`     | Build the project         |
| `npm start`         | `pnpm start`     | Start the application     |
| `npm run start:dev` | `pnpm start:dev` | Start in development mode |

## IDE Integration

Most modern IDEs support pnpm. For VS Code, the built-in npm scripts view works with pnpm scripts as well.

## Troubleshooting

If you encounter any issues with pnpm:

1. Make sure you're using the latest version of pnpm
2. Try clearing pnpm's cache with `pnpm store prune`
3. Delete `node_modules` and run `pnpm install` again
