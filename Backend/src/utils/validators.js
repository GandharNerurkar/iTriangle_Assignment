function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function validatePositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

module.exports = {
  validateEmail,
  validatePositiveInteger,
};
