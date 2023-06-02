"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import querystring from "querystring";
import Song from "../../components/Song";

const CLIENT_ID = "75f36cadd43b47a4bc810fd77f5cc67d";
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIPAL_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/dashboard";

export default function Dashboard() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [accessToken, setAccessToken] = useState("");
  const [profileData, setProfileData] = useState("");
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState<any[]>([]);

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
                redirect_uri: "http://localhost:3000/dashboard",
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
              }).toString(),
            }
          );

          const data = await response.json();
          const { access_token, expires_in, refresh_token } = data;

          setAccessToken(access_token);
          
          localStorage.setItem("accessToken", access_token);

          const profileResponse = await fetch("https://api.spotify.com/v1/me", {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          const profileData = await profileResponse.json();
          setProfileData(profileData);

          try {
            const topTracks = await fetch(
              "https://api.spotify.com/v1/me/top/tracks?limit=10",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              }
            );
            const userTopTracks = await topTracks.json();

            if (
              userTopTracks.items === undefined ||
              userTopTracks.items.length === 0
            ) {
              console.log(
                "User top tracks are undefined or empty. Redirecting back to authorization screen."
              );
              authorizeSpotify(REDIRECT_URI);
            }
            setTopTracks(userTopTracks.items);
            console.log(userTopTracks.items);

            const topIds = userTopTracks.items.map((obj: { id: string }) => obj.id);
            const recommendedTracks = await fetch(
              `https://api.spotify.com/v1/recommendations?limit=15&seed_tracks=${topIds.slice(0, -5).join(",")}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              }
            );
            const userRecommendedTracks = await recommendedTracks.json();

            setRecommended(userRecommendedTracks.tracks);

            setLoading(false);
          } catch (e) {
            console.error(e);
          }
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      }
    }

    if (!code) {
      authorizeSpotify(REDIRECT_URI);
    } else {
      getAccessToken();
    }
  }, [code]);

  return (
    <div className="no-scrollbar">

      <h1 className="pt-32 pb-16 text-center font-poppins text-6xl lg:text-7xl font-bold">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">{profileData.display_name}'s</span> Dashboard
      </h1>

      <h1 className="lg:pl-32 px-16 gap-x-20 pb-16 font-poppins text-5xl font-semibold lg:text-6xl text-center lg:text-left">
        Your {" "}
        <span className=" font-bold text-accent text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">
          Top Ten 
        </span>
        {" "} songs 
      </h1>

      <div>
        {loading ? (
          <p>Loading top tracks...</p>
        ) : (
          <div className="flex flex-wrap justify-evenly gap-x-20 gap-y-32 px-16">
            {topTracks.map((track) => (
              <Song
                title={track.name}
                artists={track.artists}
                image={track.album.images[0].url}
                link={track.external_urls.spotify}
              />
            ))}
            <h1 className="md:pt-0 lg:max-w-xl lg:pl-30 px-16 lg:pt-52 gap-x-20 pb-16 font-poppins text-5xl font-semibold lg:text-6xl text-center lg:text-left">
              Your
              <span className="font-bold text-accent text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400">
                {" "}
                Recommended
              </span>{" "}
              songs
            </h1>
            {recommended.map((track) => (
              <Song
                title={track.name}
                artists={track.artists}
                image={track.album.images[0].url}
                link={track.external_urls.spotify}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
