'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const fs = require('fs');

module.exports = class extends Generator {
  async prompting() {
    this.log(
      chalk.yellow(
        'Welcome to confetti! Generate beautiful, accessible tables with a config or manual setup :)'
      )
    );

    this.initPrompts = await this.prompt([
      {
        type: 'confirm',
        name: 'useConfigFile',
        message: 'Do you have a config file you want to use?',
      },
    ]);

    if (!this.initPrompts.useConfigFile) {
      this.log(
        chalk.yellow(
          'No worries at all! We are just going to do a manual setup so get ready for a few questions.'
        )
      );

      this.manualSetupPrompts = await this.prompt([
        {
          type: 'list',
          name: 'tableType',
          message: 'What type of table would you like generated?',
          choices: [
            {
              name: 'Semantic HTML table',
              value: 'html',
            },
            {
              name: 'Responsive div table',
              value: 'responsive',
            },
          ],
        },
        {
          type: 'checkbox',
          name: 'functionality',
          message: 'Is there any type of functionality do you want to add?',
          choices: [
            {
              name: 'Sortable column',
              value: 'sort',
            },
            {
              name: 'Fixed column',
              value: 'fixedColumn',
            },
            {
              name: 'Fixed row',
              value: 'fixedRow',
            },
          ],
        },
      ]);

      this.functionalityPrompts = await this.prompt([
        {
          when: () => {
            const test = this.manualSetupPrompts.functionality.filter(
              fns => fns === 'sort'
            );
            return test.length > 0;
          },
          type: 'list',
          message: 'Would you like some code to help with sorting?',
          name: 'sortScript',
          choices: [
            {
              name:
                'JS with events, basic sorting, and functionality to make visual updates',
              value: 'basicSort',
            },
            {
              name: 'JS with events and functionality to make visual updates',
              value: 'eventSort',
            },
            {
              name: 'None of the above! Just gimmie the styles :)',
              value: 'justStyles',
            },
          ],
        },
      ]);
    } else if (this.initPrompts.useConfigFile) {
      this.configFilePrompts = await this.prompt([
        {
          type: 'input',
          message: 'Great! What is the file path to your config file?',
          name: 'configFilePath',
        },
      ]);
    }
  }

  async configuring() {
    let configFilePromise;

    if (this.configFilePrompts.configFilePath) {
      const configFilePath = this.configFilePrompts.configFilePath;

      // Reading the config file (IF I HAD ONE)
      configFilePromise = new Promise(resolve => {
        const readStream = fs.createReadStream(configFilePath, {
          encoding: 'utf8',
        });

        // Succcessfully gathering data
        readStream.on('data', data => {
          this.configFileData = data;
          readStream.destroy();
        });

        // If an error occurs, log error
        readStream.on('error', error => {
          this.log(chalk.red(`${error}`));
          readStream.destroy();
        });

        // Resolve config file promise
        readStream.on('close', () => {
          resolve();
        });
      });
    }

    // Although there is only one promise right now, its scalable for when I add more shit
    return Promise.all([configFilePromise]);
  }

  writing() {
    // TODO gotta actually generate tables
    console.log(this.configFileData);
  }
};
