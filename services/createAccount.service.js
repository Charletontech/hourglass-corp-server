require("dotenv").config();
const createAccount = async (userData) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Client-Id", process.env.CLIENT_ID);
  myHeaders.append("X-Auth-Signature", process.env.X_SIGNATURE);

  var raw = JSON.stringify({
    account_name: `${userData.name}`,
    bvn: `${userData.bvn}`,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      process.env.CREATE_ACCOUNT_URL,
      requestOptions
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "error occurred, failed to generate account number. ERCODE: (createAccount.service)",
    });
    throw new Error(
      `An error occurred while generating account number \n Error: ${error}`
    );
  }
};

module.exports = createAccount;
