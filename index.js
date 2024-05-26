const express = require("express");
const session = require("express-session");
const swaggerJSDOC = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const passport = require("passport");
require("./auth");

const app = express();
const PORT = 8080;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node JS API project for oAuth and mongoDB",
      version: "1.0.0",
    },
    servers: [{ url: "/localhost:8080" }],
  },
  apis: ["./index.js"],
};

const swaggerSpec = swaggerJSDOC(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.listen(PORT, () => console.log(`its alive on http://localhost:${PORT}`));

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.get("/", (req, res) => {
  res.send(`
    <a href="/auth/google">Authenticate with Google</a>
    <a href="/auth/github">Authenticate with Github</a>
    `);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected/google-user",
    failureRedirect: "/auth/google/failure",
  })
);

app.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/protected/github-user",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/protected/google-user", isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
});

app.get("/protected/github-user", isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.username}`);
});

app.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

/**
 * @swagger
 * /:
 *  get:
 *      summary: get the object
 *      responses:
 *          200:
 *              description: ok
 */
// app.get('/home', (req, res) => {
//     res.status(200).send({
//         tshirt: 'maro',
//         size: 'large'
//     })
// });

// app.post('/home/:id', (req, res) => {
//     const { id } = req.params;
//     const { logo } = req.body;

//     if(!logo){
//         res.status(418).send({message: "We need a logo!"});
//     }

//     res.send({
//         thsirt: `shirt with your logo ${logo} and ID of ${id}`
//     });
// });
