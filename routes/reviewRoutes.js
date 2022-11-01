const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/Review");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

// middlewares
const advancedQueryResults = require("../middleware/advancedQueryResults");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedQueryResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), createReview);

router.route("/:id").get(getReview)
.put(protect,authorize('user', 'admin'),updateReview)
.delete(protect,authorize('user', 'admin'),deleteReview);

module.exports = router;