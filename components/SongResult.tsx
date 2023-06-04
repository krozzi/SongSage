import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface SongProps {
  title: string;
  artists: any[];
  image: string;
  id: string;
}
 
function SongResult({ title, artists, image, id }: SongProps) {
  const [truncatedTitle, setTruncatedTitle] = useState(title);
  const [truncatedArtists, setTruncatedArtists] = useState<string[]>(artists);
  const [cutoffLength, setCutoffLength] = useState(30);
  useEffect(() => {
    if (title.length > cutoffLength) {
      setTruncatedTitle(`${title.slice(0, cutoffLength)}...`);
    }

    if (artists.length > cutoffLength) {
      setTruncatedArtists(artists.slice(0, cutoffLength));
    }

  }, [title, artists, cutoffLength]);

  useEffect(() => {
    function updateCutoffLength() {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 768) {
        setCutoffLength(12);
      } else if (screenWidth <= 1024) {
        setCutoffLength(18);
      } else {
        setCutoffLength(30);
      }
    }

    updateCutoffLength();
    window.addEventListener("resize", updateCutoffLength);
    return () => {
      window.removeEventListener("resize", updateCutoffLength);
    };
  }, []);

  return (
    <Link href={`/song?song_id=${id}`}>
      <div className="flex items-center rounded-lg box-border h-32 w-[20rem] sm:w-[35rem] md:w-[39rem] lg:w-[60rem] bg-accent">
        <img
          src={image}
          alt={title}
          className="drop-shadow-[0_2px_40px_rgba(0,0,0,255)] ml-[0.5rem] rounded-lg w-[7rem]"
        />

        <div className="ml-4">
          <h1 className="drop-shadow-[0_2px_40px_rgba(255,255,255,255)] mb-[2%] font-poppins text-2xl font-semibold text-white">
            {truncatedTitle}
          </h1>
          <p className="text-white text-lg font-poppins font-regular">
          {truncatedArtists}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default SongResult;
