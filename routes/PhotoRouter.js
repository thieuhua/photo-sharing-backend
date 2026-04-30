const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();


router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const photos = await Photo.find({ user_id: userId })
            .populate({
                path: "comments.user_id",
                select: "_id first_name last_name", // Chỉ lấy thông tin tối thiểu
            });

        if (!photos || photos.length === 0) {
            // Kiểm tra thêm xem userId có tồn tại không để trả về 400 hoặc mảng rỗng
            return res.status(200).json([]); 
        }

        const formattedPhotos = photos.map((photo) => {
            const p = photo.toObject();
            
            const cleanComments = p.comments.map((c) => ({
                _id: c._id,
                date_time: c.date_time,
                comment: c.comment,
                user: c.user_id, // Ở đây user_id đã được populate thành object {first_name, ...}
            }));

            return {
                _id: p._id,
                user_id: p.user_id,
                file_name: p.file_name,
                date_time: p.date_time,
                comments: cleanComments,
            };
        });

        res.status(200).json(formattedPhotos);
    } catch (err) {
        res.status(400).send("Invalid ID or error fetching photos");
    }
});


router.post("/", async (request, response) => {
  
});

router.get("/", async (request, response) => {
  
});

module.exports = router;
