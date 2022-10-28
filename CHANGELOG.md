# [2.0.0](https://github.com/chickencoding123/leaflet-react-fibers/compare/1.1.0...2.0.0) (2022-10-28)


* Updates to this library to improve package and fix many bugs (#10) ([718d34f](https://github.com/chickencoding123/leaflet-react-fibers/commit/718d34f511738cfb27dc386b3ed283eb8b8c3dcf)), closes [#10](https://github.com/chickencoding123/leaflet-react-fibers/issues/10)


### BREAKING CHANGES

* Fixed a bug inside of map sizing logic.
Auto-sizing uses the parent DOM element of the map for fitting.
However DOM padding, margin and borders were not excluded from calculations.
This produced a slightly oversized leaflet map.
If you have code to counter this effect, then make sure to remove it when upgrading.

- Adding a `operations` directory to host common renderer operations
- Moving `create-instance` to the new `operations` directory
- Moving `commit-update` to the new `operations` directory
- Moving typescript types to a new `types.ts` file
- Moving auto-sizing logic from `map.tsx` to `set-map-size.ts` file
- Updating operation did not remove nodes which are defined inside of `<MapContext.Consumer>` block

* chore(examples): added examples

These examples can be used for Storybook and Testing

* chore(configs): configuration changes

- Modify `.eslintrc.json` for better linting
- Changed `.gitignore` to ignore more directories
- Add / update dependencies in `package.json`. Also added test commands.
- Modifiying `tsconfig.json` since we will not use `tsc` for build.

* refactor(lib): refactoring changes as well as a few bug fixes

- Moving various reconciller operations to a dedicated directory
- After updating a layer, it has an incorrect z-index. This is partially fixed.

* test(cypress): adding component tests

Screenshot tests using `cypress-visual-regression` package.

* chore(storybook): improving stories

- Split stories so they are more meaningful and focused
- Improving documentation for stories and their parameters
- Moving storybook components to a dedicated directory

* fix(lib): fixing bug that cause a new layer to be added out of order

When updating a prop on an instance, it should be added to correct location in DOM.

* docs(readme): improve documentation

- Modifying `README.md` for the better
- Slightly improving a story description.

* chore(deps): update `cypress` back to `^10.10.0`

Initially snapshot testing was a challenge because `cypress` has changed how plugins are used.

* feat(lib): enable subset of html attributes on catalog items

Enable `id`, `data-*`, `test-id` and `aria-*` attributes on leaflet layers.
Renderer will now add these attributes to DOM.

* chore(storybook): improve stories

- Extract story items to `example` directory so they can be accessed by `cypress`
- Improve story content to be more inclusive with various layers and combinations
- Remove unused story files
- Improving `.storybook/leaflet-react-theme.js` for better storybook panels
- Use `vh` and `vw` instead of `px` for storybook panel sizes

* test(cypress): add cypress 10 component tests

New cypress component test along with `cypress-visual-regression`
allow for snapshot testing each component. This is great for
geo mapping libraries such as this one.

- Add tests to verify layer operations such as addition or removal
- Add tests to verify various JSX nodes render properly
- Add tests for storybook stories to automate a few scenarios

* feat(build): vite based builds

Previously used `tsc` to build the project, but that had many drawbacks.
`cypress` is capable of using `vite` or `webpack` and since
I chose `vite`, then it made sense to use it for the build as well.

* feat(bundle): optimize `lodash` imports

By default the entire `lodash` is bundled with this library,
but that is not required. This change helps treeshake
and drop ~200KiB from the output bundle.

# [1.1.0](https://github.com/chickencoding123/leaflet-react-fibers/compare/1.0.3...1.1.0) (2022-02-25)


### Features

* **all:** lots of changes to add automated ci and doc pages ([#1](https://github.com/chickencoding123/leaflet-react-fibers/issues/1)) ([3bcdce7](https://github.com/chickencoding123/leaflet-react-fibers/commit/3bcdce7219ba730c64b3c439506a5837d7d22cae))
