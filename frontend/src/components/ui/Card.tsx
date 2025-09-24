import { useEffect } from "react";
import { DeleteIcon } from "../../icons/DeleteIcon";
import { DocumentIcon } from "../../icons/DocumentIcon";
import { LinkIcon } from "../../icons/LinkIcon";
import { ShareIcon } from "../../icons/ShareIcon";
import { TweetIcon } from "../../icons/TweetIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";

export type ContentType = "document" | "tweet" | "youtube" | "link";

interface CardProps {
  type: ContentType;
  link: string;
  title: string;
  content?: string;
  tags?: string[];
  addedOn?: string;
  onShare?: () => void;
  onDelete?: () => void;
}

export const Card = (props: CardProps) => {
  useEffect(() => {
    if ((window as any).twttr?.widgets) {
      (window as any).twttr.widgets.load();
    }
  }, [props.link, props.type]);

  const renderPreview = () => {
    switch (props.type) {
      case "youtube":
        return props.link ? (
          <iframe
            className="w-full rounded-md h-40 sm:h-48 md:h-52 lg:h-56"
            src={`https://www.youtube.com/embed/${extractYoutubeId(
              props.link
            )}`}
            title="Youtube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <p className="text-gray-500">Youtube link missing</p>
        );

      case "tweet":
        return props.link ? (
          <div className="w-full overflow-auto">
            <blockquote className="twitter-tweet">
              <a
                href={`${normalizeTweetUrl(props.link)}?ref_src=twsrc%5Etfw`}
              ></a>
            </blockquote>
          </div>
        ) : (
          <p className="text-gray-500">Tweet link missing</p>
        );

      case "link":
        return props.link ? (
          <a
            href={props.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-words"
          >
            {props.link}
          </a>
        ) : (
          <p className="text-gray-500">No link provided</p>
        );

      case "document":
      default:
        return (
          <div className="text-sm text-gray-700 whitespace-pre-line">
            {props.content}
          </div>
        );
    }
  };

  const gradient = () => {
    if (props.type === "tweet") {
      return (
        <div className="absolute bottom-0 w-full h-5 bg-gradient-to-t from-white to-transparent"></div>
      );
    }
    return null;
  };

  return (
    <div
      className="bg-white shadow rounded-xl p-4 flex flex-col justify-between
      w-full sm:w-[300px] md:w-[320px] lg:w-[340px] h-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">
            {props.type === "document" && <DocumentIcon size="md" />}
            {props.type === "tweet" && <TweetIcon size="sm" />}
            {props.type === "youtube" && <YoutubeIcon size="sm" />}
            {props.type === "link" && <LinkIcon size="md" />}
          </span>
          <h3 className="font-semibold text-black text-lg">{props.title}</h3>
        </div>
        <div className="text-gray-400 flex items-center gap-4 self-center">
          {props.onShare && (
            <button
              onClick={props.onShare}
              title="Share"
              className="cursor-pointer hover:text-gray-800"
            >
              <ShareIcon size="sm" />
            </button>
          )}
          {props.onDelete && (
            <button
              onClick={props.onDelete}
              title="Delete"
              className="cursor-pointer hover:text-gray-800"
            >
              <DeleteIcon size="sm" />
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Preview */}
      <div className="relative mb-2">
        {renderPreview()}
        {gradient()}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {props.tags?.map((tag, i) => (
          <span
            key={i}
            className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      {props.addedOn && (
        <p className="text-xs text-gray-400">Added on {props.addedOn}</p>
      )}
    </div>
  );
};

// Extract YouTube video ID
const extractYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : "";
};

// Normalize Tweet Url
const normalizeTweetUrl = (url: string) => {
  if (!url) return "";
  return url.replace(/^https?:\/\/x\.com/, "https://twitter.com");
};
