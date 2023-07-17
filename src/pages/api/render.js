import fs from "fs";
import subtitles from "@/data/subtitles";
import { bundle } from "@remotion/bundler";
import { getCompositions } from "@remotion/renderer";
import path from "path";
import { getFunctions, getRenderProgress, renderMediaOnLambda } from "@remotion/lambda";

// next js api routes
export default async function handler(req, res) {

  if(req.method === 'POST') {
    // get the sentences, totalDurationInFrames, type from the query
    const { sentences, totalDurationInFrames, type } = req.body;
    console.log('sentences', sentences);
    console.log('totalDurationInFrames', totalDurationInFrames);
    console.log('type', type);
    
    await renderVideo(sentences, totalDurationInFrames, type, res);
      // const outputLocation = await start(sentences, totalDurationInFrames, type);
  
      // read the video file from the output location
      // const filepath = path.resolve(outputLocation);
      // const videoBuffer = fs.readFileSync(filepath);
      
      // serve the video
      // res.setHeader("Content-Type", "video/mp4");
      // res.setHeader("Content-Length", videoBuffer.length);
      res.status(200).json({message: 'processed'});
  }
  
}

// remotion code
const start = async (sentences, totalDurationInFrames, type) => {
  // The composition you want to render
  const compositionId = "Videogpt";

  // You only have to do this once, you can reuse the bundle.
  console.log("Creating a Webpack bundle of the video");
  const entry = "./src/remotion/index.js";
  const bundleLocation = await bundle(path.resolve(entry), () => undefined, {
    // If you have a Webpack override, make sure to add it here
    webpackOverride: (config) => config,
  });

  // Parametrize the video by passing arbitrary props to your component.
  const inputProps = {
    sentences: sentences,
    totalDurationInFrames: totalDurationInFrames,
    type: type,
  };

  console.log("inputProps", inputProps);

  try {
  // Extract all the compositions you have defined in your project
  // from the webpack bundle.
  const comps = await getCompositions(bundleLocation, {
    // You can pass custom input props that you can retrieve using getInputProps()
    // in the composition list. Use this if you want to dynamically set the duration or
    // dimensions of the video.
    defaultProps: inputProps,
  });

  console.log("Available compositions:", comps);

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

} catch (e) {
  console.error(e);
}
};

// overcome response size limit
export const config = {
  api: {
    responseLimit: false,
  },
}


// render on lambda
const renderVideo = async (sentences, totalDurationInFrames, type, res) => {

  const functions = await getFunctions({
    region: "us-east-1",
    compatibleOnly: true,
  });
 
  const functionName = functions[0].functionName;

  const url = "https://remotionlambda-useast1-s2a7hdvpb6.s3.us-east-1.amazonaws.com/sites/tiktok-gpt/index.html"

  const { renderId, bucketName } = await renderMediaOnLambda({
    region: "us-east-1",
    functionName,
    serveUrl: url,
    composition: "Videogpt",
    inputProps: {sentences, totalDurationInFrames, type},
    codec: "h264",
    // imageFormat: "jpeg",
    maxRetries: 1,
    framesPerLambda: 20,
    privacy: "public",
  });

  console.log("Render ID:", renderId);
  console.log("Bucket name:", bucketName);

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const progress = await getRenderProgress({
      renderId,
      bucketName,
      functionName,
      region: "us-east-1",
    });
    if (progress.done) {
      console.log("Render finished!", progress.outputFile);
      res.status(200).json({message: 'Render finished!', outputFile: progress.outputFile});
      process.exit(0);
    }
    if (progress.fatalErrorEncountered) {
      console.error("Error enountered", progress.errors);
      res.status(500).json({message: 'error', error: progress.errors});
      process.exit(1);
    }
  }

  }
