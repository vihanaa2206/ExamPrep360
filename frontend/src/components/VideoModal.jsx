import { X } from "lucide-react";

const VideoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-black rounded-2xl w-[90%] max-w-3xl aspect-video shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white text-black rounded-full p-2 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* YouTube Video */}
        <iframe
          className="w-full h-full"
      src="https://www.youtube.com/embed/Vd2vNS6baDQ?autoplay=1"
          title="EdTech Story Video"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoModal;

