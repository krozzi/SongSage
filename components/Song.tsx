import Link from "next/link";

interface SongProps {
  title: string;
  artists: any[];
}

function Song({ title, artists }: SongProps) {
  return (
    <div className="my-4 py-4">
      <div className="font-semibold text-xl font-poppins">{title}</div>
      <div className="font-regular text-lg italic pb-3 font-poppins">
        {artists.map((artist) => artist.name).join(", ")}
      </div>
    </div>
  );
}

export default Song;
