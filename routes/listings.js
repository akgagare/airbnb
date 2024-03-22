const express=require('express');
const Listing=require("../models/listing.js");
const router=express.Router();
const ExpressError = require('../utils/expressError.js');
const wrapAsync=require('../utils/wrapAsync.js');

const isLoggedIn=require("../middleware.js");
//index route
router.get('/listings',async(req,res)=>{
    const allListing = await Listing.find({});
    res.render('listings/index.ejs',{allListing});
})
//new  route
router.get('/listings/add',isLoggedIn,async(req,res)=>{
    return res.render('listings/new.ejs');
})
//show route
router.get('/listings/:id',isLoggedIn,async(req,res)=>{
    const id = req.params.id;
    const listing=await Listing.findById({_id:id}).populate("review").populate("owner");
    console.log("owner ->" , listing.owner);
    res.render("listings/show.ejs",{listing});
})

//create Route
router.post('/listings/new',
    wrapAsync(async (req,res,next)=>{
        if(!res){
            throw new ExpressError(400,"Send valid data for listing");
        }
        const listing = new Listing({
            title:req.body.title,
            description:req.body.description,
            price:req.body.price,
            image:req.body.image,
            location:req.body.location,
            country:req.body.country
        })
        if(!listing.description){
            throw new ExpressError(400,"the description is not valid");
        }
        listing.owner=req.user._id;
        await listing.save();
        req.flash("success","New Listing Created");
        res.redirect("/login");
    }));

router.post('/listings/edit',async(req,res)=>{
    try{
        const listing = new Listing({
            title:req.body.title,
            description:req.body.description,
            price:req.body.price,
            location:req.body.location,
            country:req.body.country
        })
        await listing.save();
        res.redirect("/listings");
    }
    catch(e){
        res.send("error msg--->>>>>"+e)
    }
})



//edit form display.
router.get('/listings/:id/edit',isLoggedIn,async(req,res)=>{
    try{
        const {id}=req.params;
        const listing=await Listing.findById({_id:id});
        res.render('listings/edit.ejs',{listing});
    }
    catch(e){
        console.log("edit error ->>" , e);
    }
    
})

//update route
router.put('/listings/:id',async(req,res)=>{
    //actual editing form
    
        let {id} =req.params;
        const editedList=await Listing.findByIdAndUpdate(id,{...req.body});
        req.flash("success","Listing updated  Successfully");
        res.redirect("/listings");

})

//delete router

router.get('/delete/:id',isLoggedIn,async(req,res)=>{
    try{
        const id=req.params.id;
        const findData= await Listing.findByIdAndDelete({_id:id});
        if(!findData){
            req.flash("false","Sorry unable to Delete");
            res.redirect('/listings');

        }
        else{
            req.flash("success","Listing deleted Successfully");
            res.redirect('/listings');
        }
    }
    catch(e){

        console.log("error is delete",e);
    }
        
})


module.exports = router;