# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2024-12-02

### Added

- **Custom Configuration Options:** New settings in `settings.json` for enhanced customization of tree generation:
  - `allFiles` {All files are printed. By default, tree does not print hidden files (those beginning with a dot).}
  - `dirsFirst` {List directories before files.}
  - `dirsOnly` {List directories only.}
  - `sizes` {Show filesizes as well.}
  - `exclude` {An array of regex to test each filename against. Matching files will be excluded and matching directories will not be traversed into.}
  - `maxDepth` {Max display depth of the directory tree.}
  - `reverse` {Sort the output in reverse alphabetic order.}
  - `trailingSlash` {Appends a trailing slash behind directories.}
  - `lineAscii` {Turn on ASCII line graphics.}
- **Full Test Coverage:** Ensures reliability and performance improvements.
- **Generate Tree Everything Command:** New command for generating a complete directory tree, including hidden files.
- **DevOps Scripts:** Added new version bump scripts and integrated them into the `package.json`.

### Changed

- **Improved Compatibility:** Enhanced handling of large projects and deep directory structures.
- **Performance Enhancements:** Refactored some internal logic to improve performance.
- **Configuration Overhaul:** Replaced hardcoded configurations with a dynamic user-defined system.
- **DevOps Improvements:** Updated/Improved the github actions workflow files.

### Removed

- `.eslintrc.json`: Deprecated ESLint configurations in favor of prettier.

## [1.6.3] - 2024-04-05

### Fixed

- Addressed a security vulnerability related to the transitive dependency `minimist` (CVE-2021-44906) by pinning libraries to a safe version.

## [1.6.2] - 2024-03-07

### Added

- Implemented automated testing and publishing workflows using GitHub Actions.

### Fixed

- Resolved issues related to Windows path compatibility.

## [1.5.0] - 2024-03-03

### Added

- Introduced a new context menu option to generate a tree excluding dependency directories (e.g., `node_modules/`, `venv/`).

### Fixed

- Enhanced compatibility with Windows file paths.

## [1.0.0] - 2024-02-20

### Added

- Initial production release of the "tree-meh" VS Code extension.
- Features:
  - Generate a visual representation of the directory structure and copy it to the clipboard.
  - Context menu integration in the Explorer pane for easy access.
  - Utilizes `tree-node-cli` for generating directory trees.
