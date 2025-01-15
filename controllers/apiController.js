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
      return res.status(400).json({ errors });
    }

    //   if no error arises
    const { username, email, password } = req.body;

    //password bcrypt and push it into database
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return res.sendStatus(400);
      } else {
        await prismaQueries.pushBlogUser(username, email, hashedPassword);
        return res.sendStatus(200);
      }
    });
  },
];

// if i remember right jwt - 3 steps - sign, verify, getTokenFromHeaderReq
exports.postLogIn = async (req, res) => {
  // payload
  const user = await prismaQueries.findUser(req.body.username);
  console.log(user);
  if (!user) {
    return res.sendStatus(400);
  } else {
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.sendStatus(400);
    } else {
      console.log("password success");
      jwt.sign(
        { user },
        process.env.SECRET_KEY,
        { expiresIn: "3600s" },
        (err, token) => {
          return res.json({ token });
        }
      );
    }
  }
};

exports.check = (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
    if (err) {
      return res.sendStatus(400);
    } else {
      return res.json({
        message: "api/posts",
        authData,
      });
    }
  });
};

exports.getPosts = async (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const posts = await prismaQueries.findPosts();
      return res.json({ posts });
    }
  });
};

exports.getPublishedPosts = async (req, res) => {
  const posts = await prismaQueries.findPublishedPosts();
  return res.json({ posts });
};

exports.getSpPost = async (req, res) => {
  let postId = parseInt(req.params.postId);
  const spPost = await prismaQueries.findPostWithComments(postId);
  return res.json({ spPost });
};

exports.postNewBlog = async (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      res.status(403).send("Token Verification Error");
    } else {
      try {
        await prismaQueries.postNewBlogPost(req.body.title, req.body.content);
        return res.sendStatus(200);
      } catch (error) {
        return res.sendStatus(400);
      }
    }
  });
};

exports.postNewComment = async (req, res) => {
  try {
    let postId = parseInt(req.params.postId);
    await prismaQueries.postNewBlogComment(req.body.comment, postId);
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(400);
  }
};

exports.checkTokenValidity = (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      return res.status(400).json({ error: "Token Expired" });
    } else {
      return res.status(200).json({ message: "Valid Token" });
    }
  });
};

exports.updateStatus = async (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      res.status(403).send("Token Verification Error");
    } else {
      try {
        let status = false;
        let postId = parseInt(req.params.postId);
        if (req.params.status === "true") {
          status = true;
        }
        await prismaQueries.changePublishedStatus(status, postId);
        return res.sendStatus(200);
      } catch (error) {
        return res.sendStatus(400);
      }
    }
  });
};

exports.updatePost = async (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      res.status(403).send("Token Verification Error");
    } else {
      try {
        let postId = parseInt(req.params.postId);
        await prismaQueries.updatePost(
          req.body.newTitle,
          req.body.newContent,
          postId
        );
        return res.sendStatus(200);
      } catch (error) {
        return res.sendStatus(400);
      }
    }
  });
};

exports.deletePost = async (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      res.status(403).send("Token Verification Error");
    } else {
      try {
        let postId = parseInt(req.params.postId);
        await prismaQueries.deletePost(postId);
        return res.sendStatus(200);
      } catch (error) {
        return res.sendStatus(400);
      }
    }
  });
};

exports.deleteComment = async (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      res.status(403).send("Token Verification Error");
    } else {
      try {
        let commentId = parseInt(req.params.commentId);
        await prismaQueries.deleteComment(commentId);
        return res.sendStatus(200);
      } catch (error) {
        return res.sendStatus(400);
      }
    }
  });
};
