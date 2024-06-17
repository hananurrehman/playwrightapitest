import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require("dotenv").config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  globalTeardown: "./teardown.ts",
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: "html",
  metadata: {
    env: "Test",
    type: "API and UI",
    url: "https://github.com/hananurrehman/playwrightapitest",
  },
  reporter: "list",
  /* reporter: [
    [
      "monocart-reporter",
      {
        name: "Playwright API test",
        outputFile: "./test-results/report.html",

        onEnd: async (reportData, { sendEmail, config }) => {
          const emailOptions = {
            transport: {
              service: "Hotmail",
              auth: {
                user: process.env.REPORTEMAIL,
                pass: process.env.REPORTPASSWORD,
              },
            },
            message: {
              from: "testhanan@outlook.com",
              to: "hananurrehman@gmail.com",
              cc: "",
              bcc: "",

              subject: `${reportData.name} - ${reportData.dateH}`,
              attachments: [
                {
                  path: reportData.htmlPath,
                },
              ],

              html: `
                            <h3>${reportData.name}</h3>
                            <ul>
                                <li>Env: ${reportData.metadata.env}</li>
                    <li>Type: ${reportData.metadata.type}</li>
                    <li>Url: ${reportData.metadata.url}</li>
                    <li>Date: ${reportData.dateH}</li>
                    <li>Duration: ${reportData.durationH}</li>
                            </ul>
                            
                            ${reportData.summaryTable}

                            <p>Please check attachment html for detail.</p>

                            <p>Thanks,</p>
                        `,
            },
          };

          const info = await sendEmail(emailOptions).catch((e) => {
            console.error(e);
          });
          if (info) {
            console.log(info);
          }
        },
      },
    ],
  ], */
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    extraHTTPHeaders: {
      accept: "application/json",
    },
  },

  /* Configure projects for major browsers */
  projects: [
    /* {
      name: "Setup",
      teardown: "Clean up DB",
    },
    {
      name: "Clean up DB",
      testMatch: /teardown\.ts/,
    }, */
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },

      //dependencies: ["Setup"],
    },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
