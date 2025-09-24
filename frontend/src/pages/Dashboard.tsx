import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { CreateContentModal } from "../components/ui/CreateContentModal";
import { AddIcon } from "../icons/AddIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Sidebar } from "../components/ui/Sidebar";
import { MenuIcon } from "../icons/MenuIcon.tsx";
import { LoadingIcon } from "../icons/LoadingIcon.tsx";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allContents, setAllContents] = useState<any[]>([]); // master copy
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sharedLink, setSharedLink] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const fetchContents = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v1/content`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (Array.isArray(data)) {
        // Sort by createdAt descending (newest first)
        const sortedData = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setContents(sortedData);
        setAllContents(sortedData); //master copy
      } else {
        console.error("Invalid data returned:", data);
        setContents([]);
      }
    } catch (err) {
      console.error("Failed to fetch contents", err);
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  // fetch content on mount
  useEffect(() => {
    fetchContents();
  }, []);

  const handleContentAdded = () => {
    fetchContents();
  };

  // delete content
  const handleDeleteContent = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this content?"))
      return;
    try {
      await axios.delete(`${BASE_URL}/api/v1/content/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // remove UI
      setContents((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete content:", err);
    }
  };

  // sidebar buttons
  const handleSidebarItemClick = (item: string) => {
    if (activeFilter === item) {
      // if already active, toggle back to all content
      setContents(allContents);
      setActiveFilter(null);
    } else {
      switch (item) {
        case "tweet":
        case "youtube":
        case "document":
        case "link":
          setContents(allContents.filter((c) => c.type === item));
          break;
        case "tags":
          console.log("Open tag filter modal");
          break;
        default:
          setContents(allContents); // fallback
      }
      setActiveFilter(item);
    }

    setSidebarOpen(false); // close sidebar on mobile
  };

  // share brain toggle
  const handleShareBrain = async () => {
    try {
      if (sharedLink) {
        // already shared -> unshare
        await axios.post(
          `${BASE_URL}/api/v1/brain/share`,
          { share: false },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Brain sharing disabled. Link is now invalid.");
        setSharedLink(null);
      } else {
        // not shared -> share
        const res = await axios.post(
          `${BASE_URL}/api/v1/brain/share`,
          { share: true },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const link = res.data.shareLink;
        setSharedLink(link);

        // copy to clipboard
        await navigator.clipboard.writeText(link);
        alert("Link copied to clipboard! You can now share it with others.");
      }
    } catch (err) {
      console.error("Failed to toggle brain sharing:", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onItemClick={handleSidebarItemClick}
        onClose={() => setSidebarOpen(false)}
        activeItem={activeFilter}
      />

      {/* Main content */}
      <div className="flex-1 ml-0 sm:ml-[250px] p-4 sm:p-6 relative">
        {/* Hamburger button (mobile) */}
        <button
          className="sm:hidden mb-4 text-gray-600"
          onClick={() => setSidebarOpen(true)}
        >
          <MenuIcon size="lg" />
        </button>

        {/* Header and Action buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">All Notes</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="secondary"
              size="md"
              text={sharedLink ? "Unshare Brain" : "Share Brain"}
              startIcon={<ShareIcon size="md" />}
              onClick={handleShareBrain}
            />
            <Button
              variant="primary"
              size="md"
              text="Add Content"
              startIcon={<AddIcon size="md" />}
              onClick={() => setModalOpen(true)}
            />
          </div>
        </div>

        {/* Cards section */}
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <LoadingIcon size="xxl" color="#5046e4" />
          </div>
        ) : contents.length === 0 ? (
          <div className="w-full h-[500px]  flex justify-center items-center">
            <h3 className="text-2xl text-gray-200">No content yet</h3>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 justify-evenly">
            {contents.map((c) => (
              <Card
                key={c._id}
                type={c.type}
                title={c.title}
                link={c.link}
                tags={c.tags.map((t: any) => t.title)}
                onShare={() => console.log("Share", c._id)}
                onDelete={() => handleDeleteContent(c._id)}
                addedOn={new Date(c.createdAt).toLocaleDateString()}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAdd={handleContentAdded}
        />
      </div>
    </div>
  );
};
