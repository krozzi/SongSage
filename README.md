# SongSage (previously SpotiPal)

A very bad spotify song recommender built by two highschool freshmen.

Get personalized song recommendations in seconds. This project uses NextJS, TailwindCSS, DaisyUI, and the Spotify API.

![image](https://github.com/krozzi/SpotiPal/assets/107476445/1da8c59a-b4aa-4614-880a-79dfe8293e0c)

See below for contributing, go down further for images.

# Contributing
To contribute, simply clone this repository and run 
```cmd
npm i
```
in the desired directory. To install the necessary packages. You will need a Spotify developer app with the Redirect URIs listed below:
```
some base url/dashboard
some base url/search
```
an example would be something like this:
```
http://localhost:3000/dashboard
http://localhost:3000/search
```
An account can be created ![here](https://developer.spotify.com/) at the official Spotify developer page. 
(Dashboard > Create App > Settings > Redirect URIs)

You will need to create a local env file (`env.local`) with your client secret and redirect URI base formatted like this 
```env
NEXT_PUBLIC_SPOTIPAL_CLIENT_SECRET="your client secret here"
NEXT_PUBLIC_SPOTIPAL_BASE_URL="base url without trailing forward slash"
```
To run/test the program, simply run 
```
npm run dev
```

# Showcase
## Dashboard
See your favorite songs and find new ones with a single click 

![image](https://cdn.discordapp.com/attachments/1035705871344341013/1113684249153916968/image.png)

## Search and Discover
Search and find new songs within seconds with our simple UI

![image](https://github.com/krozzi/SpotiPal/assets/107476445/c1d03c47-ec99-4cd4-8c84-b142b141340d)

# TODO
- Taste profile thing, probably gonna look something like this
![image](https://github.com/krozzi/SpotiPal/assets/107476445/85e08f3e-1dd5-4a6c-8ccb-cfd036c57638)

# About
This is a project that (mostly) me and my friend have been working on for like a week as of now (6/2/23)

![image](https://github.com/krozzi/SpotiPal/assets/107476445/7cfeb66a-acff-4b50-9891-1d40348800df)

# Privacy
Regarding connecting your Spotify account to this service, we can't see any of your personal information.
This is the extent to which we can see user data:

![image](https://github.com/krozzi/SpotiPal/assets/107476445/e7a99e49-b5ee-4276-96be-e305cb4401d5)

# License
This project uses the GNU General Public License v3.0 License.
