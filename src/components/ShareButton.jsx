import React, { useState } from 'react';
import {
  Facebook,
  Twitter,
  Send, // For Telegram
  Copy,
  X as CloseIcon,
  Globe,
  Share
} from 'lucide-react';
import Button from "./Button.jsx";
import toast from "react-hot-toast";

const ShareButton = ({ title, text, url }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.error('Sharing failed:', err);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!', {
        style: {
          borderRadius: '8px',
          background: 'var(--color-dark-12)',
          color: '#fff',
        },
      });
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const openShareUrl = (shareUrl) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);

  return (
    <>

      <Button
        text={"Share"}
        className={"!bg-brown-65 gap-2"}
        onClick={handleShare}
        CustomIcon={Share}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="relative border-2 border-dashed border-dark-15 bg-dark-06 p-6 rounded-xl w-[90%] max-w-md shadow-lg">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <CloseIcon size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Share this product</h2>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() =>
                  openShareUrl(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`)
                }
                className="bg-blue-500 text-white flex items-center justify-center gap-2 px-4 py-2 rounded hover:bg-blue-600"
              >
                <Send size={18} />
                Telegram
              </button>

              <button
                onClick={() =>
                  openShareUrl(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)
                }
                className="bg-[#1877f2] text-white flex items-center justify-center gap-2 px-4 py-2 rounded hover:bg-[#165dd1]"
              >
                <Facebook size={18} />
                Facebook
              </button>

              <button
                onClick={() =>
                  openShareUrl(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`)
                }
                className="bg-black text-white flex items-center justify-center gap-2 px-4 py-2 rounded hover:bg-gray-800"
              >
                <Twitter size={18} />
                X (Twitter)
              </button>

              <button
                onClick={() =>
                  openShareUrl(`https://vk.com/share.php?url=${encodedUrl}`)
                }
                className="bg-[#4c75a3] text-white flex items-center justify-center gap-2 px-4 py-2 rounded hover:bg-[#3b5e88]"
              >
                <Globe size={18} />
                VK
              </button>
            </div>

            <div>
              <input
                type="text"
                readOnly
                value={url}
                className="w-full border px-3 py-2 rounded mb-3"
                onClick={(e) => e.target.select()}
              />
              <button
                onClick={handleCopy}
                className="bg-green-600 text-white w-full px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Copy size={18} />
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;
