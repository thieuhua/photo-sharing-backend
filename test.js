import express from "express";
import cors from "cors";
import mongoose from "mongoose";
const app = express();
const PORT = 8080;
const MONGODB_URL =
  "mongodb+srv://soteran:123@cluster0.ai5qvzz.mongodb.net/simple_blog?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const postSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  comments: [
    {
      id: Number,
      text: String,
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

let counter = 0;
let commentId = 1;
const BlogPosts = {
  "first-blog-post": {
    title: "First Blog Post",
    description: "Lorem ipsum dolor sit amet, consectetur adip.",
  },
  "second-blog-post": {
    title: "Second Blog Post",
    description: "Hello React Router v6",
  },
};
app.get("/api/posts", (req, res) => {
  counter++;
  console.log("/api/posts");
  res.json(BlogPosts);
});

app.get("/api/posts/list", async (req, res) => {
  try {
    const posts = await Post.find({}, "slug title");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/posts/detail/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: "Blog not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// create new post
app.post("/api/post", async (req, res) => {
  const { title, description } = req.body;
  console.log("POST /api/posts");

  if (!title || !description) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // tạo slug đơn giản
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  try {
    const newPost = new Post({ slug, title, description, comments: [] });
    await newPost.save();
    res.status(201).json({ message: "Post created", post: newPost });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Post already exists (duplicate slug)" });
    }
    res.status(500).json({ message: err.message });
  }
});

app.post("api/post/:slug/comments", async (req, res) => {
  const { slug } = req.params;
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text is required" });
  try {
    const post = await Post.findOne({ slug });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = {
      id: Date.now(), // Sử dụng timestamp làm ID đơn giản thay cho counter
      text,
    };

    post.comments.push(newComment);
    await post.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  console.log("POST /api/login");

  // fake auth
  if (username === "admin" && password === "123") {
    return res.json({
      success: true,
      username,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid username or password",
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to the Blog API!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
