[![npm](https://img.shields.io/npm/v/start-write.svg?style=flat-square)](https://www.npmjs.com/package/start-write)
[![travis](http://img.shields.io/travis/start-runner/write.svg?style=flat-square)](https://travis-ci.org/start-runner/write)
[![deps](https://img.shields.io/gemnasium/start-runner/write.svg?style=flat-square)](https://gemnasium.com/start-runner/write)

Write task for [Start](https://github.com/start-runner/start).

## Install

```
npm i -S start-write
```

## Usage

Task is rely on `[{ path, data }]` input.

```js
// tasks/index.js
import start from 'start';
import logger from 'start-simple-logger';
import clean from 'start-clean';
import files from 'start-files';
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

```js
// package.json
"scripts": {
  "task": "babel-node node_modules/.bin/start tasks/",
  "build": "npm run task build"
}
```

## Arguments

`write(dir, extname)`

* `dir` – output directory
* `extname` – optional new extension for output files, for example `.css`
