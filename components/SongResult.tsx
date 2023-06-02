import Link from "next/link";
import Image from "next/image";

interface SongProps {
  title: string;
  artists: any[];
  image: string;
  id: string;
}

function SongResult({ title, artists, image, id }: SongProps) {
  return (


    <div className="flex items-center rounded-lg box-border h-32 w-[26rem] md:w-[39rem] lg:w-[60rem] bg-accent">

        <img src={image} alt={title} className="drop-shadow-[0_2px_40px_rgba(0,0,0,255)] ml-[0.5rem] rounded-lg w-[7rem] "/>
        {/* <h1 className="drop-shadow-[0_2px_40px_rgba(255,255,255,255)] mb-[5%] mx-4 font-poppins text-2xl font-semibold text-white">{title}</h1> */}
        <div className="ml-4">
    <h1 className="drop-shadow-[0_2px_40px_rgba(255,255,255,255)] mb-[2%] font-poppins text-2xl font-semibold text-white">{title}</h1>
    <p className="text-white text-lg font-space font-semibold">{artists}</p>
  </div>
    </div>

  );
}

export default SongResult;
