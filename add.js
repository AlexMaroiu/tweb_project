const { cookieJwtAuth } = require("./cookieJwtAuth");

module.exports = (app) =>
  app.post("/add", cookieJwtAuth, (req, res) => {
    console.log(req.user);
    res.redirect("/welcome");
  });