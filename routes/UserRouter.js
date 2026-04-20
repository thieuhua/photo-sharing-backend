const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

// API: /user/list
router.post("/list", async (req, res) => {
  try {
        const users = await User.find({}).select("_id first_name last_name");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});
// API: /user/:id
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id).select("_id first_name last_name location description occupation");
        if (!user) {
            return res.status(400).send("User not found");
        }
        res.status(200).json(user);
    } catch (err) {
        // Trả về 400 nếu ID không đúng định dạng MongoDB
        res.status(400).send("Invalid User ID");
    }
});


router.post("/", async (request, response) => {
  
});

router.get("/", async (request, response) => {
  
});

module.exports = router;