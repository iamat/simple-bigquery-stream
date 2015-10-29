# Simple BigQuery Stream implementation for Node.js

Bare bones stream to push your data to Google's Big Query Service

## Installation

```bash
npm install simple-bigquery-stream
```

Create a google service account in the Google Developer Console and download the JSON key

## Example

    ```javascript
    var createStream = require("simple-bigquery-stream");

    var stream = createStream({
        projectId: "your-project-id",
        datasetId: "testing",
        tableId: "stream",
        authJSON: require("./google-key.json") // your JSON key
    });

    stream.write({ field01: "bar", field02: "foo"});
    stream.write({ field01: "foo2", field02: "bar2"});
    stream.end();

    ```

## Running test (Locally)

*NOTE*: Tests aren't intended to be run on CI server

    ```
    STREAM_PROJECT=<gcloud project> make
    ```
