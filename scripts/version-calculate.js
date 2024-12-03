const fs = require('fs');
const path = require('path');

const bumpType = process.argv[2]; // 'patch', 'minor', or 'major'
if (!['patch', 'minor', 'major'].includes(bumpType)) {
  console.error('Error: Invalid version bump type. Use "patch", "minor", or "major".');
  process.exit(1);
}

const packageJsonPath = path.resolve('./package.json');

// Helper to calculate the new version
const calculateVersion = (currentVersion, bumpType) => {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  switch (bumpType) {
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'major':
      return `${major + 1}.0.0`;
    default:
      throw new Error('Invalid bump type');
  }
};

try {
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const currentVersion = packageJson.version;

  // Calculate the new version
  const newVersion = calculateVersion(currentVersion, bumpType);

  console.log(newVersion); // Output the new version for the parent script to use
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
