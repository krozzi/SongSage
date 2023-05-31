import Link from "next/link";
import Image from "next/image";

interface SongProps {
  title: string;
  artists: any[];
  image: string;
}

function Song({ title, artists, image }: SongProps) {
  return (

    <div className="card w-96 bg-base-100 shadow-xl font-poppins">
    <figure><img src={image} alt={title} /></figure>
    <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="font-regular text-lg italic pb-3 font-poppins">
        {artists.map((artist) => artist.name).join(", ")}
       </p>
        <div className="card-actions justify-end">
        <button className="btn btn-primary">View Song</button>
        </div>
    </div>
    </div>
  );
}

export default Song;
