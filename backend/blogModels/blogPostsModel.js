const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commSchema = new Schema(
  {
    username: { type: String, required: true, minlength: 2 },
    postfinder: { type: String, required: true },
    commBody: { type: String, required: true },
    parentcommfinder: { type: String },
    posterImageUrl: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3 },
    author: { type: String, required: true },
    summary: { type: String, required: true, minlength: 15 },
    body: { type: String, required: true, minlength: 50, trim: true },
    imageUrl: { type: String, required: true, default: "placeHolder.jpg" },
    cloudinaryId: { type: String, trim: true },
    readTime: { type: Number, required: true },
    tags: { type: Array },
    enum: [
      "Exercise",
      "Sleep",
      "Nutrition",
      "Memory",
      "Emotion",
      "Neuroplasticity",
      "Learning",
    ],
    comments: [commSchema],
  },
  {
    timestamps: true,
  }
);

const blogPosts = mongoose.model("blogPosts", blogPostSchema);
module.exports = blogPosts;
