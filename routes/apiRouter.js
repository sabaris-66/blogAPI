require("dotenv").config();
const { Router } = require("express");
const apiRouter = Router();
const apiController = require("../controllers/apiController");
const jwt = require("jsonwebtoken");

apiRouter.get("/", (req, res) => res.send("api works"));
apiRouter.post("/signUp", apiController.postSignUp);
apiRouter.post("/logIn", apiController.postLogIn);
apiRouter.post("/check", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
    if (err) {
      res.status(403).send("Token Verification Error");
    } else {
      res.json({
        message: "api/posts",
        authData,
      });
    }
  });
});

// route protection token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader != undefined) {
    req.token = bearerHeader.split(" ")[1];
    next();
  } else {
    return res.status(400).send("Header - Token Error");
  }
}

module.exports = apiRouter;
