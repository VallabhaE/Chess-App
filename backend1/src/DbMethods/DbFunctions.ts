import mysql from "mysql2";
let CONNECTED =false
// Create a connection to the MySQL server
const connection = mysql.createConnection({
  host: "localhost", // host for connection
  port: 3306, // default port for mysql is 3306
  database: "chessdb", // database you want to connect to
  user: "root", // username for the MySQL connection
  password: "root", // password for the MySQL connection
});

// Connect to the database once
connection.connect((err: any) => {
  if (err) {
    console.log("Error connecting to the database:", err);
  } else {
    CONNECTED = true
    console.log("Connected to the database.");
  }
});

// Function to execute a query
 async function executeQuery(sqlQuery: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // Execute the query using the existing connection
    connection.query(sqlQuery, (err: any, results: any) => {
      if (err) {
        console.log("Error executing query:", err);
        reject(err);
        return;
      }

      console.log("Query results:", results);

      // Resolve the promise with the query results
      resolve(results);
    });
  });
}

// Function to close the connection (call this when your app shuts down)
function closeConnection(): void {
  connection.end((err: any) => {
    if (err) {
      console.log("Error closing connection:", err);
    } else {
      console.log("Connection closed successfully.");
    }
  });
}

// Export the executeQuery and closeConnection functions
export { executeQuery, closeConnection };