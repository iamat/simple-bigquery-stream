var chai = require("chai"),
    async = require("async"),
    stream = require("stream"),
    sinon = require("sinon");

var createStream = require("../index"),
    TableBigquery = require("./support//table-bigquery");

var dataset = "testing",
    project = process.env["STREAM_PROJECT"] || "testing";

var tables = new TableBigquery({
    projectId: project,
    datasetId: dataset,
    authJSON: require("../google-key.json")
});

describe("Simple BigQuery Stream - to be run LOCALY", function() {
    before(function(done) {
        async.series([
            // drop table
            function(fn) {
                tables.drop("stream", fn);
            },

            // create table
            function (fn) {
                tables.create("stream", [
                    {
                        "name" : "field01",
                        "type": "STRING"
                    },
                    {
                        "name" : "field02",
                        "type": "STRING"
                    }
                ], fn);
            }
        ], done);

    });

    // Test disabled because an issue saving https messages exchange
    it("should insert new entries", function(done) {
        var simpleStream = createStream({
            projectId: project,
            datasetId: dataset,
            tableId: "stream",
            authJSON: require("../google-key.json") // your JSON key
        });

        simpleStream.write({ field01: "bar", field02: "foo"});
        simpleStream.write({ field01: "foo2", field02: "bar2"});
        simpleStream.end();
        simpleStream.on("error", function(err) {
            done(err);
        });
        simpleStream.on("finish", done);
    })
    ;

    it("should issue error event because invalid fields", function(done) {
        var simpleStream = createStream({
            projectId: project,
            datasetId: dataset,
            tableId: "stream",
            authJSON: require("../google-key.json") // your JSON key
        });

        simpleStream.write({ invalid: "value"});
        simpleStream.on("error", function(err) {
            done(!err);
        });
    });

    it("should be pipeable", function(done) {
        var simpleStream = createStream({
            projectId: project,
            datasetId: dataset,
            tableId: "stream",
            authJSON: require("../google-key.json") // your JSON key
        });

        var readStream = new stream.Readable({
            objectMode: true
        });
        var count = 2;
        readStream._read = function() {
            count--;

            if ( count > 0 ) {
                this.push({ "field01": "value00", "field02": "value01"});
                return;
            }

            this.push(null);

        };

        readStream.pipe(simpleStream);

        simpleStream.on("finish", done);


    });
});
