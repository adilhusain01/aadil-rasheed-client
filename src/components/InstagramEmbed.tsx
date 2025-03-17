import { useEffect } from "react";

const InstagramEmbed = ({ url }) => {
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, []);

  return (
    <blockquote
      className="instagram-media max-w-full"
      data-instgrm-captioned
      data-instgrm-permalink={url}
      data-instgrm-version="14"
    ></blockquote>
  );
};

export default InstagramEmbed;
