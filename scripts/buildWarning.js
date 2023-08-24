const buildWarning = async () => {
  const chalkModule = await import('chalk');
  const chalk = chalkModule.default || chalkModule; // Handle ES Modules and CommonJS
  console.log(
    chalk.bold.red(
      'Do Not Forget!!! Run the version increment script if this is an official release'
    )
  );
};

buildWarning();
