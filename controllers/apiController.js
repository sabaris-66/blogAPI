const bcrypt = require("bcryptjs");
require("dotenv").config();
const { body, validationResult } = require("express-validator");
const prismaQueries = require("../prisma/prismaQueries");
const jwt = require("jsonwebtoken");

const validateUser = [
  body("username")
    .trim()
    .isAlphanumeric()
    .withMessage("User Id - only alphaNumeric characters")
    .isLength({ min: 8, max: 18 })
    .withMessage("User Id more than 8 and less than 18 characters")
    .custom(async (value) => {
      const existingUser = await prismaQueries.findByUsername(value);
      if (existingUser && existingUser.username == value) {
        throw new Error("A user already exists with this username");
      }
    }),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address")
    .isLowercase()
    .withMessage("Only lowercase characters are accepted")
    .custom(async (value) => {
      const existingUser = await prismaQueries.findByEmail(value);
      if (existingUser && existingUser.email == value) {
        throw new Error("Email Id already exists");
      }
    }),
  body("password")
    .trim()
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Not a strong password"),
  body("confirmPassword").custom((value, { req }) => {
    if (value === req.body.password) {
      return true;
    }
    throw new Error("Password and confirm password must be same");
  }),
];

exports.postSignUp = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    //   if no error arises
    const { username, email, password } = req.body;

    //password bcrypt and push it into database
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        throw new Error(err);
      } else {
        await prismaQueries.pushBlogUser(username, email, hashedPassword);
      }
    });

    res.json({ message: "You have registered successfully" });
  },
];

// if i remember right jwt - 3 steps - sign, verify, getTokenFromHeaderReq
exports.postLogIn = async (req, res) => {
  // payload
  const user = await prismaQueries.findUser(req.body.username);
  if (!user) {
    return res.status(404).send("Username not found");
  } else {
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(404).send("Wrong Password");
    } else {
      jwt.sign(
        { user },
        process.env.SECRET_KEY,
        { expiresIn: "100s" },
        (err, token) => {
          return res.json({ token });
        }
      );
    }
  }
};
