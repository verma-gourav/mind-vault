import express from "express";
import mongoose from "mongoose";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, TagModel, UserModel } from "./db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { authMiddleware } from "./middleware.js";
import { type Request } from "express";
import crypto from "crypto";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => console.log("Connected to MongoDb"))
  .catch((err) => console.error("MongoDb connection error", err));

// zod signup schema
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// signup
app.post("/api/v1/signup", async (req, res) => {
  try {
    const parsedData = signupSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        error: "Validation Failed",
        details: parsedData.error,
      });
    }

    const { username, password } = parsedData.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(400).json({ error: "Username already exists" });
    } else {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// zod signin schema
const signinSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

//signin
app.post("/api/v1/signin", async (req, res) => {
  try {
    const parsedData = signinSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ error: parsedData.error });
    }

    const { username, password } = parsedData.data;

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY as string,
      { expiresIn: "5h" }
    );

    res.json({ message: "Signin successful", token });
  } catch (err) {
    res.status(500).json({ error: "Internal Server error" });
  }
});

// zod content schema
const contentSchema = z.object({
  type: z.enum(["document", "tweet", "youtube", "link"]),
  link: z.string().url(),
  title: z.string().min(1, "Title is required"),
  tags: z.array(z.string()).optional(),
});

interface AuthRequest extends Request {
  user?: { userId: string };
}

// create content
app.post("/api/v1/content", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const parsedData = contentSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({
        error: "Validation Failed",
        details: parsedData.error.format(),
      });
    }

    const { type, link, title, tags = [] } = parsedData.data;

    // convert tag string to ObjectIds
    const tagDocs = await Promise.all(
      tags.map(async (tagTitle) => {
        let tag = await TagModel.findOne({ title: tagTitle });
        if (!tag) {
          tag = await TagModel.create({ title: tagTitle });
        }
        return tag._id;
      })
    );

    const content = new ContentModel({
      type,
      link,
      title,
      tags: tagDocs,
      userId: req.user?.userId,
    });

    await content.save();
    res.status(201).json({ message: "Content created" });
  } catch (err) {
    console.error("Error creating content:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// read content
app.get("/api/v1/content", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const content = await ContentModel.find({ userId })
      .populate("userId", "username")
      .populate({ path: "tags", select: "title", strictPopulate: false })
      .lean();

    res.json(content);
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Internal server error", details: err.message });
  }
});

// delete content
app.delete(
  "/api/v1/content/:id",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user?.userId;
      const contentId = req.params.id;

      const content = await ContentModel.findOne({
        _id: contentId,
        userId: userId,
      });

      if (!content) {
        return res
          .status(404)
          .json({ error: "Content not found or unauthorized" });
      }

      await ContentModel.deleteOne({ _id: contentId, userId: userId });

      res.json({ message: "Content deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server error" });
    }
  }
);

// share brain
app.post(
  "/api/v1/brain/share",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const { share } = req.body;

      if (typeof share !== "boolean") {
        return res.status(400).json({ error: "share(boolean) is required" });
      }

      if (share === true) {
        // generate hash
        let link = await LinkModel.findOne({ userId: req.user?.userId });
        if (!link) {
          const hash = crypto.randomBytes(8).toString("hex");
          link = await LinkModel.create({
            hash,
            userId: req.user?.userId,
          });
        }

        return res.json({
          message: "Shared Link",
          shareLink: `${process.env.FRONTEND_URL}/share/${link.hash}`,
        });
      } else {
        // disable sharing
        await LinkModel.deleteOne({ userId: req.user?.userId });
        return res.json({ message: "Brain sharing disabled" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server error" });
    }
  }
);

// share brain link
app.get("/api/v1/brain/:shareLink", async (req, res) => {
  try {
    const { shareLink } = req.params;

    const link = await LinkModel.findOne({ hash: shareLink }).populate(
      "userId",
      "username"
    );
    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    const content = await ContentModel.find({ userId: link.userId });

    res.json({
      meassge: "Brain fetched successfully",
      sharedBy: (link.userId as any).username,
      content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server error" });
  }
});

const PORT = 3000;
app.listen(PORT);
