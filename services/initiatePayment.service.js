const initiatePayment = async ({ email, fundAmount }) => {
  return new Promise((resolve, reject) => {
    try {
      const axios = require("axios");

      const data = {
        email: email,
        amount: fundAmount * 100,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SK_TEST}`,
          "Content-Type": "application/json",
        },
      };

      axios
        .post("https://api.paystack.co/transaction/initialize", data, config)
        .then((response) => {
          // console.log(response.data);
          resolve(response.data.data);
        })
        .catch((error) => {
          console.error(error);
          throw new Error(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = initiatePayment;
