const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')
const { Schema } = mongoose;
const { body, validationResult } = require("express-validator");
const remainderinfo = require('../models/remainderInfo')
const fetchAdmin = require('../middleware/fetchadmin')
//Add any Event code
router.post(
  "/addReminder", fetchAdmin,
  
  async (req, res) => {
    try {
      const {reminderMsg,remindAt} = req.body;
      const remainderInfo = new remainderinfo({
          reminderMsg,
          remindAt,
          isReminded : false,
          user:req.user.id
      });
     
      const saveData = await remainderInfo.save();
      success = true
      res.json({success, data:saveData});
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "error occcoure" });
    }
  }
);

  router.get("/alleventinfo", fetchAdmin, async (req, res) => {
    try {
      const note = await remainderinfo.find({ user: req.user.id });
      res.json(note);
      // res.json([])
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "error occcoure" });
    }
  });

  router.delete("/deleteevent/:id", fetchAdmin, async (req, res) => {
    try {
      // if tag present then changed the tag content and put into the newNote obj
      let note = await remainderinfo.findById(req.params.id); //req.params.id means "/updatenotes/:id"
      //if notes is note present
      if (!note) {
        return res.status(404).send("not found");
      }
  
      if (note.user.toString() !== req.user.id) {
        return res.status(404).send("not valid user");
      }
      note = await remainderinfo.findByIdAndDelete(req.params.id);
      res.json(note);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "error occcoure" });
    }
  });
  
module.exports =router