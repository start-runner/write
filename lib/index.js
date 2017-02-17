const defaultSourcemapOptions = {
  extname: '.map',
  prefix: ''
};

export default (outDirRelative, encoding = 'utf-8', userSourcemapOptions) => (input) => {
  return function write(log) {
    const path = require('path');
    const makethen = require('makethen');
    const makeDir = makethen(require('mkdirp'));
    const writeFile = makethen(require('graceful-fs').writeFile);

    return Promise.all(
      input.map((file) => {
        // file.path = /Users/foo/test/packages/beep/src/boop/index.js
        // process.cwd = /Users/foo/test
        // outDirRelative = packages/beep/build

        // /Users/foo/test/packages/beep/src/boop/index.js -> index.js
        const inFile = path.basename(file.path);
        // /Users/foo/test/packages/beep/src/boop/index.js -> /Users/foo/test/packages/beep/src/boop
        const inDir = path.dirname(file.path);
        // /Users/foo/test/packages/beep/src/boop -> packages/beep/src/boop
        const inDirRelative = path.relative(process.cwd(), inDir);
        // src/beep -> [ 'packages', 'beep', 'src', 'boop ]
        const inDirSplit = inDirRelative.split(path.sep);
        // [ 'packages', 'beep', 'build' ]
        const outDirSplit = outDirRelative.split(path.sep);
        // [ 'packages', 'beep', 'src', 'boop ] + [ 'packages', 'beep', 'build' ]
        const inDirUnique = inDirSplit
          // [ 'packages', 'beep', 'src', 'boop ] -> [ 'src', 'boop' ]
          .filter((segment, index) => segment !== outDirSplit[index])
          // [ 'src', 'boop' ] -> [ 'boop' ]
          .slice(1)
          // [ 'boop' ] -> 'boop'
          .join(path.sep);
        // packages/beep/build + boop -> packages/beep/build/boop
        const outDir = path.resolve(outDirRelative, inDirUnique);
        // packages/beep/build/boop + index.js ->  packages/beep/build/boop/index.js
        const outFile = path.join(outDir, inFile);

        return makeDir(outDir)
          .then(() => {
            const writeFiles = [];
            let fileData = file.data;

            // sourcemap
            if (file.map !== null) {
              const sourcemapOptions = {
                ...defaultSourcemapOptions,
                ...userSourcemapOptions
              };
              // /beep/boop/src/beep/index.js -> .js
              const inExtname = path.extname(file.path);
              // index.js -> index.js.map
              const sourcemapFile = inFile + sourcemapOptions.extname;
              // /beep/boop/build/beep/index.js -> /beep/boop/build/beep/index.js.map
              const sourcemapPath = path.join(outDir, sourcemapFile);
              const sourcemapData = JSON.stringify(file.map);

              // /*# sourceMappingURL=index.css.map */
              if (inExtname === '.css') {
                fileData += '\n/*# sourceMappingURL=';
                fileData += sourcemapOptions.prefix;
                fileData += sourcemapFile;
                fileData += ' */';
              // //# sourceMappingURL=index.js.map
              } else {
                fileData += '\n//# sourceMappingURL=';
                fileData += sourcemapOptions.prefix;
                fileData += sourcemapFile;
              }

              writeFiles.push(
                writeFile(sourcemapPath, sourcemapData, encoding).then(() => {
                  log(sourcemapPath);
                })
              );
            }

            writeFiles.push(
              writeFile(outFile, fileData, encoding).then(() => {
                log(outFile);
              })
            );

            return Promise.all(writeFiles);
          })
          .then(() => {
            return file;
          });
      })
    );
  };
};
