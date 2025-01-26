"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql2");
// Create a connection to the MySQL server
var connection = mysql.createConnection({
    host: 'localhost', // host for connection
    port: 3306, // default port for mysql is 3306
    database: 'chessdb', // database you want to connect to
    user: 'root', // username for the MySQL connection
    password: 'root' // password for the MySQL connection
});
var Db = /** @class */ (function () {
    function Db(dbObject) {
        this.dbObject = dbObject;
        this.connectioStatus = false;
    }
    // Connect to the database only once, wrapped in a Promise for async/await
    Db.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.connectioStatus)
                    return [2 /*return*/]; // Prevent reconnecting if already connected
                // Wrapping connection in a Promise
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        connection.connect(function (err) {
                            if (err) {
                                console.log("Error occurred while connecting:", err);
                                reject(err); // Reject if there is an error
                            }
                            else {
                                _this.connectioStatus = true;
                                console.log("Connection created with MySQL successfully");
                                resolve(); // Resolve if connection is successful
                            }
                        });
                    })];
            });
        });
    };
    // Run the query, wrapped in a Promise for async/await
    Db.prototype.quarry = function (sqlQuery) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.connectioStatus) {
                    console.log("Not connected to the database.");
                    return [2 /*return*/];
                }
                // Wrapping query in a Promise
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        connection.query(sqlQuery, function (err, results) {
                            if (err) {
                                console.log("Error executing query:", err);
                                reject(err); // Reject the promise if there is an error
                            }
                            else {
                                console.log("Query results here:", results);
                                resolve(results); // Resolve the promise with the query results
                            }
                        });
                    })];
            });
        });
    };
    // Close the connection when done
    Db.prototype.end = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.connectioStatus) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            connection.end(function (err) {
                                if (err) {
                                    console.log("Error closing connection:", err);
                                    reject(err); // Reject the promise if there is an error
                                }
                                else {
                                    console.log("Connection closed successfully.");
                                    _this.connectioStatus = false;
                                    resolve(); // Resolve when the connection is closed
                                }
                            });
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    return Db;
}());
var chessDataBaseConnection = new Db(connection);
function runDatabaseOperations() {
    return __awaiter(this, void 0, void 0, function () {
        var chessDataBaseConnection, results, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chessDataBaseConnection = new Db(connection);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 7]);
                    // Connect to the database
                    return [4 /*yield*/, chessDataBaseConnection.connect()];
                case 2:
                    // Connect to the database
                    _a.sent();
                    return [4 /*yield*/, chessDataBaseConnection.quarry("SELECT * FROM USERS;")];
                case 3:
                    results = _a.sent();
                    return [3 /*break*/, 7];
                case 4:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 7];
                case 5: 
                // Always close the connection when done
                return [4 /*yield*/, chessDataBaseConnection.end()];
                case 6:
                    // Always close the connection when done
                    _a.sent();
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Run the database operations
runDatabaseOperations();
exports.default = chessDataBaseConnection;
