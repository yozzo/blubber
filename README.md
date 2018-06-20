# Blubber

Blubber is a framework designed to act as a JSON client and
provide tools to build a CRUD application using GDS styles.

Blubber stands for.. nothing, it was picked because the npm
package name was available.

The main components of Blubber are:

* Promise based JSON API Client
* Entity collection lists with sorting and filtering
* Entity displays display
* Form definition and generation
* Form post handling
* Transformation between API interface and form data
* Nunjucks macros for rendering GDS style list/form layout
* Sass library to enhance GDS styles

## Linting/Formatting

As reccomended by GDS, this project uses XO to handle javascript
linting. In this project this has been combined with prettier to
also add an automated formatter, to keep code layout consistant
between developers and editors.

A git hook has been setup to run xo before code it commited.

### Editor Integration
To avoid surprises and know what your code will look lik before
committing it is a good idea to find a plugin for your IDE that
works with XO.

#### Visual studio code

In the case of Visual Studio Code therea are 2 plugins available,
though the 'official' one does not highlight lint errors in
the editor, instead use the forked version for now, this not
only allows you to see errors before trying to commit, but can also
be configured to format code when you save it.

* Install [Linter XO](https://marketplace.visualstudio.com/items?itemName=bryan-chen.linter-xo-2)
* Edit your workspace settings to ensure the xo plugin and formatting is enabled and double check
that eslint is disabled so as not to conflict
`
{
  "xo.format.enable": true,
  "editor.formatOnSave": true,
  "eslint.enable": false
}
`
#### Webstore/Intellij
tbd


## Testing - Jest
Tests are written in Jest and can be ran using `npm test` or `npm test:watch`
