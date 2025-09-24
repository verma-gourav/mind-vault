import { useState } from "react";
import { CrossIcon } from "../../icons/CrossIcon";
import { InputField } from "./InputField";
import type { ContentType } from "./Card";
import axios from "axios";
import { LoadingIcon } from "../../icons/LoadingIcon";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (newContent: any) => void;
}

export const CreateContentModal = ({
  open,
  onClose,
  onAdd,
}: CreateContentModalProps) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ContentType>("youtube");
  const [link, setLink] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const types: ContentType[] = ["youtube", "tweet", "link", "document"];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const payload: Record<string, any> = {
        title,
        type,
        link,
        tags: tags.split(",").map((t) => t.trim()),
      };

      if (type === "document") {
        payload.content = content;
      }

      const res = await axios.post(`${BASE_URL}/api/v1/content`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const savedContent = res.data;
      onAdd(savedContent);

      onClose();

      setTitle("");
      setLink("");
      setContent("");
      setTags("");
      setType("youtube");
    } catch (error: any) {
      console.error(
        "Error creating content",
        error.response?.data || error.message
      );
      alert(
        `Failed creating content: ${error.response?.data || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-blue-100 rounded-xl p-4 sm:p-6 shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Add Content</h2>
          <button
            title="Close"
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-800"
          >
            <CrossIcon size="lg" />
          </button>
        </div>

        {/* Title */}
        <div className="mt-4">
          <InputField
            label="Title"
            placeholder="Enter the title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Type Selection */}
        <div className="mt-4 text-gray-800">
          <h4 className="text-sm font-medium">Select Type</h4>
          <div className="mt-1 flex flex-wrap gap-2 justify-center sm:justify-evenly">
            {types.map((t) => (
              <button
                key={t}
                className={`px-3 py-1 rounded-lg border shadow-sm cursor-pointer text-sm sm:text-base
                  ${
                    type === t
                      ? "bg-blue-200 text-blue-800 border-blue-800"
                      : "bg-white text-gray-400 border-gray-300"
                  }`}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Link */}
        <div className="mt-4">
          <InputField
            label="Link"
            placeholder="Paste the link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {/* Content (only for documents) */}
        {type === "document" && (
          <div className="mt-4">
            <label className="block mb-1 text-sm font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 shadow-sm bg-white text-gray-800 resize-none h-24"
              placeholder="Enter content..."
            />
          </div>
        )}

        {/* Tags */}
        <div className="mt-4">
          <InputField
            label="Tags (comma separated)"
            placeholder="Enter tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div className="mt-6 flex justify-center items-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-[100px] text-white py-2 bg-blue-600 rounded-lg ${
              loading
                ? "cursor-not-allowed"
                : " cursor-pointer hover:bg-blue-800"
            }`}
          >
            {loading ? <LoadingIcon size="md" color="white" /> : "SUBMIT"}
          </button>
        </div>
      </div>
    </div>
  );
};
