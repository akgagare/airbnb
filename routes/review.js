const express=require('express');
const router=express.Router();
const Review =require("../models/review.js");
const Listing=require("../models/listing.js");
router.post('/listings/:id/review',async(req,res)=>{
    try{
        console.log("hitting the backend");
        const id=req.params.id;
        const listing=await Listing.findById({_id:id});
        let newReview = new Review(req.body.review);
        listing.review.push(newReview);
        await newReview.save();
        await listing.save();

        console.log("new Review saved ");
        req.flash("success","New Review Added Successfully");
        res.redirect(`/listings/${listing._id}`);
    }   
    catch(e){
        console.log("error->>>",e);
    }
    
})


//delete review route
router.delete("/listings/:id/reviews/:reviewId",async(req,res)=>{
    const id=req.params.id;
    const reviewId=req.params.reviewId;
    await Listing.findByIdAndUpdate(id,{$pull :{review:reviewId}});
    await Review.findByIdAndDelete({_id:reviewId});
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
})



module.exports=router;