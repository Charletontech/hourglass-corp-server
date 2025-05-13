const verifyPaymentService = async ({ reference, fundAmount }) => {
  return new Promise((resolve, reject) => {
    const axios = require("axios");

    const url = `https://api.paystack.co/transaction/verify/${reference}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SK_TEST}`,
        },
      })
      .then((response) => {
        // console.log("Transaction verified:", response.data);
        const { status, amount } = response.data.data;
        if (status == "success" && amount === fundAmount * 100) {
          // Transaction was successful and amount matches
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        // Handle error
        reject(error);
        console.error("Error verifying transaction:", error);
      });
  });
};
module.exports = verifyPaymentService;
