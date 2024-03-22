const express=require('express');
const mongoose=require('mongoose');
const app=express();
const path=require('path');
const Listing=require('./models/listing');
const bodyParser = require('body-parser');
const methodOverride=require('method-override');
const ejsmate=require('ejs-mate');
const wrapAsync=require('./utils/wrapAsync.js');
const ExpressError = require('./utils/expressError.js');
const Review=require('./models/review.js');
const session=require("express-session");
const flash=require("connect-flash");
const passport =require("passport");
const localStrategy=require('passport-local');
const User=require("./models/user.js");
//for ejs setup
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(bodyParser.json());
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs',ejsmate);

app.use(express.static(path.join(__dirname,"/public")));
const listingsRouter=require("./routes/listings.js");
const reviewsRoute=require('./routes/review.js');
const userRouter=require('./routes/user.js');

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000 * 60 * 60 *24 *3,
        maxAge:1000 * 60 * 60 *24 *3,
        httpOnly:true
    }
}
app.use(session(sessionOptions));//craeate a session 
app.use(flash());

app.use(passport.initialize());//to init the passport 
app.use(passport.session());// web app needs to know weather same user is sending requests or some other user is accessing 
passport.use(new localStrategy(User.authenticate()))// passport  ke andar ek localstragey create kiye hai hum ne 
// authenicate -->> user ko login /signup karvana 

passport.serializeUser(User.serializeUser()); //to serialize(insert ) user info into session 
passport.deserializeUser(User.deserializeUser()); // to remove user related  from session.



mongoose.connect("mongodb+srv://arungagare2915:sydLpkVXzgh3cKym@cluster0.ez7sv3z.mongodb.net/wanderlust").then(()=>{
    console.log("Connection Successful");
}).catch((e)=>{
    console.log("Connection error",e);
})
app.get('/',(req,res)=>{
    res.send("Hi, I am root");
})





app.use((req,res,next)=>{
    res.locals.success=req.flash("success"); //these line are responsilbe for flash
    res.locals.error=req.flash("error");//these line are responsilbe for flash
    res.locals.currUser=req.user; //now in navbar.ejs we can access the req.user in the form of currUser
    next();
})
//listing router imported ..../////
app.use(listingsRouter);
app.use(reviewsRoute);
app.use(userRouter);

// app.get('/testListing',async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangat",
//         country:"India"
//     })
//     await sampleListing.save();
//     console.log("sample");
//     res.send("successful testing");
// })

app.get("/demo",async(req,res)=>{
    const fakeUser= new User({
        email:"shardda@gmail.com",
        username:"Micro Didi"
    });
    let registeredUser=await User.register(fakeUser,"helloworldAsThePassword");
    //passport has already implemented the logic of the check weither the username already existed or not 
    res.send(registeredUser);
})

app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})
app.use((err,req,res,next)=>{
    let {statusCode,message}=err;
    res.render("listings/error.ejs",{message});
    // res.status(statusCode).send(message);
})


app.listen(3000,()=>{
    console.log("Listening on 3000");
})
