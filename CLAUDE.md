# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

TypeScript client library for the MoneyForward Cloud Invoice API v3 (マネーフォワード クラウド請求書API v3), distributed as a **Google Apps Script (GAS) library** — not a standalone app or server. Consumers add it by script ID inside their own GAS project bound to a spreadsheet. Full usage docs: https://wywy.jp/docs/mfapi-v3-client/reference

## Commands

- `npm run lint` — runs `license-check-and-add add` (prepends Apache-2.0 headers; per `license-config.json` this covers `.ts`/`.js`/`.mjs` **and** `.md`/`.html`/shell scripts, excluding only `README.md` and a few ignored paths) **then** `eslint --fix`. This is **not read-only**: it mutates files.
- `npm run lint:fix` — `eslint --fix` only, no license header pass.
- `npm run format` — `prettier --write src/ test/`.
- `npm run typecheck` — `tsc --noEmit`.
- `npm test` — `jest test/ --passWithNoTests --detectOpenHandles`. Run a single file: `npx jest test/lib/date-util.test.ts`.
- A `husky` pre-commit hook (`.husky/pre-commit`) runs `lint-staged` (eslint --fix + prettier --write, plus `jest --findRelatedTests` for `src/**/*.ts`) followed by `tsc --noEmit` on every commit — most lint/format issues are caught automatically at commit time.
- `npm run build` — cleans, bundles via Rollup into `dist/` (note: `package.json` `main` says `build/index.js`, but the actual bundler output directory is `dist/` — this is a pre-existing inconsistency, not a bug to silently "fix").
- `npm run deploy` — lint + test + build, then swaps in `.clasp-dev.json` and `clasp push -f` to the **dev** GAS project. Safe for Claude to run autonomously.
- `npm run deploy:prod` — same but swaps in `.clasp-prod.json` and `clasp push` (no `-f`) to the **production** GAS project consumed by real users. **Always confirm with the user before running this** — it is a production deploy, not a reversible local action.
- Both deploy commands require `.clasp-dev.json` / `.clasp-prod.json` locally (gitignored, not in-repo) and a `clasp login` session.

## Structure

- `src/index.ts` — the GAS-exposed public API surface (`createClient`, `getPaymentStatus`, `getOrderStatus`, `mfCallback`, etc.) that consuming GAS projects call directly.
- `src/lib/` — core infra: `mf-client.ts` (API client), `mf-oauth2.ts` (OAuth2 flow), `date-util.ts`, `text-link-util.ts`.
- `src/service/` — one file per MF Invoice API resource (`billing-service.ts`, `quote-service.ts`, `partner-service.ts`, `item-service.ts`, `office-service.ts`), all extending `service-base.ts`.
- `src/@types/` — `.d.ts` declarations mirroring each `lib/`/`service/` module 1:1.
- Runtime depends on an external GAS library (`OAuth2` / `apps-script-oauth2`, declared in `appsscript.json`) that is **not** an npm dependency — it won't show up in `package.json`.

## Testing

- Only `src/lib/date-util.ts` has unit tests (`test/lib/date-util.test.ts`). Everything in `src/service/`, the OAuth flow, and the HTTP client is currently validated manually against the live MF API via a bound spreadsheet, not locally.
- When modifying a `src/service/*.ts` or `src/lib/*.ts` file, add unit tests where feasible (mock GAS globals like `UrlFetchApp`/`PropertiesService` rather than hitting the live API), following the existing style in `test/lib/date-util.test.ts`.

## Conventions

- Commit messages: `<English capitalized verb> <Japanese description>` (e.g. `Add 品目の削除`, `Fix OAuth スコープに data.read を追加`). This is **not** Conventional Commits (`feat:`/`fix:`) — use `Add`/`Fix`/`Refactor`/`Del`/`Verup`/`Doc`-style prefixes with a Japanese subject.
- Formatting: 2-space indent, single quotes, trailing commas (`es5`), enforced via ESLint flat config (`eslint.config.mjs`, ESLint v9 + `typescript-eslint` + `eslint-plugin-n` + `prettier`) — see `eslint.config.mjs` / `.prettierrc.json`.
- No CI pipeline exists in this repo. The husky pre-commit hook covers lint/format/typecheck automatically, but `npm run build` and the full `npm test` suite must still be run manually before pushing or deploying.
