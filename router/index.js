const { AuthController } = require("../controller");

module.exports = (app) => {
  app.post("/auth/login", AuthController.login),
  app.get("/auth/check", AuthController.check)
}