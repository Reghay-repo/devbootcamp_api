const mongoose = require('mongoose');
const {Schema} = mongoose;

const reviewSchema = Schema({
    title: {
        type:String,
        required:[true,'Please add a review title'],
        trim:true
    },
    text:{
        type:String,
        required:[true,'Please add a review text'],
    },
   
    rating:{
        type:Number,
        min:1,
        max:10,
        required:[true,'rating must be between 1 and 10'],
    },
    user:{
      type:mongoose.Schema.ObjectId,
      ref:'User',
      required:true
  },
    bootcamp:{
      type:mongoose.Schema.ObjectId,
      ref:'Bootcamp',
      required:true
  },
   

},
 {
    timestamps: true
}
);

const Review = mongoose.model('Review', reviewSchema);


module.exports = Review;