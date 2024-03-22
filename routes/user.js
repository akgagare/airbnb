const express=require('express');
const router=express.Router();
const User=require("../models/user.js");
const passport = require('passport');

router.get("/signup",async(req,res)=>{
    res.render("listings/signup.ejs");
})
router.post('/signup',async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Welcome to WanderLust");
            res.redirect("/listings");
        })
        
    }
    catch(e){
        console.log(e);
        //not showing alert 
        req.flash("success",e.message);
        res.redirect("/signup");
    }
    
})
router.get('/login',async(req,res)=>{
    res.render('listings/login.ejs');
})

//need to revise ........===>>>
router.post('/login',passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
   req.flash("success","Welcome to Wanderlust you are loged in ");
   res.redirect('/listings');
})

router.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    });
});
module.exports=router;