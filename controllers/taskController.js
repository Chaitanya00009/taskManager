const taskModel = require("../models/taskModel");
const userModel = require("../models/userModel");

async function createTask(req, res) {
  try {
    const { title, description, priority, creator, assignedTo } = req.body;
    const newTask = new taskModel({
      title,
      description,
      priority,
      creator: req.user.userId,
      assignedTo,
      status: "todo",
    });
    const savedTask = await newTask.save();
    return res.status(201).json({ message: "Task created successfully!" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server Error", err });
  }
}

async function getTasks(req, res) {
  try {
    // const email = req.query.email;
    const user = await userModel.findById(req.user.userId);
    // const user = await userModel.findOne({
    //   email: new RegExp(`^${email}$`, "i"),
    // });
    if (!user) {
      return res.status(404).json({ message: "The user doesn't exist" });
    }
    if (user.role === "admin") {
      const result = await taskModel
        .find()
        .populate("creator", "email -_id")
        .populate("assignedTo", "email -_id");
      res.status(200).json(result);
    }
    if (user.role === "user") {
      const result = await taskModel
        .find({
          $or: [{ creator: user._id }, { assignedTo: user._id }],
        })
        .populate("creator", "email -_id")
        .populate("assignedTo", "email -_id");
      res.status(200).json(result);
    }

    // const result = await taskModel
    //   .find()
    //   .populate("creator", "email")
    //   .populate("assignedTo", "email");
    // res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: "Internal Error" });
  }
}

async function updateTasks(req, res) {
  try {
    // const email = req.query.email;
    // const user = await userModel.findOne({
    //   email: new RegExp(`^${email}$`, "i"),
    // });
    const user = await userModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "The user doesn't exist" });
    } else {
      const id = req.query.id;
      const taskID = await taskModel.findOne({ _id: id });
      if (!taskID) {
        return res.status(404).json({ message: "The task doesn't Exist" });
      } else {
        const updateDetails = req.body;
        if (updateDetails.status) {
          if (taskID.assignedTo.toString() === user.id) {
            try {
              const updatedTask = await taskModel.findByIdAndUpdate(
                taskID._id,
                { status: updateDetails.status },
                { new: true },
              );
              return res
                .status(201)
                .json({ message: "This update is completed" });
            } catch (err) {
              return res.status(500).json({ message: "Internal server Error" });
            }
          } else {
            return res.status(403).json({ message: "Forbidden!!" });
          }
        }
        if (
          updateDetails.title ||
          updateDetails.description ||
          updateDetails.assignedTo
        ) {
          const safeUpdates = {};
          if (updateDetails.title !== undefined) {
            safeUpdates.title = updateDetails.title;
          }
          if (updateDetails.description !== undefined) {
            safeUpdates.description = updateDetails.description;
          }
          if (updateDetails.assignedTo !== undefined) {
            safeUpdates.assignedTo = updateDetails.assignedTo;
          }
          if (taskID.creator.toString() === user.id || user.role === "admin") {
            try {
              const updatedTask = await taskModel.findByIdAndUpdate(
                taskID._id,
                safeUpdates,
                { new: true },
              );
              return res.status(200).json({ message: "The update is done" });
            } catch (err) {
              return res.status(500).json({ message: "Internal Server Error" });
            }
          } else {
            return res.status(403).json({ message: "Forbidden!" });
          }
        }
      }
      // return res.status(200).json({ message: "The user is Existing" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function deleteTask(req, res) {
  // const mail = req.query.email;
  const mail = await userModel.findById(req.user.userId);
  const task = req.query.id;
  //  const userExists = await userModel.findOne({ email: mail });
  const taskExists = await taskModel.findById(task);
  if (!userExists) {
    return res.status(404).json({ message: "The user doesn't exist" });
  } else {
    if (userExists.role === "admin") {
      if (!taskExists) {
        return res.status(404).json({ message: "The task doesn't exist" });
      } else {
        const deletedTask = await taskModel.findByIdAndDelete(taskExists.id);
        return res
          .status(200)
          .json({ message: "The task is deleted successfully" });
      }
    } else {
      return res.status(404).json({ message: "Insufficient privileges" });
    }
  }
}

module.exports = { createTask, getTasks, updateTasks, deleteTask };
