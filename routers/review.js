const express=require("express");
const router=express.Router({mergeParams: true});
const WrapAsync=require("../Utils/WrapAsync.js");
const Review = require("../models/review.js");
// const Listing=require("E:/Kumar/Project Management/models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middelware.js");

const reviewController=require("../controllers/review.js");

//reviews
//Post Routs
router.post("/", validateReview, isLoggedIn, WrapAsync(reviewController.createReview));
  
//Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, WrapAsync(reviewController.destroyReview));
  
module.exports=router;
