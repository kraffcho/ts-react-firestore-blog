import React from "react";

interface ShareButtonsProps {
  postTitle: string;
  id?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ postTitle, id }) => {
  const currentDomain = window.location.origin;
  const postUrl = id ? `${currentDomain}/post/${id}` : currentDomain;
  const encodeURI = (string: string): string => {
    return encodeURIComponent(string);
  };

  return (
    <div className="share-buttons">
      {/* Twitter Share Button */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURI(
          postTitle
        )}&url=${encodeURI(postUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-button twitter"
      >
        Share on Twitter
      </a>

      {/* Facebook Share Button */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURI(
          postUrl
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-button facebook"
      >
        Share on Facebook
      </a>

      {/* LinkedIn Share Button */}
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURI(
          postUrl
        )}&title=${encodeURI(postTitle)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-button linkedin"
      >
        Share on LinkedIn
      </a>

      {/* WhatsApp Share Button */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodeURI(
          postTitle + " " + postUrl
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="share-button whatsapp"
      >
        Share on WhatsApp
      </a>
    </div>
  );
};

export default ShareButtons;
