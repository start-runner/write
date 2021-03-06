# start-write

[![npm](https://img.shields.io/npm/v/start-write.svg?style=flat-square)](https://www.npmjs.com/package/start-write)
[![linux build](https://img.shields.io/travis/start-runner/write/master.svg?label=linux&style=flat-square)](https://travis-ci.org/start-runner/write)
[![windows build](https://img.shields.io/appveyor/ci/start-runner/write/master.svg?label=windows&style=flat-square)](https://ci.appveyor.com/project/start-runner/write)
[![coverage](https://img.shields.io/codecov/c/github/start-runner/write/master.svg?style=flat-square)](https://codecov.io/github/start-runner/write)
[![deps](https://img.shields.io/gemnasium/start-runner/write.svg?style=flat-square)](https://gemnasium.com/start-runner/write)

Write task for [Start](https://github.com/start-runner/start).

## Install

```sh
npm install --save-dev start-write
# or
yarn add --dev start-write
```

## Usage

```js
import start from 'start';
import reporter from 'start-pretty-reporter';
import files from 'start-files';
import clean from 'start-clean';
import babel from 'start-babel';
import write from 'start-write';

export const build= () => start(reporter())(
  files('build/'),
  clean(),
  files('lib/**/*.js'),
  babel({ sourceMaps: true }),
  write('build/')
);
```

This task relies on `[{ path, data, map }]` input and provides the same, see [documentation](https://github.com/start-runner/start#readme) for details.

## Arguments

`write(dir, encoding, sourcemapOptions)`

* `dir` – output directory, will be created automatically if it doesn't exists
* `encoding` – `fs.writeFile` encoding option, `utf-8` by default
* `sourcemapOptions` – options using to generate Source Maps:
  * `extname` – sourcemap file extension, `'.map'` by default
  * `prefix` – prefix string which will be used to generate `sourceMappingURL` sourcemap comment, `''` by default
