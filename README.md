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
import logger from 'start-simple-logger';
import files from 'start-files';
import clean from 'start-clean';
import babel from 'start-babel';
import write from 'start-write';

export function build() {
    return start(logger())(
        files('build/'),
        clean(),
        files('lib/**/*.js'),
        babel(),
        write('build/')
    );
}
```

Task is rely on `[{ path, data }]` input and provide the same, see [documentation](https://github.com/start-runner/start#readme) for details.

## Arguments

`write(dir, extname)`

* `dir` – output directory
* `extname` – optional new extension for output files, for example `'.css'`
