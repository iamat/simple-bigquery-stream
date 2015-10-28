var chai = require("chai"),
    async = require("async"),
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
        var stream = createStream({
            projectId: project,
            datasetId: dataset,
            tableId: "stream",
            authJSON: require("../google-key.json") // your JSON key
        });

        stream.write({ field01: "bar", field02: "foo"});
        stream.write({ field01: "foo2", field02: "bar2"});
        stream.on("error", function(err) {
            done(err);
        });
        stream.end(function() {
            done();
        });

    })
    ;

    it("should issue error event because invalid fields", function(done) {
        var stream = createStream({
            projectId: project,
            datasetId: dataset,
            tableId: "stream",
            authJSON: require("../google-key.json") // your JSON key
        });

        stream.write({ invalid: "value"});
        stream.on("error", function(err) {
            done(!err);
        });
    });
});
