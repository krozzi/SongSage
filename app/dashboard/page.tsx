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



  function authorizeSpotify() {
    const scopes = ["user-read-private", "user-read-email", "user-top-read"];

    const queryParams = {
      client_id: CLIENT_ID,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
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

          const profileResponse = await fetch("https://api.spotify.com/v1/me", {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          const profileData = await profileResponse.json();
          setProfileData(profileData);


          try {
            const topTracks = await fetch(
              "https://api.spotify.com/v1/me/top/tracks?limit=5",
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              }
            );
            const userTopTracks = await topTracks.json();
            
            if (userTopTracks.items === undefined || userTopTracks.items.length === 0) {
              console.log("User top tracks are undefined or empty. Redirecting back to authorization screen.");
              authorizeSpotify();
            }
            setTopTracks(userTopTracks.items);
            console.log(userTopTracks.items);
            setLoading(false);

          } catch(e) {
            console.error(e);
          } 


        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      }
    }


    if (!code) {
      authorizeSpotify();
    } else {
      getAccessToken();
    }
  }, [code]);


  return (
    <div>
      <h1>blud u have been successfully authorized </h1>
      <h1>here is thou authorization code: {code}</h1>
      <h1>
        blud here is ur access token please work ive tried this liek 200 times{" "}
        {accessToken}
      </h1>
      <h1>your name is: {profileData.display_name}</h1>
        <div>
        {/* ... */}
        {loading ? (
          <p>Loading top tracks...</p>
        ) : (
          <ul>
            {topTracks.map((track) => (
              <li key={track.id}>
                <Song
                  title={track.name}
                  artists={track.artists}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}