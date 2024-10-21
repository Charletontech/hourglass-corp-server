const vetEmptyFields = (payload) => {
  var fieldIsEmpty = false;

  for (const field in payload) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      const currentField = payload[field];
      if (currentField === "" || currentField === null) {
        fieldIsEmpty = true;
      }
    }
  }

  return fieldIsEmpty;
};

module.exports = vetEmptyFields;
