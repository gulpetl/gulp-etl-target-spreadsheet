"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const through2 = require('through2');
const split = require('split2');
const XLSX = require("xlsx");
var replaceExt = require('replace-ext');
const PluginError = require("plugin-error");
const pkginfo = require('pkginfo')(module); // project package.json info into module.exports
const PLUGIN_NAME = module.exports.name;
const loglevel = require("loglevel");
const log = loglevel.getLogger(PLUGIN_NAME); // get a logger instance based on the project name
log.setLevel((process.env.DEBUG_LEVEL || 'warn'));
function targetSpreadsheet(configObj, sheetOpt) {
    if (!configObj)
        configObj = {};
    if (!configObj.bookType)
        configObj.bookType = "xlsx";
    configObj.type = "buffer";
    const strm = through2.obj(function (file, encoding, callback) {
        let returnErr = null;
        if (file.isNull() || returnErr) {
            //return empty file or if there is an error
            return callback(returnErr, file);
        }
        else if (file.isStream()) {
            throw new PluginError(PLUGIN_NAME, 'Does not support streaming');
        }
        else if (file.isBuffer()) {
            let linesArr = file.contents.toString().split('\n');
            let resultArr = [];
            let tempObj;
            let streamNames = [];
            let workbook = XLSX.utils.book_new();
            for (let lineIdx in linesArr) {
                let lineObj = JSON.parse(linesArr[lineIdx]);
                tempObj = lineObj.record;
                let stream = lineObj.stream;
                if (!(streamNames.includes(stream))) {
                    streamNames.push(stream);
                    resultArr.push([]);
                }
                let streamIdx = streamNames.indexOf(stream);
                let tempStr = JSON.stringify(tempObj);
                log.debug(tempStr);
                resultArr[streamIdx].push(tempObj);
            }
            for (let sheetIdx in streamNames) {
                let tempSheet = XLSX.utils.json_to_sheet(resultArr[sheetIdx], sheetOpt);
                XLSX.utils.book_append_sheet(workbook, tempSheet, streamNames[sheetIdx]);
            }
            try {
                var wbout = XLSX.write(workbook, configObj);
                file.contents = Buffer.from(wbout);
                switch (configObj.bookType) {
                    case "biff8":
                        file.path = replaceExt(file.path, ".xls");
                        break;
                    case "biff5":
                        file.path = replaceExt(file.path, ".xls");
                        break;
                    case "biff2":
                        file.path = replaceExt(file.path, ".xls");
                        break;
                    case "xlml":
                        file.path = replaceExt(file.path, ".xls");
                        break;
                    default:
                        file.path = replaceExt(file.path, "." + configObj.bookType);
                }
            }
            catch (err) {
                returnErr = new PluginError(PLUGIN_NAME, err);
            }
            log.debug('calling callback');
            callback(returnErr, file);
        }
    });
    return strm;
}
exports.targetSpreadsheet = targetSpreadsheet;
//# sourceMappingURL=plugin.js.map