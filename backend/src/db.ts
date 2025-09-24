import mongoose, { type InferSchemaType } from "mongoose";

// user
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

export type UserType = InferSchemaType<typeof userSchema>;
export const UserModel = mongoose.model("User", userSchema);

// content
const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["document", "tweet", "youtube", "link"],
      required: true,
    },
    link: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export type ContentType = InferSchemaType<typeof contentSchema>;
export const ContentModel = mongoose.model<ContentType>(
  "Content",
  contentSchema
);

// tags
const tagSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
});

export type TagType = InferSchemaType<typeof tagSchema>;
export const TagModel = mongoose.model<TagType>("Tag", tagSchema);

// links
const linkSchema = new mongoose.Schema({
  hash: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export type LinkType = InferSchemaType<typeof linkSchema>;
export const LinkModel = mongoose.model<LinkType>("Link", linkSchema);
