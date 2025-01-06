require("dotenv").config();
const { Router } = require("express");
const apiRouter = Router();
const apiController = require("../controllers/apiController");
const jwt = require("jsonwebtoken");

apiRouter.get("/", (req, res) => res.send("api works"));
apiRouter.post("/signUp", apiController.postSignUp);
apiRouter.post("/logIn", apiController.postLogIn);
// apiRouter.post("/check", verifyToken, apiController.check);
apiRouter.get("/allPosts", apiController.getPosts);
apiRouter.get("/posts", verifyToken, apiController.getPublishedPosts);
apiRouter.get("/posts/:postId", apiController.getSpPost);
apiRouter.post("/blog", verifyToken, apiController.postNewBlog);
apiRouter.post(
  "/posts/:postId/comment",
  verifyToken,
  apiController.postNewComment
);
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
    return res.status(400).send("Header - Token Error");
  }
}

module.exports = apiRouter;
