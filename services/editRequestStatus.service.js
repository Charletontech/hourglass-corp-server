const ORM = require("../database/CharlieDB");
const connectDB = require("../database/main.database");

const editRequestStatusService = async ({ id, status }) => {
  return new Promise((resolve, reject) => {
    var sql = ORM.update("hourglass_request_list", "status", status, "id", id);
    connectDB.query(sql, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(true);
    });
  });
};
module.exports = editRequestStatusService;
