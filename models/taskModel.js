const mongoose = require("mongoose");
const userModel = require("./userModel");

const task = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    priority: { type: String, enum: ["low", "medium", "high"] },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const taskModel = mongoose.model("taskModel", task);

module.exports = taskModel;
