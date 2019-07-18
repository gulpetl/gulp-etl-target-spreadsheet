const through2 = require('through2')
import Vinyl = require('vinyl')
const split = require('split2')
import XLSX = require('xlsx')
import PluginError = require('plugin-error');
const pkginfo = require('pkginfo')(module); // project package.json info into module.exports
const PLUGIN_NAME = module.exports.name;
import * as loglevel from 'loglevel'
const log = loglevel.getLogger(PLUGIN_NAME) // get a logger instance based on the project name
log.setLevel((process.env.DEBUG_LEVEL || 'warn') as loglevel.LogLevelDesc)

export function targetSpreadsheet(configObj:any){
    if (!configObj) configObj = {}
    if (!configObj.bookType) configObj.bookType = "xlsx"
    configObj.type = "buffer"

    const strm = through2.obj(function (file: Vinyl, encoding: string, callback: Function) {
        let returnErr= null

        if(file.isNull() || returnErr){
            //return empty file or if there is an error
            return callback(returnErr, file)
        }
        else if(file.isStream()){
            throw new PluginError(PLUGIN_NAME,'Does not support streaming')
        }
        else if(file.isBuffer()){
            let linesArr = (file.contents as Buffer).toString().split('\n')
            let resultArr:any = []
            let tempObj
            let streamNames:any =[] 
            let workbook = XLSX.utils.book_new()
            for (let lineIdx in linesArr) {
                let lineObj = JSON.parse(linesArr[lineIdx])
                tempObj = lineObj.record
                let stream = lineObj.stream
                if (!(streamNames.includes(stream))){
                    streamNames.push(stream)
                    resultArr.push([])
                }
                let streamIdx= streamNames.indexOf(stream)
                let tempStr = JSON.stringify(tempObj)
                log.debug(tempStr)
                resultArr[streamIdx].push(tempObj)
            }
            for(let sheetIdx in streamNames){
                let tempSheet = XLSX.utils.json_to_sheet(resultArr[sheetIdx])
                XLSX.utils.book_append_sheet(workbook, tempSheet, streamNames[sheetIdx])
            }
            try{
                var wbout = XLSX.write(workbook,configObj)
                file.contents = Buffer.from(wbout)
                switch(configObj.bookType){
                    case "biff8" :
                        file.extname = ".xls"
                        break;
                    case "biff5":
                        file.extname = ".xls"
                        break;
                    case "biff2":
                        file.extname = ".xls"
                        break;
                    case "xlml":
                        file.extname = ".xls"
                        break;
                    default:
                        file.extname = "."+ configObj.bookType
                }
            }
            catch(err){
                returnErr = new PluginError(PLUGIN_NAME, err)
            }
            log.debug('calling callback')
            callback(returnErr, file)
        }
    })
    return strm
}