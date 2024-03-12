const express=require("express");
const router=express.Router();
const WrapAsync=require("../Utils/WrapAsync.js");
const Listing=require("../models/listing.js");
//to require or link 1-function-name, 2-filename
const {isLoggedIn, isOwner, validateListing}=require("../middelware.js");

const ListingController=require("../controllers/listing.js");

const multer = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({storage})


// use Route.router to get all route request in single route
router
    .route("/")
    //INDEX ROUTE
    .get( WrapAsync(ListingController.index))
    // CREATE ROUTE
    .post( 
        isLoggedIn, 
        upload.single("listing[image]"),
        WrapAsync(ListingController.createListing)
    );


//NEW ROUTE
router.get("/new", isLoggedIn, (ListingController.renderNewForm));

router
    .route("/:id")
    //SHOW ROUTE
    .get(WrapAsync(ListingController.showListing))
    //Update Route
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, WrapAsync(ListingController.updateListing))
    //Delete Request
    .delete(isLoggedIn, isOwner,WrapAsync(ListingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, WrapAsync(ListingController.renderEditForm));

module.exports = router;

