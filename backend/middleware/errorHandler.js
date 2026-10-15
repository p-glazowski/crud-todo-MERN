function errorHandler(err, req, res, next) {
  console.error(err);
  res
    .status(500)
    .json({ success: false, errorMsg: `Something went wrong`, error: err });
}

module.exports = errorHandler;
