'use client'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Song from "../../components/Song";

interface ISong {
  name: string;
  artists: string[];
  image: string;
  id: string;
  link: string;
}

export default function SongPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("song_id");

  const [displaySong, setDisplaySong] = useState<ISong>({
    name: "",
    artists: [],
    image: "",
    id: "",
    link: "",
  });
  const [recommendeds, setRecommendeds] = useState<ISong[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getSong(query: string, token: string) {
      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      return response.json();
    }

    async function getRecs(query: string, token: string) {
      const res = await fetch(
        `https://api.spotify.com/v1/recommendations?limit=15&seed_tracks=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Recommendations returned status code " + res);
      }

      return res.json();
    }

    async function fetchData() {
      const token = localStorage.getItem("accessToken");
      console.log(id);
      console.log(token);

      if (id && token) {
        try {
          const songResponse = await getSong(id, token);
          const recsResponse = await getRecs(id, token);

          const song: ISong = {
            name: songResponse.name,
            artists: songResponse.artists.map((art: any) => art.name),
            image: songResponse.album.images[0].url,
            id: songResponse.id,
            link: songResponse.external_urls.spotify,
          };

          const recs: ISong[] = recsResponse.tracks.map((track: any) => ({
            name: track.name,
            artists: track.artists,
            image: track.album.images[0].url,
            id: track.id,
            link: track.external_urls.spotify,
          }));
          
          
          setDisplaySong(song);
          setRecommendeds(recs);
          console.log(recs);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
      }
    }

    fetchData();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
<div className="bg-zinc-900">
  <section className="pt-[7rem] md:pt-[7rem] lg:pt-[10rem] lg:pl-[10rem] lg:flex lg:items-center font-poppins">
    <div className="rounded-6xl flex justify-center items-center">
      <img src={displaySong.image} className="drop-shadow-[0_0px_20px_rgba(15,15,15,1)] lg:mb-20 mb-5 rounded-xl lg:w-[25rem] md:w-[25rem] w-[20rem] min-w-[20rem]"/>
    </div>

    <div className="text-white px-6 flex flex-col justify-center mt-5 text-center lg:text-left lg:mt-0 md:ml-[0] lg:ml-[3rem]">
      <h1 className="font-semibold text-3xl md:text-4xl lg:text-5xl pb-5">{displaySong.name}</h1>
      <p className="font-regular italic text-xl md:text-3xl lg:text-4xl pb-10">{displaySong.artists.join(", ")}</p>
    </div>
  </section>
  <section className="font-poppins">
    <h1 className="text-5xl font-semibold lg:pl-10 pb-9 text-center lg:text-left">
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">Similar </span> songs
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400"> you </span> 
      might enjoy
    </h1>

    <div className="overflow-x-auto">
      <div className="lg:pl-10 flex flex-nowrap gap-10">
        {recommendeds.map((song, index) => (
            <Song
            title={song.name}
            artists={song.artists}
            image={song.image}
            link={song.link}
            />
        ))}
    </div>

</div>



  </section>



    

</div>

      // <div>
      //   <section className="bg-gradient-to-r from-accent to-cyan-400 border-b-4 border-accent pt-[7rem] md:pt-[7rem] lg:pt-[10rem] lg:pl-[10rem] lg:flex lg:items-center font-poppins">

      //     <div className="rounded-lg flex justify-center items-center">
      //       <img src={displaySong.image} className="drop-shadow-[0_0px_20px_rgba(255,255,255,1)] lg:mb-10 mb-5 rounded-lg lg:w-[25rem] md:w-[25rem] w-[20rem]"/>
      //     </div>

      //     <div className="text-white px-6 flex flex-col justify-center mt-5 text-center lg:text-left lg:mt-0 md:ml-[0] lg:ml-[5rem]">
      //       <h1 className="font-semibold text-5xl lg:text-6xl pb-5">{displaySong.name}</h1>
      //       <p className="font-regular italic text-3xl lg:text-4xl pb-10">{displaySong.artists.join(", ")}</p>
      //     </div>

      //   </section>

      // </div>

    // <div>
    //   <div className="flex lg:flex-row md:flex-row flex-col pt-11 pl-12 pb-7 border-b-4 border-accent">
    //     <div className="aspect-w-1 aspect-h-1 lg:w-96 lg:h-96 ml-[5rem] mt-[5rem] md:w-80 md:h-80 w-64 h-64 rounded-lg overflow-hidden">
    //       <img src={displaySong.image} className="object-cover w-full h-full" alt="Song Cover" />
    //     </div>

    //     <div>
    //       <h1 className="lg:pt-56 md:pt-48 pt-12 pl-12 text-white font-poppins font-bold lg:text-5xl md:text-3xl text-3xl">
    //         {displaySong.name}
    //       </h1>
    //       <p className="text-xl italic pb-3 font-poppins pl-10 pt-3">
    //         {displaySong.artists.join(", ")}
    //       </p>
    //     </div>
    //   </div>

    //   <div className="">
    //     {recommendeds.map((song, index) => (
    //       <div key={index}>
    //         <h2>{song.name}</h2>
    //         <p>{song.artists.join(", ")}</p>
    //         <img src={song.image} alt="Recommended Song Cover" />
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
}
