"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Song from "../../components/Song";
import { useEffect, useState } from "react";

interface Song {
  name: string;
  artists: any[];
  image: string;
  link: string;
}

async function getSong(query: string, token: string) {
  console.log("not good");
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
  console.log("not good");
  const res = await fetch(
    `https://api.spotify.com/v1/recommendations?limit=15&seed_tracks=${query}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("woopsie");
  }

  return res.json();
}

export default async function SongPage() {
  console.log("render");
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("song_id");
  const token = localStorage.getItem("accessToken");

  console.log(id);
  console.log(token);

  var displaySong: Song = {
    name: "",
    artists: [],
    image: "",
    link: "",
  };

  var recommendeds: any[] = [];

  if (id && token) {
    const sog = await getSong(id, token);
    displaySong = {
      name: sog.name,
      artists: sog.artists.map((art: any) => art.name),
      image: sog.album.images[0].url,
      link: sog.external_urls.spotify,
    };
    console.log(displaySong);

    const recs = await getRecs(id, token);
    console.log(recs);
    recs.tracks.map((track: any) => {
      recommendeds.push(track);
    });
    console.log(recommendeds);
  }

  return (
    <>
      <div className="flex lg:flex-row md:flex-row flex-col pt-11 pl-12 pb-7 border-b-4 border-accent sm:align-middle">
        <div>
          <img
            src={displaySong.image}
            className=" lg:w-96 lg:h-96 pl-20 pt-20 md:w-80 md:h-80 w-64 h-64"
          ></img>
        </div>
        <div>
          <h1 className="lg:pt-56 md:pt-48 pt-12 pl-12 text-white font-poppins font-bold lg:text-5xl md:text-3xl text-3xl">
            {displaySong.name}
          </h1>
          <p className="text-xl italic pb-3 font-poppins pl-10 pt-3">
            {displaySong.artists.join(", ")}
          </p>
        </div>
      </div>
      <div className="flex flex-row basis-96 pt-5">
        {recommendeds.map((track) => (
          <Song
            title={track.name}
            artists={track.artists}
            image={track.album.images[0].url}
            link={track.external_urls.spotify}
          />
        ))}
      </div>
    </>
  );
}
