import Link from "next/link";
import Image from "next/image";

interface SongProps {
  title: string;
  artists: any[];
  image: string;
}

function Song({ title, artists, image }: SongProps) {
  return (
    <div className="my-4 py-4">
      <div className="font-semibold text-xl font-poppins">{title}</div>
      <div className="font-regular text-lg italic pb-3 font-poppins">
        {artists.map((artist) => artist.name).join(", ")}
      </div>
        <Image src={image} width={400} height={400} alt="help"/>
    </div>
  );
}

export default Song;
