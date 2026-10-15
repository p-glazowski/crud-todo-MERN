function notFound(req, res) {
  return res
    .status(404)
    .json({
      success: false,
      errorMsg: `Route does not exist: ${req.method} ${req.originalUrl}`,
    });
}

module.exports = notFound;
