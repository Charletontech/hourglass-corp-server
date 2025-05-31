const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");

const editRequestStatusService = async ({ id, status }) => {
  return new Promise((resolve, reject) => {
    connectDB.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      var sql = ORM.update(
        "hourglass_request_list",
        "status",
        status,
        "id",
        id
      );
      connectDB.query(sql, (err, res) => {
        connection.release();
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  });
};
module.exports = editRequestStatusService;
