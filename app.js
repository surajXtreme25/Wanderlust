if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// ================= DATABASE CONNECTION =================

const MONGO_URL = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

// ================= VIEW ENGINE =================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================= MIDDLEWARE =================

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// ================= SESSION =================

const sessionOption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOption));
app.use(flash());

// ================= PASSPORT =================

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================= GLOBAL MIDDLEWARE =================

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    next();
});

// ================= ROUTES =================

// Listings
app.use("/listings", listingsRouter);

// Reviews
app.use("/listings/:id/reviews", reviewsRouter);

// Users / Login / Signup
app.use("/", userRouter);

// HOME ROUTE
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// ================= 404 ERROR =================

app.all("/*splat", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found !"));
});

// ================= ERROR HANDLER =================

app.use((err, req, res, next) => {
    let {
        statusCode = 500,
        message = "Something Went Wrong !"
    } = err;

    res.status(statusCode).render("error.ejs", { message });
});

// ================= SERVER =================

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});


// if(process.env.NODE_ENV !="production"){
//     require('dotenv').config();

// };



// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// //const Listing = require("./models/listing.js");
// const path = require("path");
// const methodOverride= require("method-override");
// const ejsMate =require("ejs-mate");  // helps to create template and layouts
// //const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError = require("./utils/ExpressError.js");
// //const  { listingSchema, reviewSchema}=require("./schema.js");
// //const Review = require("./models/review.js");
// const listings =require("./routes/listing.js");
// const reviews =require("./routes/review.js");
// const session =require("express-session");
// const flash =require("connect-flash");
// const passport=require("passport");
// const LocalStrategy = require("passport-local");
// const User=require("./models/user.js");
// const { register } = require("module");

// const listingsRouter =require("./routes/listing.js");
// const reviewsRouter =require("./routes/review.js");
// const userRouter =require("./routes/user.js");
// // Creating a Database

// const MONGO_URL = process.env.ATLASDB_URL;

// main().then(() => {
//     console.log("connected to DB");
// }).catch((err) => {
//     console.log(err);
// })
// async function main() {
//     await mongoose.connect(MONGO_URL);
// } 

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.engine('ejs',ejsMate);
// app.use(express.static(path.join(__dirname,"/public")));

// const sessionOption ={ secret :"mysupersecretcode",
//     resave : false,
//     saveUnitialized :true,
//     cookie :{
//         expires :Date.now() + 7*24*60*60*1000,
//         maxAge: 7*24*60*60*1000,
//        httpOnly:true,
//     },
// };

// // Creating a basic API

// // app.get("/", (req, res) => {
// //     res.send("Hi,I am root");
// // });

// app.use(session(sessionOption));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// // use static serialize and deserialize of model for passport session support
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());




// //  Creating a middle ware
// app.use((req,res,next)=>{
//     res.locals.success =req.flash("success");
//     res.locals.error =req.flash("error");
//     res.locals.curUser =req.user;
//     next();
// });

// // app.get("/demouser",async (req,res)=>{
// //     let fakeuser =new User({
// //         email:"student@gmail.com",
// //         username:"suraj maurya",
// //     });
// //     let registeredUser =await User.register(fakeuser,"helloworld");
// //     res.send(registeredUser)
// // });


// // creating function name Validate listings

// // const validateListing=(req,res,next)=>{
// //      let {error}=   listingSchema.validate(req.body);
  
// //   if(error) {
// //     let errMsg =error.details.map((el)=> el.message).join(",");
// //     throw new ExpressError(400,errMsg);
// //   } else{
// //     next();
// //   }
// // };

// // const validateReview=(req,res,next)=>{
// //      let {error}=  reviewSchema.validate(req.body);
  
// //   if(error) {
// //     let errMsg =error.details.map((el)=> el.message).join(",");
// //     throw new ExpressError(400,errMsg);
// //   } else{
// //     next();
// //   }
// // };


// // Index Route

// // app.get("/", wrapAsync(async (req, res) => {
// //     const allListings = await Listing.find({});
// //     console.log(allListings);
// //     res.render("listings/index.ejs", { allListings });
// // }));

// // // New Route
// // app.get("/new", (req, res) => {
// //     res.render("listings/new.ejs");
// // });

// // // Show Route

// // app.get("/:id", wrapAsync(async (req, res) => {
// //     let { id } = req.params;
// //     const listing = await Listing.findById(id).populate("reviews");
// //     console.log(listing.image);
// //     res.render("listings/show.ejs", { listing });
// // }));

// // // Create Route

// // // app.post("/listings", async (req, res) => {
// // //     try {
// // //         console.log("BODY =", req.body);

// // //         const newListing = new Listing(req.body.listing);
// // //         await newListing.save();

// // //         res.redirect("/listings");
// // //     } catch (err) {
// // //         console.log(err);
// // //         res.send(err);
// // //     }
// // // });

// // app.post("/", validateListing, wrapAsync( async (req, res,next) => {
 
// //     const newListing = new Listing(req.body.listing);
// //     await newListing.save();
// //     res.redirect("/listings");
// // }));

// // // Edit Route
// // app.get("/:id/edit",  wrapAsync(async  (req, res) => {
// // let {id}=req.params;
// // const listing =await Listing.findById(id);
// // res.render("listings/edit.ejs",{listing});
// // }));

// // // Update Route
// // app.put("/:id", validateListing,wrapAsync(async (req, res) => {
// // let {id}=req.params;
// //  await Listing.findByIdAndUpdate(id,{...req.body.listing});
// //  res.redirect(`/listings/${id}`);
// // }));

// // // DElete Route
// // app.delete("/:id", wrapAsync( async (req,res)=>{
// //     let {id}=req.params;
// //    let deletedListing= await Listing.findByIdAndDelete(id);
// //    console.log(deletedListing);
// //    res.redirect("/listings");
// // }));

// app.use("/listings",listingsRouter);
// app.use("/listings/:id/reviews",reviewsRouter);
// app.use("/",userRouter);

// // // // Reviews  ka  
// // // Post Route

// // app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req,res)=>{
// //    let listing=await Listing.findById(req.params.id);
// //    let newReview =new Review(req.body.review);

// //    listing.reviews.push(newReview);

// //    await newReview.save();
// //    await listing.save();

// //    res.redirect(`/listings/${listing._id}`);

// // }));

// // // Delete Route for Reviews and Rating

// // app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
// //     let {id,reviewId} = req.params;
// //     await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
// //     await Review.findByIdAndDelete(reviewId);

// //     res.redirect(`/listings/${id}`);
// // })
// // );
// // New Route
// // app.get("/testListing", async (req,res)=>{
// // let sampleListing =new Listing({
// //     title:"My New Village",
// //     description:"By the beach",
// //     price: 1000,
// //     location:"Vill Umara Khas",
// //     country:"India",
// // });
// //  await sampleListing.save();
// //  console.log("sample was saved");
// //  res.send("successful testing");
// // });

// app.all("/*splat",(req,res,next)=>{
//     next(new ExpressError(404,"Page Not Found !"))
// });

// app.use((err,req,res,next)=>{
//     let {statusCode=500 ,message="Something Went Wrong !"} =err;
//     res.status(statusCode).render("error.ejs", {message});
//     // res.status(statusCode).send(message);
// });


// app.listen(8080, () => {
//     console.log("server is listening to port 8080");
// });