import pm from 'picomatch';
const str = 'src/*.ts';
const scanned = pm.scan(str);
console.log('Scanned:', scanned);
if (scanned.isGlob) {
    console.log('isGlob is true for', str);
}
