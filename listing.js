const mongoose=require('mongoose');
const Review=require('./review.js');
const Schema=mongoose.Schema;
const User=require("./user.js");
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    
    image:{
        type:String,
        default:"https://media.istockphoto.com/id/1126841725/photo/spring-meadow.jpg?s=1024x1024&w=is&k=20&c=blC_DAQQgfzcY5HONCS9rcEKvRm0oZT4-m4cB8Naqks=",
        set:(v)=>v ===""?"https://media.istockphoto.com/id/1126841725/photo/spring-meadow.jpg?s=1024x1024&w=is&k=20&c=blC_DAQQgfzcY5HONCS9rcEKvRm0oZT4-m4cB8Naqks=":v,
    },
    price:{
        type:Number,
        required:true,
    },
    location:String,
    country:String,
    review:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
});
//POST mongoose middleware to delete reviews of listing when we the listing is deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.review}});
    }
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;