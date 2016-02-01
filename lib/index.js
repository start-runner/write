export default (outRootDir, extname) => (input) => {
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
                // beep/ -> build/beep/
                const outDir = path.join(outRootDir, relativeInDir);
                // build/beep/ -> build/beep/index.js
                let outFile = path.join(outDir, inFile);

                // build/beep/index.es -> build/beep/index.js
                if (extname) {
                    const inFileName = path.basename(inFile, path.extname(inFile));

                    outFile = path.join(outDir, inFileName) + extname;
                }

                return makeDir(outDir)
                    .then(function() {
                        return writeFile(outFile, file.data, 'utf-8');
                    })
                    .then(function() {
                        log(outFile);

                        return file;
                    });
            })
        );
    };
};
