const fs = require('fs');
const path = require('path');

// Paths to files
const packageJsonPath = path.resolve('./package.json');
const readmePath = path.resolve('./README.md');
const changelogPath = path.resolve('./CHANGELOG.md');

// New version to update
const newVersion = process.argv[2]; // Pass the version as an argument when running the script

if (!newVersion) {
  console.error('Error: Please provide the new version number as an argument.');
  process.exit(1);
}

// Helper function to get the current date in YYYY-MM-DD format
const getCurrentDate = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

// Helper function to read a file and return its content
const readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}: ${error.message}`);
    process.exit(1);
  }
};

// Helper function to write changes to a file
const writeFile = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    console.error(`Error writing to file ${filePath}: ${error.message}`);
    process.exit(1);
  }
};

// Function to update version in a file
const updateFileVersion = (filePath, regex, replacement) => {
  const originalContent = readFile(filePath);
  const updatedContent = originalContent.replace(regex, replacement);

  if (originalContent === updatedContent) {
    console.log(`No changes made to ${filePath}.`);
    return false; // Indicates no changes were made
  }

  writeFile(filePath, updatedContent);
  console.log(`Updated version in ${filePath} to ${newVersion}`);
  return true; // Indicates changes were made
};

// Check if the version exists in the changelog; add an entry if it doesn't
const updateChangelog = (filePath, version) => {
  const changelogContent = readFile(filePath);
  const versionExists = changelogContent.includes(`## [${version}]`);

  if (versionExists) {
    console.log(`Changelog already includes an entry for version ${version}.`);
    return false; // No changes made
  }

  // Create a new entry for the version
  const currentDate = getCurrentDate();
  const newEntry = `
## [${version}] - ${currentDate}

### Added

- Placeholder for features added in this version.

### Changed

- Placeholder for changes made in this version.

### Fixed

- Placeholder for bugs fixed in this version.
`;

  // Insert the new entry after the "Unreleased" section
  const updatedChangelog = changelogContent.replace(
    '## [Unreleased]',
    `## [Unreleased]\n\n${newEntry}`
  );

  writeFile(filePath, updatedChangelog);
  console.log(`Added entry for version ${version} to the changelog.`);
  return true; // Changes were made
};

// Update package.json
const packageJsonUpdated = updateFileVersion(
  packageJsonPath,
  /"version": "[0-9]+\.[0-9]+\.[0-9]+"/,
  `"version": "${newVersion}"`
);

// Update README.md
const readmeUpdated = updateFileVersion(
  readmePath,
  /\*\*Version:\*\* [0-9]+\.[0-9]+\.[0-9]+/,
  `**Version:** ${newVersion}`
);

// Update the changelog
const changelogUpdated = updateChangelog(changelogPath, newVersion);

// Final validation step
if (!packageJsonUpdated && !readmeUpdated && !changelogUpdated) {
  console.log('No changes detected. Version is already up-to-date.');
} else {
  console.log('Version bump complete!');
}
