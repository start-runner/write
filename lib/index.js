const defaultSourcemapOptions = {
    extname: '.map',
    prefix: ''
};

export default (outRootDir, userSourcemapOptions) => (input) => {
    return function write(log) {
        const path = require('path');
        const pify = require('pify');
        const makeDir = pify(require('mkdirp'));
        const writeFile = pify(require('graceful-fs').writeFile);

        return Promise.all(
            input.map(file => {
                // /beep/boop/src/beep/index.js -> index.js
                const inFile = path.basename(file.path);
                // /beep/boop/src/beep/index.js -> src/beep/
                const inDir = path.relative(process.cwd(), path.dirname(file.path));
                // src/beep/ -> beep/
                const relativeInDir = path.join(...inDir.split(path.sep).slice(1));
                // beep/ -> /beep/boop/build/beep/
                const outDirPath = path.resolve(outRootDir, relativeInDir);
                // /beep/boop/build/beep/ -> /beep/boop/build/beep/index.js
                const outFilePath = path.join(outDirPath, inFile);

                return makeDir(outDirPath)
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
                            const sourcemapPath = path.join(outDirPath, sourcemapFile);
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
                                writeFile(sourcemapPath, sourcemapData, 'utf-8').then(() => {
                                    log(sourcemapPath);
                                })
                            );
                        }

                        writeFiles.push(
                            writeFile(outFilePath, fileData, 'utf-8').then(() => {
                                log(outFilePath);
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
