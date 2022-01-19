# Otter Registry Tests
The following information and framework has been written by Collin Rogers for the purposes of demonstrating a test suite.

## Installation
 - `git clone `
 - `cd otter-registry-test`
 - `npm i`

## Running tests
Since this repo is seperate from the source code from the application, it assumes that the otter registry is running on http://localhost:4000/. To update this, change the environment variable specified in testSetup.js.

To run the tests, run `npm test`

## Important info
- tests directory: This is where the specs for the repo are located.
- testSetup.js: This file aquires authentication for the suite to use for testing.

## Other considerations
 - Because of recent changes in the node runtime, the demo application requires an [npm version prior to v14](https://stackoverflow.com/questions/61806341/how-to-fix-the-feature-watch-recursively-is-unavailable-on-the-current-platform). The tests will run on v12+, but the API still requires something prior to v14.
 - This suite only targets the in-scope functionality. Filtering and sorting are considered out of scope per the documentation.

## Observations
 - When posting an otter, the auth token is preserved in the self reference link for the otter. Is this expected functionality?
