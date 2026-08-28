const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

// Define Schema

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    
    image: {
        url: String,
        filename:String,
    // filename: {
    //     type: String,
    //     default: "listingimage",
    // },
    // url: {
    //     type: String,
    //     default: "https://www.pexels.com/photo/beautiful-blossoming-branches-against-blue-sky-31092879/",
    //     set: (v) =>
    //         v === ""
    //             ? "https://www.pexels.com/photo/beautiful-blossoming-branches-against-blue-sky-31092879/"
    //             : v,
    // },
},
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },

    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref : "Review"
        },

    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },

});

//  Mongoose Middleware

listingSchema.post("findOneAndDelete",async (listing)=>{
if(listing){
    await Review.deleteMany({_id: {$in:listing.reviews}});
}
});




// Creating MOdels

const Listing =mongoose.model("Listing",listingSchema);
module.exports=Listing;
