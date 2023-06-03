"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Song from "../../components/Song";

import { useRouter, useSearchParams } from "next/navigation";

interface Song {
  name: string;
  artists: string[];
  image: string;
}

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

export default async function SongPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("song_id");
  const token = localStorage.getItem("accessToken");
  console.log(id);
  console.log(token);

  var displaySong: Song = {
    name: "",
    artists: [],
    image: "",
  };

  var recommendeds: Song[] = [];

  if (id && token) {
    const sog = await getSong(id, token);
    displaySong = {
      name: sog.name,
      artists: sog.artists.map((art: any) => art.name),
      image: sog.album.images[0].url,
    };
    console.log(displaySong);

    const recs = await getRecs(id, token);
    console.log(recs);
    recs.tracks.map((track: any) => {
      const thing: Song = {
        name: track.name,
        artists: track.artists,
        image: track.album.images[0].url,
      };
      recommendeds.push(thing);
    });
    console.log(recommendeds);
  }

  return (
    <>
      <div className="flex lg:flex-row md:flex-row flex-col pt-11 pl-12 pb-7 border-b-4 border-accent">
        <div>
          <img
            src={displaySong.image}
            className=" lg:w-96 lg:h-96 pl-20 pt-20 md:w-80 md:h-80 w-64 h-64 rounded-lg"
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
      <div>
        <h1>test 2</h1>
      </div>
    </>
  );
}
