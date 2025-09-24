import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../components/ui/Card";
import { Sidebar } from "../components/ui/Sidebar";
import { LoadingIcon } from "../icons/LoadingIcon";
import { MenuIcon } from "../icons/MenuIcon";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const SharedBrain = () => {
  const { shareLink } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/brain/${shareLink}`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch shared brain:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [shareLink]);

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingIcon size="xxl" color="#5046e4" />
      </div>
    );

  if (!data)
    return <p className="p-6 text-gray-500 text-xl">No brain found.</p>;

  // Apply sidebar filter
  const filteredContent = activeFilter
    ? data.content.filter((c: any) => c.type === activeFilter)
    : data.content;

  // Sidebar item click
  const handleSidebarClick = (item: string) => {
    if (activeFilter === item) {
      setActiveFilter(null); // toggle back to all
    } else {
      setActiveFilter(item);
    }
    setSidebarOpen(false); // close sidebar on mobile
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (read-only) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeItem={activeFilter}
        onItemClick={handleSidebarClick}
      />

      {/* Main content */}
      <div className="flex-1 ml-0 sm:ml-[250px] p-4 sm:p-6 relative">
        {/* Mobile Hamburger */}
        <button
          className="sm:hidden mb-4 text-gray-600"
          onClick={() => setSidebarOpen(true)}
        >
          <MenuIcon size="lg" />
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">All Notes</h1>
        </div>

        {/* Cards */}
        {filteredContent.length === 0 ? (
          <div className="w-full h-[500px] flex justify-center items-center">
            <h3 className="text-2xl text-gray-300">No content found</h3>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 justify-evenly">
            {filteredContent.map((c: any) => (
              <Card
                key={c._id}
                type={c.type}
                title={c.title}
                link={c.link}
                tags={c.tags.map((t: any) => t.title)}
                addedOn={new Date(c.createdAt).toLocaleDateString()}
                onDelete={undefined} // read-only
                onShare={undefined} // read-only
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
