"use strict";
exports.__esModule = true;
var through2 = require("through2");
var split = require("split2");
var XLSX = require("xlsx");
var replaceExt = require("replace-ext");
var PluginError = require("plugin-error");
var pkginfo = require("pkginfo")(module); // project package.json info into module.exports
var PLUGIN_NAME = module.exports.name;
var loglevel = require("loglevel");
var log = loglevel.getLogger(PLUGIN_NAME); // get a logger instance based on the project name
log.setLevel(process.env.DEBUG_LEVEL || "warn");

function targetSpreadsheet(configObj) {
    if (!configObj) configObj = {};
    if (!configObj.bookType) configObj.bookType = "xlsx";
    configObj.type = "buffer";
    
    var strm = through2.obj(function(file, encoding, callback) {
        var returnErr = null;
        if (file.isNull() || returnErr) {
            //return empty file or if there is an error
            return callback(returnErr, file);
        }
        else if (file.isStream()) {
            throw new PluginError(PLUGIN_NAME, "Does not support streaming");
        }
        else if (file.isBuffer()) {
            var linesArr = file.contents.toString().split("\n");
            var resultArr = [];
            var tempObj = void 0;
            var streamNames = [];
            var workbook = XLSX.utils.book_new();
            for (var lineIdx in linesArr) {
                var lineObj = JSON.parse(linesArr[lineIdx]);
                tempObj = lineObj.record;
                var stream = lineObj.stream;
                if (!streamNames.includes(stream)) {
                    streamNames.push(stream);
                    resultArr.push([]);
                }
                var streamIdx = streamNames.indexOf(stream);
                var tempStr = JSON.stringify(tempObj);
                log.debug(tempStr);
                resultArr[streamIdx].push(tempObj);
            }
            for (var sheetIdx in streamNames) {
                var tempSheet = XLSX.utils.json_to_sheet(resultArr[sheetIdx]);
                XLSX.utils.book_append_sheet( workbook, tempSheet, streamNames[sheetIdx]);
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
            log.debug("calling callback");
            callback(returnErr, file);
        }
    });
    return strm;
}

exports.targetSpreadsheet = targetSpreadsheet;
