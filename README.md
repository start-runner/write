# start-write

[![npm](https://img.shields.io/npm/v/start-write.svg?style=flat-square)](https://www.npmjs.com/package/start-write)
[![travis](http://img.shields.io/travis/start-runner/write.svg?style=flat-square)](https://travis-ci.org/start-runner/write)
[![coverage](https://img.shields.io/codecov/c/github/start-runner/write.svg?style=flat-square)](https://codecov.io/github/start-runner/write)
[![deps](https://img.shields.io/gemnasium/start-runner/write.svg?style=flat-square)](https://gemnasium.com/start-runner/write)
[![gitter](https://img.shields.io/badge/gitter-join_chat_%E2%86%92-00d06f.svg?style=flat-square)](https://gitter.im/start-runner/start)

Write task for [Start](https://github.com/start-runner/start).

## Install

```
npm i -S start-write
```

## Usage

```js
import start from 'start';
import reporter from 'start-pretty-reporter';
import files from 'start-files';
import clean from 'start-clean';
import babel from 'start-babel';
import write from 'start-write';

export function build() {
    return start(reporter())(
        files('build/'),
        clean(),
        files('lib/**/*.js'),
        babel({ sourceMaps: true }),
        write('build/')
    );
}
```

This task relies on `[{ path, data }]` input and provides the same, see [documentation](https://github.com/start-runner/start#readme) for details.

## Arguments

`write(dir, sourcemapOptions)`

* `dir` – output directory
* `sourcemapOptions` – options using to generate Source Maps:
  * `extname` – sourcemap file extension, `'.map'` by default
  * `prefix` – prefix string which will be used to generate `sourceMappingURL` sourcemap comment, `''` by default
