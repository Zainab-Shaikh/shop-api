const express = require("express");
const router = express.Router();
const crypto = require("crypto");

const User = require("../models/user");

const jwt = require("jsonwebtoken");

router.get("/", (req, res, next) => {
  User.find()
    .select("name email")
    .exec()
    .then((result) => {
      if (result.length > 0)
        res.status(200).json({
          count: result.length,
          user: result.map((docs) => {
            return {
              name: docs.name,
              email: docs.email,
              _id: docs._id,
              req: {
                type: "GET",
                url: `http://localhost:4000/user/${docs._id}`,
              },
            };
          }),
        });
      else
        res.status(404).json({
          message: "no entry found in database",
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});
router.get("/:userId", (req, res, next) => {
  User.findById(req.params.userId)
    .exec()
    .then((result) => {
      if (!result)
        res.status(404).json({
          message: "user not found",
        });
      res.status(200).json({
        name: result.name,
        email: result.email,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});
router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((result) => {
      if (result.length === 0) {
        // const genRandomString = function (length) {
        //   return crypto
        //     .randomBytes(Math.ceil(length / 2))
        //     .toString("hex") /** convert to hexadecimal format */
        //     .slice(0, length); /** return required number of characters */
        // };
        // const sha512 = function (password, salt) {
        //   const hash = crypto.createHmac(
        //     "sha512",
        //     salt
        //   ); /** Hashing algorithm sha512 */
        //   hash.update(password);
        //   const value = hash.digest("hex");
        //   return value;
        // };
        // function saltHashPassword(userpassword) {
        //   const salt = genRandomString(5); /** Gives us salt of length5 */
        //   const passwordData = sha512(userpassword, salt);
        //   console.log(passwordData);
        //   return passwordData;
        // }
        // console.log(req.body.password);
        // const pass = saltHashPassword(req.body.password);
        const reg =
          /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        if (reg.test(req.body.email)) {
          const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          });
          user.setPassword(req.body.password);
          user.save((err) => {
            if (err) {
              res.status(500).json({
                error: {
                  message: err,
                },
              });
            } else {
              res.status(201).json({
                message: "created a user",
                user: user,
              });
            }
          });
        } else {
          res.status(500).json({
            error: {
              message: "please enter correct email format",
            },
          });
        }
      } else {
        res.status(409).json({
          message: "email is already present",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});
router.post("/login", (req, res) => {
  // Find user with requested email

  User.findOne({ email: req.body.email }, function (err, user) {
    if (user === null) {
      return res.status(400).send({
        message: "User not found.",
      });
    } else {
      if (user.validPassword(req.body.password)) {
        const token = jwt.sign(
          { email: req.body.email, password: req.body.password },
          "zask19032001"
        );
        return res.status(201).send({
          message: "User Logged In",
          token: token,
        });
      } else {
        return res.status(400).send({
          message: "Wrong Password",
        });
      }
    }
  });
});
// router.post("/login", (req, res, next) => {
//   User.find({ email: req.body.email })
//     .exec()
//     .then((result) => {
//       if (result.length !== 0) {
//         res.status(200).json({
//           message: "email is present",
//         });
//         const genRandomString = function (length) {
//           return crypto
//             .randomBytes(Math.ceil(length / 2))
//             .toString("hex") /** convert to hexadecimal format */
//             .slice(0, length); /** return required number of characters */
//         };
//         const sha512 = function (password, salt) {
//           const hash = crypto.createHmac(
//             "sha512",
//             salt
//           ); /** Hashing algorithm sha512 */
//           hash.update(password);
//           const value = hash.digest("hex");
//           return value;
//         };
//         function saltHashPassword(userpassword) {
//           const salt = genRandomString(5); /** Gives us salt of length5 */
//           const passwordData = sha512(userpassword, salt);
//           console.log(passwordData);
//           return passwordData;
//         }
//         const pass = saltHashPassword(req.body.password);
//         console.log(result[0].password);
//         console.log(pass);

//         User.methods.validPassword = function (password) {
//           var hash = crypto
//             .pbkdf2Sync(password, this.salt, 1000, 64, `sha512`)
//             .toString(`hex`);
//           return this.hash === hash;
//         };

//         if (result[0].password === pass) {
//           res.status(200).json({
//             message: "password matches",
//           });
//         }
//       } else {
//         res.status(409).json({
//           message: "authentication failed",
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message: err,
//       });
//     });
// });
router.delete("/:userId", (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "user deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});
module.exports = router;
