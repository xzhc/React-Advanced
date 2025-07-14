import { useEffect } from "react";
import { useCallback } from "react";
import { useRef } from "react";
import { useState } from "react";

const LIMIT = 50;
function App() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const nextPhotoUrlRef = useRef(); // 用于存储下一页的URL

  async function fetchPhotos(url, { overwrite = false } = {}) {
    setIsLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 2000));

      const response = await fetch(url);
      nextPhotoUrlRef.current = response.headers.get("Link").next;
      const photos = await response.json();

      if (overwrite) {
        setPhotos(photos);
      } else {
        setPhotos((prev) => {
          return [...prev, ...photos];
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPhotos(
      `http://127.0.0.1:3000/photos-short-list?_page=1&_limit=${LIMIT}`,
      {
        overwrite: true,
      }
    );
  }, []);

  const imageRef = useCallback((image) => {
    if (image == null || nextPhotoUrlRef.current == null) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchPhotos(nextPhotoUrlRef.current);
        observer.unobserve(image);
      }
    });
    observer.observe(image);
  }, []);

  return (
    <div className="grid">
      {photos.map((photo, index) => {
        return (
          <img
            src={photo.url}
            key={index}
            ref={index === photos.length - 1 ? imageRef : undefined}
          />
        );
      })}
      {isLoading &&
        Array.from({ length: LIMIT }, (_, index) => index).map((n) => {
          return (
            <div key={n} className="skeleton">
              Loading...
            </div>
          );
        })}
    </div>
  );
}

export default App;
