// ===============================
// Environment Variables
// ===============================

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}


// ===============================
// MongoDB DNS Fix
// ===============================

const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);


// ===============================
// Required Packages
// ===============================

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");


// ===============================
// Routes
// ===============================

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// ===============================
// MongoDB Connection
// ===============================

const MONGO_URL = process.env.ATLASDB_URL;

async function main() {
    try {

        if (!MONGO_URL) {
            throw new Error(
                "ATLASDB_URL is not defined in .env file"
            );
        }

        await mongoose.connect(MONGO_URL);

        console.log("MongoDB Connected Successfully");

    } catch (err) {

        console.log("MongoDB Connection Error:");
        console.log(err.message);

        process.exit(1);
    }
}


// ===============================
// Express Configuration
// ===============================

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    methodOverride("_method")
);

app.engine("ejs", ejsMate);

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ===============================
// Session Configuration
// ===============================

const sessionOption = {

    secret: "mysupersecretcode",

    resave: false,

    saveUninitialized: true,

    cookie: {
        expires: new Date(
            Date.now() +
            7 * 24 * 60 * 60 * 1000
        ),

        maxAge:
            7 * 24 * 60 * 60 * 1000,

        httpOnly: true
    }
};

app.use(
    session(sessionOption)
);

app.use(flash());


// ===============================
// Passport Configuration
// ===============================

app.use(
    passport.initialize()
);

app.use(
    passport.session()
);

passport.use(
    new LocalStrategy(
        User.authenticate()
    )
);

passport.serializeUser(
    User.serializeUser()
);

passport.deserializeUser(
    User.deserializeUser()
);


// ===============================
// Flash Messages & Current User
// ===============================

app.use(
    (req, res, next) => {

        res.locals.success =
            req.flash("success");

        res.locals.error =
            req.flash("error");

        res.locals.currUser =
            req.user;

        next();
    }
);


// ===============================
// Routes
// ===============================

app.use(
    "/listings",
    listingsRouter
);

app.use(
    "/listings/:id/reviews",
    reviewsRouter
);

app.use(
    "/",
    userRouter
);

app.get("/", (req, res) => {
    res.redirect("/listings");
});


// ===============================
// 404 Route
// ===============================
// Express 5 FIX
// Do NOT use app.all("*", ...)

app.all(
    "/{*splat}",
    (req, res, next) => {

        next(
            new ExpressError(
                404,
                "Page Not Found"
            )
        );
    }
);


// ===============================
// Error Handling
// ===============================

app.use(
    (err, req, res, next) => {

        let {
            statusCode = 500,
            message = "Something went wrong!"
        } = err;

        res.status(statusCode).render(
            "error.ejs",
            {
                message
            }
        );
    }
);


// ===============================
// Start Server
// ===============================

const PORT =
    process.env.PORT || 8080;

main()
    .then(() => {

        app.listen(
            PORT,
            () => {

                console.log(
                    `Server is listening on port ${PORT}`
                );
            }
        );

    })
    .catch((err) => {

        console.log(
            "Server Start Error:"
        );

        console.log(err);
    });

