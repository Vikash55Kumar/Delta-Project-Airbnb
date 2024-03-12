const Listing=require("./models/listing");
const Review=require("./models/review");
const {listingSchema}=require("./schema.js");
const ExpressError=require("./Utils/ExpressError.js");
const {reviewSchema}=require("./schema.js");
const review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()) {
        // request.user ki help se hum check kara ge ki hum login haa ki nahi
        // console.log(req.user);
        
        //redirect session if ask for login after login it redirect by default where they ask fo login
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req, res, next) => {
    let {id} = req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    // next ko call nahi kara ga to code stuck ho jaiya ga
    next();
}

module.exports.validateListing =(req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400, error);
    } else {
    next();
    }
};

module.exports.validateReview =(req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400, error);
    } else {
    next();
    }
};

module.exports.isReviewAuthor= async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};