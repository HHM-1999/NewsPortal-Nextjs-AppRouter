"use client";
import { useEffect, useState } from "react";

export default function SocialShare({ title, contentID }) {
  const [pageURL, setPageURL] = useState("");


  useEffect(() => {
    const urlArr = window.location.href.split("/");
    // console.log(urlArr);
    urlArr[urlArr.length - 1] = contentID;
    const url = urlArr.join("/");
    setPageURL(url);
  }, [contentID]);

  useEffect(() => {
    const scriptId = "sharethis-inline-share-buttons";

    // Function to load script synchronously
    const loadShareThis = () => {
      return new Promise((resolve) => {
        const existingScript = document.getElementById(scriptId);
        if (!existingScript) {
          const script = document.createElement("script");
          script.id = scriptId;
          script.src = "https://platform-api.sharethis.com/js/sharethis.js#property=6809e6d0eebbe9001a9ff1c8&product=inline-share-buttons&source=platform";
          script.onload = () => resolve(true);
          document.body.appendChild(script);
        } else {
          resolve(true);
        }
      });
    };

    loadShareThis().then(() => {
      if (window.__sharethis__) {
        window.__sharethis__.initialize();
      }
    });
  }, []);

  return (
    <div className="DSocialTop d-flex justify-content-start gap-2 mt-3 mb-2">
      <div className="sharethis-inline-share-buttons" data-url={pageURL} data-title={title}></div>
    </div>
  );
}
