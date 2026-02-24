import {
  X,
  Facebook,
  Linkedin,
  Send,
  MessageCircle,
  Share2,
} from "lucide-react";

const shareLinks = [
  {
    name: "WhatsApp",
    icon: <MessageCircle size={30} strokeWidth={1.8} />,
    color: "bg-green-500",
    url: "https://api.whatsapp.com/send?text=",
  },
  {
    name: "Facebook",
    icon: <Facebook size={30} strokeWidth={1.8} />,
    color: "bg-blue-600",
    url: "https://www.facebook.com/sharer/sharer.php?u=",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin size={30} strokeWidth={1.8} />,
    color: "bg-blue-700",
    url: "https://www.linkedin.com/sharing/share-offsite/?url=",
  },
  {
    name: "Telegram",
    icon: <Send size={30} strokeWidth={1.8} />,
    color: "bg-sky-500",
    url: "https://t.me/share/url?url=",
  },
  {
    name: "Reddit",
    icon: <Share2 size={30} strokeWidth={1.8} />,
    color: "bg-orange-600",
    url: "https://www.reddit.com/submit?url=",
  },
];

const ShareModal = ({ onClose }) => {
  const currentUrl = window.location.href;

  const handleShare = (baseUrl) => {
    window.open(baseUrl + encodeURIComponent(currentUrl), "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-7 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          Share this page
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Share with your friends
        </p>

        {/* ICON ROW */}
        <div className="flex justify-between px-2">
          {shareLinks.map((item) => (
            <button
              key={item.name}
              onClick={() => handleShare(item.url)}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`${item.color} 
                  w-14 h-14 rounded-full 
                  flex items-center justify-center 
                  shadow-lg 
                  group-hover:scale-110 
                  transition-all duration-200`}
              >
                <span className="text-white">
                  {item.icon}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-700">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
