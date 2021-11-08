const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
  console.log("inside the verify module");
  const authHeader = req.headers.authorization;
  try {
    if (authHeader) {
      const token = authHeader.split(" ")[2];

      const decoded = jwt.verify(token, "zask19032001");

      if (decoded) {
        next();
      } else {
        res.status(400).json({
          error: "please login ",
        });
      }
    }
  } catch {
    console.log("failed");
  }
};

module.exports = verify;
