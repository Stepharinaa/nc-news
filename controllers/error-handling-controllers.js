const handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request..." });
  } else {
    next(err);
  }
};

module.exports = { handlePSQLErrors };
