# An examples playground to experiment with Three.js concepts and features

## Overview

This repository contains a series of Three.js examples and is meant to serve as a playground to explore and experiment with Three.js concepts and features.

## Repository Structure

This repository is set up as a _monorepo_ using [Turborepo](https://turborepo.org/) in combination with [pnpm Workspaces](https://pnpm.io/workspaces).

## Setup

### Environment Setup

https://github.com/nvm-sh/nvm

```bash
# install node version specified in .nvmrc
nvm install
```

```bash
# switch node version to the one specified in .nvmrc
nvm use
```

Install [pnpm](https://pnpm.io/)

```bash
# Install "pnpm" as global package if you don't have it already:
npm i -g pnpm
```

### Project Setup

```bash
# Install all node packages
pnpm i
```

```bash
# Will generate production build for all subprojects at once using Turborepo:
pnpm run build
```

```bash
# Will generate production build for all subprojects while forcing Turborepo to flush its cache
pnpm run build:force
```

## Running production build of apps

```bash
pnpm run build
pnpm run preview --filter=sorting-game-app
```

## Running the Apps in Development Mode with HMR

To run any of the experience apps (app or editor), there is two options:

**Option 1:** Use Turborepo's filter feature from the root of the project.

```bash
pnpm run dev --filter=sorting-game-app # use name from package.json file
```

Multiple filters can be used at once too. See [turborepo filter syntax](https://turborepo.org/docs/core-concepts/filtering#filter-syntax) documentation.

**Option 2:** Change directory into the specific project folder and run `pnpm run dev`.

```bash
cd apps/sorting-game/app # for example
pnpm run dev
```

## Misc

```bash
# Add eslint to a particular project, mainly to check react hooks dependency arrays
pnpm add -D eslint eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks
```

```bash
# To ignore formatting commits in git blame, run the following command to configure your local git repo
git config blame.ignoreRevsFile .git-blame-ignore-revs
```
