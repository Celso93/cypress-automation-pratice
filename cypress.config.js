require('dotenv').config();
const { defineConfig } = require("cypress");

const baseUrl = process.env.BASE_URL?.trim() || 'https://www.automationexercise.com';

module.exports = defineConfig({
  watchForFileChanges: false,
  blockHosts: [
    '*googlesyndication.com',
    '*doubleclick.net',
    '*googleadservices.com',
    '*google-analytics.com',
    '*googletagmanager.com',
    '*adtrafficquality.google',
    '*fundingchoicesmessages.google.com',
  ],
  retries: {
    openMode: 0,
    runMode: 3,
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/html',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },
  e2e: {
    baseUrl,
    testIsolation: true,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      require('@cypress/grep/src/plugin')(config);
      return config;
    },
  },
});
