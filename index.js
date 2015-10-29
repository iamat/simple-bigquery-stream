var Writable = require("stream").Writable;

var uuid = require("node-uuid");

var google = require('googleapis'),
    bigquery = google.bigquery('v2');

module.exports = function createStream (options) {
    var ws = Writable({ objectMode: true });

    var jwtClient = new google.auth.JWT(null,
                                        null,
                                        null,
                                        "https://www.googleapis.com/auth/bigquery.insertdata");

    jwtClient.fromJSON(options.authJSON);

    ws._write = function (chunk, enc, next) {
        var json_items = [chunk];

        bigquery.tabledata.insertAll({
            "auth": jwtClient,
		    "projectId": options.projectId,
		    "datasetId": options.datasetId,
		    "tableId": options.tableId,
		    "resource": {
			    "kind": "bigquery#tableDataInsertAllRequest",
			    "rows": json_items.map(function(d) {
				    return {
					    json: d,
					    insertId: uuid.v4()
				    };
			    })
		    }
        }, function (err, res) {
            if ( res.insertErrors && res.insertErrors.length ) {
                err = err || new Error(JSON.stringify(res.insertErrors));
            }
            next(err);
        });
    };

    return ws;
};
