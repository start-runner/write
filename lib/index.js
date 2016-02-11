export default (outRootDir) => (input) => {
    return function write(log) {
        const path = require('path');
        const pify = require('pify');
        const makeDir = pify(require('mkdirp'));
        const writeFile = pify(require('fs').writeFile);

        return Promise.all(
            input.map(file => {
                // /beep/boop/src/beep/index.js -> index.js
                const inFile = path.basename(file.path);
                // /beep/boop/src/beep/index.js -> src/beep/
                const inDir = path.relative(process.cwd(), path.dirname(file.path));
                // src/beep/ -> beep/
                const relativeInDir = path.join(...inDir.split(path.sep).slice(1));
                // beep/ -> /beep/boop/build/beep/
                const outDir = path.resolve(outRootDir, relativeInDir);
                // /beep/boop/build/beep/ -> /beep/boop/build/beep/index.js
                const outFile = path.join(outDir, inFile);
                // /beep/boop/build/beep/index.js -> /beep/boop/build/beep/index.js.map
                const sourcemapFile = outFile + '.map';

                const writeFiles = [
                    writeFile(outFile, file.data, 'utf-8').then(() => {
                        log(outFile);
                    })
                ];

                // sourcemap
                if (file.map !== null) {
                    writeFiles.push(
                        writeFile(sourcemapFile, file.map, 'utf-8').then(() => {
                            log(sourcemapFile);
                        })
                    );
                }

                return makeDir(outDir)
                    .then(() => {
                        return Promise.all(writeFiles);
                    })
                    .then(() => {
                        return file;
                    });
            })
        );
    };
};
