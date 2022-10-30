const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a review title"],
      trim: true,
    },
    text: {
      type: String,
      required: [true, "Please add a review text"],
    },

    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, "rating must be between 1 and 10"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    bootcamp: {
      type: mongoose.Schema.ObjectId,
      ref: "Bootcamp",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Static method to get avg of average rating
reviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.error(err);
  }
};

// calc averageCost after saving a course.
reviewSchema.post("save", async function () {
    this.constructor.getAverageRating(this.bootcamp);
  });
  
  // calc averageCost after removing a course.
  reviewSchema.pre("remove", async function () {
    this.constructor.getAverageRating(this.bootcamp);
  });
  

// prevent user from submitting more than one review
reviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
