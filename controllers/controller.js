const saveUserToDB = require("../services/saveUserToDB.service");
const checkExistingUser = require("../services/checkExistingUser.service");
const getUser = require("../services/getUser.service");
const initiatePaymentService = require("../services/initiatePayment.service");
const verifyPaymentService = require("../services/verifyPayment.service");
const creditUser = require("../services/creditUser.service");
const getBalanceService = require("../services/getBalance.service");
const ninValidationService = require("../services/ninValidation.service");
const suspendedNinService = require("../services/suspendedNin.service");
const dataModificationService = require("../services/dataModification.service");
const getRequestHistoryService = require("../services/getRequestHistory.service");
const editRequestStatusService = require("../services/editRequestStatus.service");
const verifyAdminService = require("../services/verifyAdmin.service");
const updateBalanceService = require("../services/updateBalance.service");
const userRequestHistoryService = require("../services/userRequestHistory.service");
const ninDemographicService = require("../services/ninDemographic.service");
const sharedNinFileService = require("../services/sharedNinFile.service");
const getAllUsersService = require("../services/getAllUsers.service");

const signUpHandler = async (req, res) => {
  try {
    // Check if user already exists
    const { phone } = req.body;
    const userExists = await checkExistingUser(phone);
    if (userExists) {
      res.status(400).json({
        message: `user already exists. User a new phone number.`,
      });
    }

    // save user if it does not exist
    const savedSuccessfully = await saveUserToDB(req.body);
    if (savedSuccessfully) {
      res.status(200).json({
        message: `user successfully registered`,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: `Error: failed to generate to register new user`,
    });
  }
};

const loginHandler = async (req, res) => {
  try {
    // Check if user is admin
    const isAdmin = await verifyAdminService(req.body);
    if (isAdmin) {
      res.status(200).json({
        message: `Welcome Admin`,
        isAdmin: true,
      });
      return;
    }

    // Check if user exists
    const userData = await getUser(req.body);
    if (userData === "user not found" || userData === "incorrect password") {
      res.status(400).json({
        message: `Wrong sign in credentials`,
      });
      return;
    }

    delete userData[0].password;
    res.status(200).json({
      message: `${JSON.stringify(userData[0])}`,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: `Error: ${error}`,
    });
  }
};

const initiatePayment = async (req, res) => {
  try {
    const { access_code, reference } = await initiatePaymentService(req.body);
    res.status(200).json({
      message: { access_code, reference },
    });
  } catch (error) {
    res.status(500).json({
      message: `Error: ${error}`,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const paymentStatus = await verifyPaymentService(req.body);
    if (paymentStatus) {
      const creditedSuccessfully = await creditUser(req.body);
      res.status(200).json({
        message: paymentStatus,
      });
    } else {
      res.status(400).json({
        message: paymentStatus,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: `Error: ${error}`,
    });
  }
};

const getAccess = (req, res) => {
  try {
    const access = process.env.PAYSTACK_PK_TEST;
    res.status(200).json({
      message: access,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: `Error: ${error}`,
    });
  }
};

const getBalance = async (req, res) => {
  const balance = await getBalanceService(req.query.phone);
  try {
    res.status(200).json({
      message: balance,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: `Error: ${error}`,
    });
  }
};

const ninValidation = async (req, res) => {
  try {
    var requestSentSuccessfully = await ninValidationService(req.body);
    if (requestSentSuccessfully) {
      res.status(200).json({
        message: `request for ${req.body.service} successfully sent!`,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: `Error: ${error}`,
    });
  }
};

const suspendedNin = async (req, res) => {
  try {
    var requestSentSuccessfully = await suspendedNinService(req.body);
    if (requestSentSuccessfully) {
      res.status(200).json({
        message: `request for ${req.body.service} successfully sent!`,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: `Message: ${error}`,
    });
  }
};

const dataModification = async (req, res) => {
  try {
    const requestSentSuccessfully = await dataModificationService({
      ...req.body, // Spread the body fields
      pictureFile: req.file, // Include the uploaded file from multer
    });

    if (requestSentSuccessfully) {
      res.status(200).json({
        message: `Request for ${req.body.service} successfully sent!`,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: `Message: ${error.message || error}`,
    });
  }
};

const getRequestHistory = async (req, res) => {
  try {
    var allRequests = await getRequestHistoryService(req.body);
    if (allRequests) {
      res.status(200).json({
        message: allRequests,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: `Message: ${error}`,
    });
  }
};

const editRequestStatus = async (req, res) => {
  try {
    var updateSuccess = await editRequestStatusService(req.params);
    if (updateSuccess) {
      res.status(200).json({
        message: `Successfully updated request status of ${req.params.id} to ${req.params.status}`,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: `Message: ${error}`,
    });
  }
};

const updateBalance = async (req, res) => {
  try {
    var updateSuccess = await updateBalanceService(req.params);
    if (updateSuccess) {
      res.status(200).json({
        message: `Successfully updated balance of ${req.params.phone} to ${req.params.newBalance}`,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: `Message: ${error}`,
    });
  }
};

const userRequestHistory = async (req, res) => {
  try {
    var userRequestData = await userRequestHistoryService(req.query);
    if (userRequestData) {
      res.status(200).json({
        message: userRequestData,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: `Message: ${error}`,
    });
  }
};

const ninDemographic = async (req, res) => {
  try {
    var responseText = await ninDemographicService(req.body);
    if (responseText) {
      res.status(200).json({
        message: responseText,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: `Message: ${error}`,
    });
  }
};

const sharedNinFile = async (req, res) => {
  try {
    var responseText = await sharedNinFileService(req.body);
    if (responseText) {
      res.status(200).json({
        message: responseText,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: `Message: ${error}`,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    var responseText = await getAllUsersService(req.body);
    if (responseText) {
      res.status(200).json({
        message: responseText,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: `Message: ${error}`,
    });
  }
};

const refreshHandler = (req, res) => {
  fetch("https://server-refresher-bot.onrender.com/api/refresher");
  console.log("server has been refreshed!");
  res.json("server has been refreshed!");
};

module.exports = {
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
};
