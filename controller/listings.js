const Listing = require("../models/listing");


// ===============================
// INDEX ROUTE
// ===============================


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});

    console.log("================================");
    console.log("TOTAL LISTINGS:", allListings.length);
    console.log("LISTINGS:", allListings);
    console.log("================================");

    res.render("listings/index.ejs", { allListings });
};
// module.exports.index = async (req, res) => {

//     const allListings = await Listing.find({});

//     console.log("All Listings:", allListings);

//     res.render("listings/index.ejs", {
//         allListings
//     });
// };


// ===============================
// NEW LISTING FORM
// ===============================

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");

};


// ===============================
// SHOW LISTING
// ===============================

module.exports.showListing = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");


    // Listing not found
    if (!listing) {

        req.flash(
            "error",
            "Listing you requested for does not exist!"
        );

        return res.redirect("/listings");
    }


    console.log("Listing Image:", listing.image);

    console.log("Listing:", listing);


    res.render("listings/show.ejs", {
        listing
    });

};


// ===============================
// CREATE LISTING
// ===============================

module.exports.createListing = async (req, res) => {

    console.log("Uploaded File:", req.file);

    console.log("Listing Data:", req.body.listing);


    // Agar image upload nahi hui
    if (!req.file) {

        req.flash(
            "error",
            "Please upload an image!"
        );

        return res.redirect("/listings/new");
    }


    const newListing = new Listing(req.body.listing);


    // Cloudinary image
    newListing.image = {

        url: req.file.path,

        filename: req.file.filename

    };


    // Logged-in user owner
    newListing.owner = req.user._id;


    await newListing.save();


    req.flash(
        "success",
        "New Listing Created!"
    );


    res.redirect("/listings");

};


// ===============================
// EDIT LISTING FORM
// ===============================

module.exports.renderEditForm = async (req, res) => {

    const { id } = req.params;


    const listing = await Listing.findById(id);


    if (!listing) {

        req.flash(
            "error",
            "Listing you requested for does not exist!"
        );

        return res.redirect("/listings");
    }


    let originalImageUrl = listing.image.url;


    // Cloudinary image ko edit page par
    // preview ke liye resize karna
    originalImageUrl = originalImageUrl.replace(
        "/upload",
        "/upload/w_250"
    );


    res.render("listings/edit.ejs", {

        listing,

        originalImageUrl

    });

};


// ===============================
// UPDATE LISTING
// ===============================

module.exports.updateListing = async (req, res) => {

    const { id } = req.params;


    // Existing listing find karo
    const listing = await Listing.findById(id);


    if (!listing) {

        req.flash(
            "error",
            "Listing you requested for does not exist!"
        );

        return res.redirect("/listings");
    }


    // Update text fields
    Object.assign(
        listing,
        req.body.listing
    );


    // Agar new image upload hui hai
    if (req.file) {

        console.log(
            "New Uploaded File:",
            req.file
        );


        listing.image = {

            url: req.file.path,

            filename: req.file.filename

        };

    }


    // Save updated listing
    await listing.save();


    req.flash(
        "success",
        "Listing Updated!"
    );


    res.redirect(`/listings/${id}`);

};


// ===============================
// DELETE LISTING
// ===============================

module.exports.destroyListing = async (req, res) => {

    const { id } = req.params;


    const deletedListing =
        await Listing.findByIdAndDelete(id);


    console.log(
        "Deleted Listing:",
        deletedListing
    );


    req.flash(
        "success",
        "Listing Deleted!"
    );


    res.redirect("/listings");

};

// const Listing = require("../models/listing");

// module.exports.index = async (req, res) => {
//     const allListings = await Listing.find({});
//     console.log(allListings);
//     res.render("listings/index.ejs", { allListings });
// };


// module.exports.renderNewForm = (req, res) => {


//     res.render("listings/new.ejs");
// };

// module.exports.showListing = async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" }, }).populate("owner");
//     console.log(listing.image);
//     if (!listing) {
//         req.flash("error", "Listing you requested for does not exist!");
//         return res.redirect("/listings");
//     }
//     console.log(listing);
//     res.render("listings/show.ejs", { listing });
// };


// module.exports.createListing = async (req, res, next) => {
//     let url = req.file.path;
//     let filename = req.file.filename;
//     const newListing = new Listing(req.body.listing);
//     newListing.image = {
//         url: url,
//         filename: filename,
//     };
//     newListing.owner = req.user._id;
//     await newListing.save();
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
// };

// module.exports.renderEditForm = async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//         req.flash("error", "Listing you requested for does not exist!");
//         res.redirect("/listings");
//     }
//     let originalImageUrl= listing.image.url;
//    originalImageUrl= originalImageUrl.replace("/upload");
//     res.render("listings/edit.ejs", { listing ,originalImageUrl });
// };



// module.exports.updateListing = async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     if(typeof req.file !== "undefined"){
//     let url = req.file.path;
//     let filename = req.file.filename;
//     newListing.image = {
//         url: url,
//         filename: filename,
//     };
//      await Listing.save();
// }
//     req.flash("success", "Listing Updated!");
//     res.redirect(`/listings/${id}`);
// };

// module.exports.destroyListing = async (req, res) => {
//     let { id } = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     req.flash("success", "Listing Deleted!");
//     res.redirect("/listings");
// };