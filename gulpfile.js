var gulp = require("gulp");
var targetSpreadsheet = require("./src/plugin").targetSpreadsheet;

function runtargetSpreadSheet(callback) {
    return gulp
        .src("../testdata/*.ndjson", { buffer: true })
        .pipe(targetSpreadsheet({ bookType: "xlsx" }))
        .pipe(gulp.dest("../testdata/processed"));
}

exports["default"] = gulp.series(runtargetSpreadSheet);
