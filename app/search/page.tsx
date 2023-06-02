'use client'

import Link from "next/link";
import {useEffect, useState, ChangeEvent} from "react";
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

      const router = useRouter();
      const accessToken = localStorage.getItem("accessToken");

      function authorizeSpotify(redirect:string) {
        const scopes = ["user-read-private", "user-read-email", "user-top-read"];
    
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
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchText)}&type=track`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
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
        
        const isSignedIn = !!accessToken;
        if (!isSignedIn) {
          console.log("User not signed in, redirecting to authorization page...");
          authorizeSpotify("http://localhost:3000/search");
        }
      }, []);

      const handleSearch = () => {
        console.log(searchText);
      };
      const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
        console.log(performSearch(event.target.value));
        
      };

      return (
        <div className="hero h-screen no-scrollbar">
              
            
          <div className="mb-[60rem]">

              <h1 className="pt-32 pb-16 text-center font-poppins text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">Discover </span>
                new songs
              </h1>


              <div className="input-group flex justify-center">
                  <input
                      type="text"
                      placeholder="Type song name here"
                      className="input join-item input-lg input-bordered lg:w-[50rem] md:w-[30rem]"
                      value={searchText}
                      onChange={handleChange}
                    />
                  <button onClick={handleSearch} className="drop-shadow-[0_4px_145px_rgba(29,185,84,255)] btn join-item btn-lg btn-accent font-poppins text-white normal-case text-xl">
                    Search
                  </button> 
              </div>
              
          </div>


          <div style={{ maxHeight: "500px"}}>
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