const vetEmptyFields = (payload) => {
  var fieldIsEmpty = false;

  if (
    payload.accountNumber === "" ||
    payload.sessionId === "" ||
    payload.settlementId === ""
  ) {
    fieldIsEmpty = true;
  }

  return fieldIsEmpty;
};

module.exports = vetEmptyFields;
