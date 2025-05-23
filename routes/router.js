const express = require("express");
const router = express.Router();
const {
  signUpHandler,
  refreshHandler,
  loginHandler,
  initiatePayment,
  verifyPayment,
  getAccess,
  getBalance,
  ninValidation,
  suspendedNin,
  dataModification,
  getRequestHistory,
  editRequestStatus,
  updateBalance,
  userRequestHistory,
  ninDemographic,
  sharedNinFile,
  getAllUsers,
} = require("../controllers/controller");
const upload = require("../utils/multerFileUpload");

// public routes
router.post("/signup", signUpHandler);
router.post("/login", loginHandler);
router.post("/initiate-payment", initiatePayment);
router.post("/verify-payment", verifyPayment);
router.get("/get-access", getAccess);
router.get("/get-balance", getBalance);
router.post("/nin-validation", ninValidation);
router.post("/suspended-nin", suspendedNin);
router.post("/data-modification", upload.single("picture"), dataModification);
router.get("/get-request-history", getRequestHistory);
router.put("/edit-request-status/:id/:status", editRequestStatus);
router.put("/update-balance/:phone/:newBalance", updateBalance);
router.get("/user-request-history", userRequestHistory);
router.post("/nin-demographic-search", ninDemographic);
router.post("/shared-nin-file", sharedNinFile);
router.get("/get-all-users", getAllUsers);
router.get("/refresh-server", refreshHandler);

module.exports = router;
