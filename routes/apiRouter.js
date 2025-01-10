require("dotenv").config();
const { Router } = require("express");
const apiRouter = Router();
const apiController = require("../controllers/apiController");
const jwt = require("jsonwebtoken");

apiRouter.get("/token", verifyToken, apiController.checkTokenValidity);
apiRouter.post("/signUp", apiController.postSignUp);
apiRouter.post("/logIn", apiController.postLogIn);
// apiRouter.post("/check", verifyToken, apiController.check);
apiRouter.get("/allPosts", verifyToken, apiController.getPosts);
apiRouter.get("/posts", apiController.getPublishedPosts);
apiRouter.get("/posts/:postId", apiController.getSpPost);
apiRouter.post("/blog", verifyToken, apiController.postNewBlog);
apiRouter.post("/posts/:postId/comment", apiController.postNewComment);
apiRouter.put(
  "/allPosts/:postId/:status",
  verifyToken,
  apiController.updateStatus
);
apiRouter.put("/allPosts/:postId", verifyToken, apiController.updatePost);
apiRouter.delete("/allPosts/:postId", verifyToken, apiController.deletePost);
apiRouter.delete(
  "/allPosts/:postId/comments/:commentId",
  verifyToken,
  apiController.deleteComment
);

// route protection token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader != undefined) {
    req.token = bearerHeader.split(" ")[1];
    next();
  } else {
    return res.sendStatus(400);
  }
}

module.exports = apiRouter;
