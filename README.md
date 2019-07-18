# gulp-etl-target-spreadsheet #

This plugin creates spreadsheet files from **gulp-etl** **Message Stream** files; originally adapted from the [gulp-etl-handlelines](https://github.com/gulpetl/gulp-etl-handlelines) model plugin. It is a **gulp-etl** wrapper for [xlsx](https://www.npmjs.com/package/xlsx).


This is a **[gulp-etl](https://gulpetl.com/)** plugin, and as such it is a [gulp](https://gulpjs.com/) plugin. **gulp-etl** plugins work with [ndjson](http://ndjson.org/) data streams/files which we call **Message Streams** and which are compliant with the [Singer specification](https://github.com/singer-io/getting-started/blob/master/docs/SPEC.md#output). Message Streams look like this:

```
{"type": "SCHEMA", "stream": "users", "key_properties": ["id"], "schema": {"required": ["id"], "type": "object", "properties": {"id": {"type": "integer"}}}}
{"type": "RECORD", "stream": "users", "record": {"id": 1, "name": "Chris"}}
{"type": "RECORD", "stream": "users", "record": {"id": 2, "name": "Mike"}}
{"type": "SCHEMA", "stream": "locations", "key_properties": ["id"], "schema": {"required": ["id"], "type": "object", "properties": {"id": {"type": "integer"}}}}
{"type": "RECORD", "stream": "locations", "record": {"id": 1, "name": "Philadelphia"}}
{"type": "STATE", "value": {"users": 2, "locations": 1}}
```

### Usage
**gulp-etl** plugins accept a configObj as the first parameter, the second parameter is sheetOpt. For this plugin the configObj is the "Writing Options" object for [xlsx](https://www.npmjs.com/package/xlsx), which is described [here](https://www.npmjs.com/package/xlsx#writing-options). [BookType](https://www.npmjs.com/package/xlsx#output-type) is required; it speficies the type of the exported spreadsheet. The sheetOpt parameter is the Array of objects input described [here](https://docs.sheetjs.com/#array-of-objects-input).
The plugin will change the file type within the file according to the bookType entered.

Currently this plugin has only been tested with raw data in the input.

Note that if the Message Stream contains multiple sheets and the selected bookType only allows for single sheets, the plugin will only export the first sheet. Check [the list](https://www.npmjs.com/package/xlsx#supported-output-formats) of supported spreadsheet types and their capabilities.

**Note on DBF handling:** Some DBF exports produced by this plugin do not open properly in Excel; it isn't certain if this is an Excel limitation. We have also observed some inconsistencies on cells with numeric values viewed in some tools, while strings appear to reproduce correctly. This may be due to differences in DBF version support between various tools.

##### Sample gulpfile.js
<!-- embedme gulpfile.js -->

```js
/* Load a pre-created message stream from a file and export to an XLSX spreadsheet */
var gulp = require("gulp");
var targetSpreadsheet = require("./src/plugin").targetSpreadsheet;

function runtargetSpreadSheet(callback) {
    return gulp
        .src("../testdata/*.ndjson", { buffer: true })
        .pipe(targetSpreadsheet({ bookType: "xlsx" }))
        .pipe(gulp.dest("../testdata/processed"));
}

exports["default"] = gulp.series(runtargetSpreadSheet);

```

### Quick Start for Coding on This Plugin
* Dependencies:
    * [git](https://git-scm.com/downloads)
    * [nodejs](https://nodejs.org/en/download/releases/) - At least v6.3 (6.9 for Windows) required for TypeScript debugging
    * npm (installs with Node)
    * typescript - installed as a development dependency
* Clone this repo and run `npm install` to install npm packages
* Debug: with [VScode](https://code.visualstudio.com/download) use `Open Folder` to open the project folder, then hit F5 to debug. This runs without compiling to javascript using [ts-node](https://www.npmjs.com/package/ts-node)
* Test: `npm test` or `npm t`
* Compile to javascript: `npm run build`
* Default Task: `npm run defaultTask`

### Testing

We are using [Jest](https://facebook.github.io/jest/docs/en/getting-started.html) for our testing. Each of our tests are in the `test` folder.

- Run `npm test` to run the test suites



Note: This document is written in [Markdown](https://daringfireball.net/projects/markdown/). We like to use [Typora](https://typora.io/) and [Markdown Preview Plus](https://chrome.google.com/webstore/detail/markdown-preview-plus/febilkbfcbhebfnokafefeacimjdckgl?hl=en-US) for our Markdown work..
