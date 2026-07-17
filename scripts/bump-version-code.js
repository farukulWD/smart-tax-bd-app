const fs = require('fs');
const path = require('path');

const gradlePath = path.resolve(__dirname, '..', 'android', 'app', 'build.gradle');
let content = fs.readFileSync(gradlePath, 'utf8');

const updated = content.replace(
  /(versionCode\s+)(\d+)/,
  (_, prefix, code) => prefix + (parseInt(code, 10) + 1),
);

if (updated === content) {
  console.error('Could not find versionCode in build.gradle');
  process.exit(1);
}

fs.writeFileSync(gradlePath, updated, 'utf8');
console.log(`versionCode bumped`);
