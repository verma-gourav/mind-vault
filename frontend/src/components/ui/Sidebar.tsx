import { DocumentIcon } from "../../icons/DocumentIcon";
import { LinkIcon } from "../../icons/LinkIcon";
import { Logo } from "../../icons/Logo";
import { TagIcon } from "../../icons/TagIcon";
import { TweetIcon } from "../../icons/TweetIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClick?: (items: string) => void;
  activeItem?: string | null;
}

export const Sidebar = ({
  isOpen,
  onClose,
  onItemClick,
  activeItem,
}: SidebarProps) => {
  return (
    <div
      className={`
        fixed top-0 left-0 h-screen bg-white border-r border-gray-300 shadow-lg
        w-[250px] transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        sm:translate-x-0
        z-50
      `}
    >
      {/* Header: Logo + Name */}
      <div className="flex items-center gap-3 px-5 py-5 ">
        <div className="text-blue-600">
          <Logo size="xl" />
        </div>
        <h1 className="text-2xl font-bold">Mind Vault</h1>
      </div>

      {/* Menu */}
      <div className="flex flex-col mx-8 mt-20 items-start">
        <nav className="text-gray-600">
          <SidebarItem
            icon={<TweetIcon size="md" />}
            label="Tweets"
            onClick={() => onItemClick && onItemClick("tweet")}
            className={
              activeItem === "tweet" ? "bg-blue-200 text-gray-800" : ""
            }
          />
          <SidebarItem
            icon={<YoutubeIcon size="md" />}
            label="Videos"
            onClick={() => onItemClick && onItemClick("youtube")}
            className={`mt-4 ${
              activeItem === "youtube" ? "bg-blue-200 text-gray-800" : ""
            }`}
          />
          <SidebarItem
            icon={<DocumentIcon size="md" />}
            label="Documents"
            onClick={() => onItemClick && onItemClick("document")}
            className={`mt-4 ${
              activeItem === "document" ? "bg-blue-200 text-gray-800" : ""
            }`}
          />
          <SidebarItem
            icon={<LinkIcon size="md" />}
            label="Links"
            onClick={() => onItemClick && onItemClick("link")}
            className={`mt-4 ${
              activeItem === "link" ? "bg-blue-200 text-gray-800" : ""
            }`}
          />
          <SidebarItem
            icon={<TagIcon size="md" />}
            label="Tags"
            onClick={() => onItemClick && onItemClick("tags")}
            className={`mt-4 ${
              activeItem === "tags" ? "bg-blue-200 text-gray-800" : ""
            }`}
          />
        </nav>
      </div>

      {/* Close button for mobile */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:hidden text-gray-600 hover:text-gray-800"
      >
        ✕
      </button>
    </div>
  );
};
