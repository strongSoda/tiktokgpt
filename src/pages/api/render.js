import fs from "fs";
import subtitles from "@/data/subtitles";
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";
import path from "path";

// next js api routes

export default async function handler(req, res) {
    const outputLocation = await start();

    const filepath = path.resolve(outputLocation);
    const videoBuffer = fs.readFileSync(filepath);
    
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Length", videoBuffer.length);
    res.status(200).send(videoBuffer);
}


const start = async () => {
  // The composition you want to render
  const compositionId = "Video";

  // You only have to do this once, you can reuse the bundle.
  console.log("Creating a Webpack bundle of the video");
  const entry = "../../remotion/index.js";
  const bundleLocation = await bundle(path.resolve(entry), () => undefined, {
    // If you have a Webpack override, make sure to add it here
    webpackOverride: (config) => config,
  });

  // Parametrize the video by passing arbitrary props to your component.
  const inputProps = {
    subtitles: subtitles
  };

  // Extract all the compositions you have defined in your project
  // from the webpack bundle.
  const comps = await getCompositions(bundleLocation, {
    // You can pass custom input props that you can retrieve using getInputProps()
    // in the composition list. Use this if you want to dynamically set the duration or
    // dimensions of the video.
    inputProps,
  });

  // Select the composition you want to render.
  const composition = comps.find((c) => c.id === compositionId);

  // Ensure the composition exists
  if (!composition) {
    throw new Error(`No composition with the ID ${compositionId} found.
  Review "${entry}" for the correct ID.`);
  }

  const outputLocation = `out/${compositionId}.mp4`;
  console.log("Attempting to render:", outputLocation);
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation,
    inputProps,
    timeoutInMilliseconds: 1000 * 60 * 60,
  });

  console.log("Render done!", outputLocation);
  // use this to serve the video
  return outputLocation;
};

export const config = {
  api: {
    responseLimit: false,
  },
}