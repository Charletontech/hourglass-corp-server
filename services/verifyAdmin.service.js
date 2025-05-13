const verifyAdminService = async ({ password, phone }) => {
  return new Promise((resolve) => {
    if (
      phone === process.env.ADMIN_PHONE &&
      password === process.env.ADMIN_PASS
    ) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};
module.exports = verifyAdminService;
