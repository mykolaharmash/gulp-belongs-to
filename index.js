var fs = require("fs")
  , stream = require("stream")
  , path = require("path")
  , util = require("util")
  , gutil = require("gulp-util")
  , pkg
  , Transform = stream.Transform
  , BELONGS_PATTERN
  ;

pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json")));

BELONGS_PATTERN = /belongs_to\s(.+)/g;

function ErrorMessage (err) {
  return new gutil.PluginError(pkg.name, err).toString();
}

function GulpBelongsTo (opts) {
  Transform.call(this, opts);
}

util.inherits(GulpBelongsTo, Transform);

GulpBelongsTo.prototype.pushFile = function (base, path, contents) {
  var belongsToFile;

  belongsToFile = new gutil.File({
    base: base,
    path: path,
    contents: contents
  });
  this.push(belongsToFile);
}

GulpBelongsTo.prototype._transform = function (chunk, enc, cb) {
  var self = this
    , files = [chunk]
    , parentFile
    , parentPath
    , belongsToPaths = []
    , belongsMatch
    , belongsPath
    ;

  while(belongsMatch = BELONGS_PATTERN.exec(chunk.contents.toString())) {
    belongsPath = path.resolve(path.dirname(chunk.path), belongsMatch[1]);
    belongsToPaths.push(belongsPath);
  }

  belongsToPaths.forEach(function (path) {
    fs.readFile(path, function (err, data) {
      if (err) throw ErrorMessage(err);

      self.pushFile(chunk.base, path, data);
      belongsToPaths.pop()
      if (!belongsToPaths.length) {
        cb();
      }
    });
  });

  self.push(chunk);
}

module.exports = function () {
  return new GulpBelongsTo({objectMode: true});
}