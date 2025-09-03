# prettier-hugo-plugin

[![npm version](https://img.shields.io/npm/v/prettier-hugo-plugin.svg)](https://www.npmjs.com/package/prettier-hugo-plugin)
[![npm downloads](https://img.shields.io/npm/dm/prettier-hugo-plugin.svg)](https://www.npmjs.com/package/prettier-hugo-plugin)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Prettier plugin for formatting Hugo/Go HTML templates. It teaches Prettier how to parse and print Go template tags embedded in HTML (used by Hugo), while delegating HTML formatting to Prettier’s HTML parser.

This plugin supports common Hugo/Go template constructs like if/else, range, with, define, block, and handles inline statements, multi-block constructs (e.g. else), and sections you don’t want to reformat.


## Why this plugin?
- Works with Prettier 3.x
- Understands Go template delimiters like {{- ... -}}, {{< ... >}}, and {{% ... %}}
- Preserves and embeds formatted HTML around Go template nodes
- Supports prettier-ignore for both single lines and whole blocks
- Respects bracket spacing option for template statements


## Requirements
- Node.js >= 20
- Prettier ^3.0.0


## Installation
Install Prettier and the plugin as dev dependencies:

- npm: `npm i -D prettier prettier-hugo-plugin`
- pnpm: `pnpm add -D prettier prettier-hugo-plugin`
- yarn: `yarn add -D prettier prettier-hugo-plugin`


## Usage
Prettier will auto-load plugins from node_modules when referenced in your config. Add the plugin and configure Prettier to use the GoTemplate language for your Hugo template extensions.

Example prettier config (prettier.config.cjs/mjs or .prettierrc) with recommended options:

```
/** @type {import('prettier').Config} */
module.exports = require('prettier-hugo-plugin').configs.recommended;
```

Example prettier config (prettier.config.cjs/mjs or .prettierrc) with overrides:

```
/** @type {import('prettier').Config} */
export default {
  plugins: ["prettier-hugo-plugin"],
  // Optional plugin option:
  goTemplateBracketSpacing: true,
  // Map typical Hugo template extensions to the GoTemplate parser
  overrides: [
    {
      files: [
        "**/*.html",
      ],
      options: { parser: "go-template" },
    },
  ],
};
```

Alternatively, you can pass the plugin on the CLI:

- Format a file: `npx prettier --plugin prettier-hugo-plugin --parser go-template path/to/template.html`
- Or rely on overrides and just run: `npx prettier -w .`


## Supported syntax and behavior
- Go/Hugo delimiters: `{{ ... }}`, `{{- ... -}}`, `{{< ... >}}`, `{{% ... %}}`, and comment pairs `{{/* ... */}}`
- Block keywords: `if`, `range`, `block`, `with`, `define`, `else`, `end`
- Prettier ignore controls:
  - Single line: put `prettier-ignore` in an HTML comment or Go template comment right before a statement
  - Block: wrap a section with `{{ prettier-ignore-start }}` ... `{{ end }}`
- Preserves empty lines after blocks when appropriate, to keep readable spacing
- Avoids reformatting content inside <script> or <style> tags that contain Go template expressions


## Examples
Input:

```
{{if .Title}}
<title>{{.Title}}</title>
{{else}}
<title>My Site</title>
{{end}}
```

Formatted (with goTemplateBracketSpacing: true):

```
{{ if .Title }}
  <title>{{ .Title }}</title>
{{ else }}
  <title>My Site</title>
{{ end }}
```

Inline statements are grouped and break when long or multiline:

```
<p>{{- with .Params.long 
      -}}
  {{ . }}
{{- end -}}</p>
```


## Configuration options
- goTemplateBracketSpacing (boolean, default: true)
  - When true: prints space after `{{` and before `}}` around statements, for example `{{ if . }}`. When false: prints compact statements `{{if .}}`.

All other formatting decisions are handled by Prettier’s standard HTML rules.


## File extensions and editor support
This plugin registers a language named GoTemplate and associates it with these extensions:
- .go.html, .gohtml, .gotmpl, .go.tmpl, .tmpl, .tpl, .html.tmpl, .html.tpl

Most editors using Prettier will pick up the plugin when configured. For VS Code, ensure the Prettier extension is enabled, and that the file is formatted with Prettier.


## Prettier ignore
- Ignore the next node/line:
  - `<!-- prettier-ignore -->\n{{ .SomeValue }}`
  - `{{/* prettier-ignore */}}\n{{ .SomeValue }}`
- Ignore a whole block:
  - `{{ prettier-ignore-start }}`
  - ... any content inside will be treated as plain text and not reformatted
  - `{{ end }}`


## CLI tips
- Dry run check: `npx prettier --check .`
- Write changes: `npx prettier --write .`
- Only Go/Hugo templates (if using overrides): `npx prettier --write "**/*.gotmpl"`


## Troubleshooting
- Plugin not applied: ensure plugins includes "prettier-hugo-plugin" and your files match overrides with parser "go-template".
- Mixed HTML/Go errors: the plugin embeds formatted HTML and maps Go nodes back into place; malformed HTML near template delimiters can still confuse the HTML parser.
- Unexpected reflow inside <script>/<style>: the plugin treats those with Go tags as unformattable to avoid breaking code. If necessary, use ignore controls.


## Contributing
- Requirements: Node 18+ recommended (Node 14+ supported), npm
- Install: `npm ci`
- Build: `npm run build`
- Tests: `npm test` (watch: `npm run watch:test`)
- Lint: `npm run lint`

Please open issues and pull requests in the GitHub repository. Before submitting, run tests and lint.


## Release and CI
This repository includes a GitHub Actions workflow to publish to npm on release. To publish locally, use:
- `npm run release:plugin` – build, collect/publish coverage, and publish
- `npm run release:plugin:local` – publish to a local registry (e.g., verdaccio)

Coverage can be uploaded with `npm run release:coverage` (requires CODECOV token env or npm config as defined in package.json).
