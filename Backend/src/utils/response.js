function sendSuccess(res, data, message = '') {
  const payload = {
    success: true,
    data: data ?? {},
  };

  if (message) {
    payload.message = message;
  }

  return res.status(200).json(payload);
}

module.exports = {
  sendSuccess,
};
