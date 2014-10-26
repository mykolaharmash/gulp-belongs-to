## Description

When editing partial asset (eg sass mixin, jade include, etc.) with watch running, desirable to recompile only direct parents of this partial. With this plugin you can explicitly specify files partials belongs to.

## Usage

Plugin works best with [gulp-watch](https://github.com/floatdrop/gulp-watch).

`mixins/_headers.scss`
```
// belongs_to ../main.scss

h1 {
  font-size: 2em;
}
```

`main.scss`
```
@import "mixins/headers";

body {
  margin: 0;
}
```

__Gulpfile__
```js
var gulp = require('gulp'),
  , sass = require("gulp-sass")
  , watch = require("gulp-watch")
  , belongs = require("gulp-belongs-to")
  ;
  
  gulp.task("watch", function () {
    watch("src/scss/**/*.scss", { verbose: true }, function (files) {
      files
        .pipe(belongs())
        .pipe(sass())
        .pipe(gulp.dest("build/css"));
    });
});
```

Now, with `gulp watch` running, when mixins/_headers.scss edited only main.scss will recompile.
You can specify multiple `belongs_to` directives.
```
// belongs_to ../main.scss
// belongs_to ../foo/bar.scss
```

## Install

Run `npm install gulp-belongs-to`
