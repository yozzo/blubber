# Blubber

Blubber is a framework designed to act as a JSON client and
provide tools to build a CRUD application using GDS styles.

Blubber stands for.. nothing, it was picked because the npm
package name was available.

The main components of Blubber are:

- Promise based JSON API Client
- Entity collection lists with sorting and filtering
- Entity displays display
- Form definition and generation
- Form post handling
- Transformation between API interface and form data
- Nunjucks macros for rendering GDS style list/form layout
- Sass library to enhance GDS styles

## Linting/Formatting

This project uses a combination of [Airbnb](https://www.npmjs.com/package/eslint-config-airbnb)
[ESLint](https://eslint.org/) rules and [Prettier](https://prettier.io/) to keep source code
formatting consistent. The configuration for eslint tells it to ignore Airbnb's rules for code
formatting but apply it's language rules, while leaving formatting up to Prettier.

A git hook has been setup to run prettier and eslint for each file Javascript commited.

### Editor Integration

To avoid surprises and know what your code will look like when it is commited it's a good idea
to install the Prettier plugin for your IDE of choice, alongside the plugin for eslint.

#### Visual studio code

For Visual Studio Code, install the [Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) plugin. You can then manually tell the editor to reformat your source or set `"editor.formatOnSave": true` in your workspace settings.

## Testing - Jest

Tests are written in Jest and can be ran using `npm test` or `npm test:watch`

## NPM Tasks

- **develop**: Runs the gallery web app in watch mode and rebuilds and restarts when any soure changes are made
- **lint**: Parses all source javascript and styles to make sure they conform to the rules laid down by [Airbnb](https://www.npmjs.com/package/eslint-config-airbnb)
- **precommit**: Called from the Git pre-commit hook which in turn calls eslint and prettier to check those files and format them following the common formatting rules
- **start**: Starts the server in normal mode
- **test**: Executes [jest](http://jestjs.io/) to run the Javascript unit tests
- **test:watch**: Runs [jest](http://jestjs.io/) in watch mode, this only tests changed files by default
