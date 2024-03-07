# Tree Meh

## Summary

The Tree-Meh leverages the tree-node-cli command to swiftly produce and copy string representations of project structures/directories. This enhances collaborative discussions on project architecture and design by providing a convenient way to share and analyze project layouts.  

### Example Output
```bash
my-project
├── README.md
├── src
│   ├── api
│   │   └── routes.js
│   ├── app.js
│   ├── assets
│   │   └── profile.jpg
│   └── config.json
└── tests
    ├── runTest.js
    └── suite
        ├── app.test.js
        └── index.js
```

## Usage

<img src="https://jtroussard.github.io/static-site/http-1692229795084.gif" alt="gif demo for feature: sub menu action everything" width="90%">

1. Install the "Tree-Meh" extension from the Visual Studio Code Marketplace.

2. Navigate to the Explorer view and right-click on a directory within your project.

3. Select "Generate Project Tree" from the context menu.

4. The extension will generate a tree representation of the directory structure and copy it to your clipboard.

5. Paste the copied tree wherever you need.

## Features

1. **Generate Tree**: Right-click on any directory in the Explorer and choose "Generate Project Tree" from the context menu. This action triggers the extension to create a visual representation of the directory structure and copies it to your clipboard.

1. **Generate Tree Less Dependency Directories**: Right-click on any directory in the Explorer and choose "Less Dependency Directories" from the context menu. This action triggers the extension to create a visual representation of the directory structure less the often unecessary and large dependency directories (venv, node_modules, etc.) and copies it to your clipboard.

## Example Use Cases

- **AI-Assisted Analysis**: Engage with AI assistants like ChatGPT to pitch your refactor or design ideas. Share the tree with AI to get insights, suggestions, and analysis.

- **Documentation After Refactoring**: Whether your project coding convention calls for a project directory representation in the docs or you're maintaining a legacy project, it can be a real pain to update these diagrams by hand. Even if leveraging the terminal command, the process of getting that output from a terminal into a README file can drive anyone bonkers. Now in two clicks and a paste you can update the docuemntation seemlessly!

## Extension Settings

Configuration settings coming soon.

<!-- ## Known Issues -->

## Release Notes

### 1.6.0

DEVELOPER ENHANCEMENT: Adds test and publishing automation

### 1.5.0

Windows path compatibility

### 1.2.0

Adds new context option to copy tree less dependency directories. (ex. node_modules/, venv/)

### 1.0.0

Initial production release of Tree Meh directory tree copy utility.

## Development Setup

To work on the Tree-Meh extension on your local machine, follow these steps:

1. **Clone the Repository**:
Open a terminal and navigate to the directory where you want to clone the extension's repository. Then, run the following command:

`git clone git@github.com:jtroussard/tree-meh.git`

2. **Navigate to the Extension's Directory**:
Change your working directory to the newly cloned repository:

`cd tree-meh`

3. **Install Dependencies**:
Use npm to install the required dependencies for the extension. Run the following command:

`npm install`

This command will download and install the dependencies mentioned in the `package.json` file.

4. **Start Development**:
Now that the dependencies are installed, you can start developing the extension. Open the cloned repository in Visual Studio Code:

`code .`

### Testing

During development, you might need to test your extension. Use the following command to build the extension:

`npm test`

You can then test your extension within Visual Studio Code by pressing `F5`, make sure your focus is set on the `extensions.js` file.

## Feedback/Support

We value your feedback! If you encounter any issues or have suggestions for improvement, please feel free to [raise an issue on GitHub](https://github.com/jtroussard/tree-meh).

## LICENSE

This extension is released under the [MIT License](https://github.com/jtroussard/tree-meh/blob/main/LICENSE).
