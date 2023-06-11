# TikTokGPT

This repo contains a sample app for making a video with remotion and rendering it.

## How to run

- Clone the repo `git clone https://github.com/strongSoda/tiktokgpt.git`
- Run `yarn` to install dependencies
- Run `yarn dev` to start the dev server

## How to use

- Go to `localhost:3000`
- See the video
- Click on the `Render Video` button or go to `localhost:3000/api/render` to render the video

## How to run `remotion` server

- Run `yarn video` to start the remotion server

## Core Files

- `remotion/` contains the video Composition files 
    - [src/remotion/Composition.js](src/remotion/Composition.js)
    - [src/remotion/Root.js](src/remotion/Root.js)

- Home page is at [src/pages/index.js](src/pages/index.js)
- Render API is at [src/pages/api/render.js](src/pages/api/render.js)
- The rendered video is placed at [out/video.mp4](out/video.mp4)
- Video subtitles data is at [src/data/subtitles.js](src/data/subtitles.js)


## Tech Used

- Remotion
- Nextjs
- Chakra UI

## Demo

https://tiktokgpt.vercel.app/

> Note: for rendering video in next api route, run locally with instructions above


