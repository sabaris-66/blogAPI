require("dotenv").config();
const { Router } = require("express");
const apiRouter = Router();
const apiController = require("../controllers/apiController");

apiRouter.get("/", (req, res) => res.send("api works"));
apiRouter.post("/signUp", apiController.postSignUp);

module.exports = apiRouter;
