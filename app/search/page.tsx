"use client";

import Link from "next/link";
import { useEffect, useState, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Dashboard from "../dashboard/page";
import SongResult from "@/components/SongResult";
import querystring from "querystring";

const CLIENT_ID = "75f36cadd43b47a4bc810fd77f5cc67d";
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIPAL_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/dashboard";

export default function Search() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [access_token, setAccessToken] = useState("");
  const router = useRouter();

  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  function authorizeSpotify(redirect: string) {
    const scopes = [
      "user-read-private",
      "user-read-email",
      "user-top-read",
      "playlist-read-private",
    ];

    const queryParams = {
      client_id: CLIENT_ID,
      response_type: "code",
      redirect_uri: redirect,
      scope: scopes.join(" "),
    };

    const authorizationUrl = `https://accounts.spotify.com/authorize?${querystring.stringify(
      queryParams
    )}`;

    router.push(authorizationUrl);
  }

  interface TrackResult {
    name: string;
    artists: string[];
    coverUrl: string;
  }

  const performSearch = async (searchText: string) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchText
        )}&type=track`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();
      const searchResults = data.tracks.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        artists: item.artists.map((artist: any) => artist.name).join(", "),
        coverUrl: item.album.images[0].url,
      }));
      setSearchResults(searchResults);
    } catch (error) {
      console.error("Error performing search:", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    async function getAccessToken() {
      if (CLIENT_SECRET) {
        try {
          const response = await fetch(
            "https://accounts.spotify.com/api/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                grant_type: "authorization_code",
                code: code?.toString() ?? "",
                redirect_uri: "http://localhost:3000/search",
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
              }).toString(),
            }
          );

          if (response.status !== 200) {
            console.log("User token expired... reauthing...");
            authorizeSpotify("http://localhost:3000/search");
          }

          const data = await response.json();
          const { access_token } = data;
          setAccessToken(access_token);

          localStorage.setItem("accessToken", access_token);

          return access_token;
        } catch (error) {
          console.error(error);
          console.log("User token expired... reauthing...");
          authorizeSpotify("http://localhost:3000/search");
        }
      }
    }

    if (code) {
      getAccessToken();
    } else {
      console.log("User not signed in, redirecting to authorization page...");
      authorizeSpotify("http://localhost:3000/search");
    }
  }, []);

  const handleSearch = () => {
    console.log(searchText);
    console.log(performSearch(searchText));
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    console.log(performSearch(event.target.value));
  };

  return (
    <div className="hero h-screen no-scrollbar">
      <div className="mb-[60rem]">


        <h1 className="pt-32 lg:pb-16 pb-8 text-center font-poppins px-4 lg:px-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">
            Discover{" "}
          </span>
          new songs
        </h1>

        <div className="input-group flex justify-center">
          <input
            type="text"
            placeholder="Find similar songs"
            className="input join-item input-lg input-bordered w-[15rem] xs:w-[10rem] sm:w-[30rem] lg:w-[50rem] md:w-[30rem] font-poppins"
            value={searchText}
            onChange={handleChange}
          />
          <button
            onClick={handleSearch}
            className="drop-shadow-[0_4px_145px_rgba(29,185,84,255)] btn join-item xs:btn-square sm:btn-square btn-lg btn-accent font-poppins text-white normal-case text-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 30 30" width="32px" height=""><path d="M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z"/></svg>
          </button>
        </div>
      </div>

      <div style={{ maxHeight: "500px" }}>
        <ul>
          {searchResults.map((result, index) => (
            <li key={index} className="py-2">
              <SongResult
                title={result.name}
                artists={result.artists}
                image={result.coverUrl}
                id={result.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
