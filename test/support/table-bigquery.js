var util = require("util"),
    async = require("async"),
    extend = require("extend"),
    Writable = require("stream").Writable,
    uuid = require("node-uuid");

var google = require('googleapis'),
    bigquery = google.bigquery('v2');

module.exports = TableBigquery;

function TableBigquery(options) {
    options = options || {};

    this.projectId = options.projectId;
    this.datasetId = options.datasetId;

    var scopes = [
        "https://www.googleapis.com/auth/bigquery",
        "https://www.googleapis.com/auth/bigquery.insertdata"
    ];
    this._jwtClient = new google.auth.JWT( null, null, null, scopes, null);
    this._jwtClient.fromJSON(options.authJSON);
}
util.inherits(TableBigquery, Writable);

TableBigquery.prototype.create = function(tableName, fields, callback) {
    var params = this.buildRequest({
		"resource": {
            "kind": "bigquery#table",
            "schema": {
                "fields": fields
            },
            "tableReference": {
                "projectId": this.projectId,
                "tableId": tableName,
                "datasetId": this.datasetId
            }
        }
    });

    bigquery.tables.insert(params, callback);
};

TableBigquery.prototype.drop = function(tableName, callback) {
    var params = this.buildRequest({
        "projectId": this.projectId,
        "tableId": tableName,
        "datasetId": this.datasetId
    });

    bigquery.tables.delete(params, function(err, result) {
        // ignore error
        callback(null, result);
    });
};

TableBigquery.prototype.get = function(tableName, callback) {
    var params = this.buildRequest({
        "projectId": this.projectId,
        "tableId": tableName,
        "datasetId": this.datasetId
    });
    bigquery.tables.get(params, callback);
};

TableBigquery.prototype.listData = function(tableName, callback) {
    var params = this.buildRequest({
        "projectId": this.projectId,
        "tableId": tableName,
        "datasetId": this.datasetId
    });

    bigquery.tabledata.list(params, callback);
};

TableBigquery.prototype.list = function(tableName, callback) {
    var params = this.buildRequest({
        "projectId": this.projectId,
        "tableId": tableName,
        "datasetId": this.datasetId
    });

    bigquery.tables.list(params, callback);
};

TableBigquery.prototype.buildRequest = function(data) {
    var request = {};

    extend(request, {
        "auth": this._jwtClient,
		"projectId": this.projectId,
		"datasetId": this.datasetId,
    }, data);

    return request;
}
