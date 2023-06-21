import { Button, Heading, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { loadFont } from "@remotion/google-fonts/TitanOne";
const { fontFamily } = loadFont();

import { Player } from "@remotion/player";


const GenerateVideo = () => {
  // video topic state
  const [videoTopic, setVideoTopic] = useState("");
  const [sentences, setSentences] = useState([]);
  const [showPlayer, setShowPlayer] = useState(false);

  const generateScript = async () => {
    console.log('Generating script...');
    const res = await fetch(`/api/getSentences?topic=${videoTopic}`);
    const data = await res.json();
    console.log(JSON.parse(data?.sentences));
    setSentences(JSON.parse(data?.sentences));
  }

  const generateImages = async () => {
    console.log('Generating images...');
    // call Pexels API for each sentence 
    sentences?.map(async (sentence) => {
      const res = await fetch(`https://api.pexels.com/videos/search?query=${sentence?.imageDescription}&per_page=1`, {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY
        }
      });
      const data = await res.json();
      console.log(data);
      setSentences((prev) => [...prev, { ...sentence, video: data?.videos[0] }]);
    })
  }

  // generate video function
  const generateVideo = async () => {
    // TODO:
    // 1. Write a script to generate a video based on the video topic with OpenAI's API for a 30 seconds video with 10 sentences. Return a JSON object with the sentences in order with the following properties: id, start, duration, text.
    // 2. For each sentence, find an appropriate image from Unsplash's API. Return a JSON object with the sentences in order with the following properties: id, start, duration, text, image.
    // 3. Map the JSON object and return a Sequence for each sentence with the Subtitle component and the Image component.
  
    await generateScript();
    await generateImages();
    
    if(sentences?.length > 0) setShowPlayer(true);

  }

  useEffect(() => {
    console.log(sentences);
  }, [sentences]);


    return (
        <div>
            <Heading>Generate Video</Heading>

            {/* text input for Video Topic with Chakra UI */}
            <Textarea placeholder="Video Topic" size="lg" onChange={(e) => setVideoTopic(e?.target?.value)} />

            {/* button to generate video */}
            <Button
                w='lg'
                mt='10'
                ml='auto'
                mr='auto'
                colorScheme="teal"
                onClick={generateVideo}
            >Generate Video</Button>

            {
              showPlayer && (
                <Player
                  component={GenerateSequence}
                  durationInFrames={1200}
                  fps={30}
                  controls

                />
              )
            }

        </div>
    );
}

const GenerateSequence = (sentences) => {

  return (
    <>
    {
      sentences?.map((sentence) => {
      return (
        <Sequence key={sentence?.id} from={sentence?.start} duration={sentence?.video?.duration}>
          <Video src={sentence?.video?.url} style={{ width: sentence?.video?.width, height: sentence?.video?.height }} />
          <Subtitle>{sentence?.text}</Subtitle>
        </Sequence>
      )
    })
    }
    </>
  )
  }

export default GenerateVideo;
