const jwt = require("jsonwebtoken");

const MY_SECRET = "cybersec";

const getUser = async (username) => {
  return { userId: 123, password: "123456", username };
};

module.exports = (app) =>
  app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await getUser(username);

    if (user.password !== password) {
      return res.status(403).json({
        error: "invalid login",
      });
    }

    delete user.password;

    const token = jwt.sign(user, MY_SECRET, { expiresIn: "1h" });

    res.cookie("token", token);

    return res.redirect("/welcome");
  });
