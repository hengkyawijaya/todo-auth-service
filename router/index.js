const { AuthController } = require("../controller");

module.exports = (app) => {
  app.post("/auth/login", AuthController.login),
  app.post("/auth/check", AuthController.check)
}