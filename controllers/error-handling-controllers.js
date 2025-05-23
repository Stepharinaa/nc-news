const handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid data type" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not found: Foreign key violation..." });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad Request: Missing required fields..." });
  } else if (err.code === "23505") {
    res
      .status(409)
      .send({
        msg: "Conflict: Value already exists/cannot insert duplicate value",
      });
  } else {
    next(err);
  }
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handleServerErrors = (err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).send("internal server error");
};

module.exports = { handlePSQLErrors, handleCustomErrors, handleServerErrors };
