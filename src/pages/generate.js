import { Box, Button, Heading, Stack, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { loadFont } from "@remotion/google-fonts/TitanOne";
const { fontFamily } = loadFont();
import { useTts } from 'tts-react'

import { Player } from "@remotion/player";
import { RenderLoading, RenderPoster } from "@/app/components/RenderAssets";
// import dummySubtitles from "@/app/data/sentences";
// import {Subtitle} from "@/remotion/Composition";

const getDuration = (subtitles) => {
  const sortedSubtitles = subtitles.sort((a, b) => a?.start - b?.start);
  console.log('sortedSubtitles', sortedSubtitles);
  const longestSubtitle = sortedSubtitles[sortedSubtitles?.length - 1];
  console.log('duration', longestSubtitle, longestSubtitle?.start + longestSubtitle?.durationInFrames)
  return longestSubtitle?.start + longestSubtitle?.durationInFrames;
}
// const dummySentences = [
//     {
//         "id": 1,
//         "start": 0,
//         "durationInFrames": 90,
//         "text": "The shortest war lasted 38 minutes",
//         "imageDescription": "Clock"
//     },
//     {
//         "id": 2,
//         "start": 90,
//         "durationInFrames": 90,
//         "text": "The world’s largest snowflake was 15 inches wide",
//         "imageDescription": "Snowflake"
//     },
//     {
//         "id": 3,
//         "start": 180,
//         "durationInFrames": 90,
//         "text": "A cockroach can live for several weeks without its head",
//         "imageDescription": "Cockroach"
//     },
//     {
//         "id": 4,
//         "start": 270,
//         "durationInFrames": 90,
//         "text": "The longest wedding veil was longer than 63 football fields",
//         "imageDescription": "Wedding veil"
//     },
//     {
//         "id": 5,
//         "start": 360,
//         "durationInFrames": 90,
//         "text": "The first oranges weren't actually orange",
//         "imageDescription": "Orange"
//     }
// ]

const GenerateVideo = () => {
  // video topic state
  const [videoTopic, setVideoTopic] = useState("cool travel destinations");
  const [sentences, setSentences] = useState([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showImagePlayer, setShowImagePlayer] = useState(false);
  const [subtitles, setSubtitles] = useState([]);
  const [totalDurationInFrames, setTotalDurationInFrames] = useState(0);

  const [videoType, setVideoType] = useState('');

  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);

  const generateScript = async () => {
    console.log('Generating script...');
    const res = await fetch(`/api/getSentences?topic=${videoTopic}`);
    const data = await res.json();

    const result = JSON.parse(data?.sentences)
    console.log('generated script', result);
    setSentences(result?.sentences);
    setTotalDurationInFrames(result?.totalDurationInFrames);

    if(videoType === 'video') {
      await generateVideos(result?.sentences);
    }
    else if(videoType === 'image') {
      await generateImages(result?.sentences);
    }
  }

  const generateVideos = async (SENTENCES) => {
    console.log('Generating images...', SENTENCES);

    try {
      // call Pexels API for each sentence 
      let newSentences = []
      SENTENCES?.map(async (sentence) => {
        const res = await fetch(`https://api.pexels.com/videos/search?query=${sentence?.imageDescription}&per_page=1&orientation=landscape&size=medium`, {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY
          }
        });
        const data = await res.json();
        console.log(data?.videos[0]);

        newSentences.push({
              ...sentence,
              video: data?.videos[0]
            }
        );

        
      })

      console.log('newSentences', newSentences);

      const sortedSentences = newSentences.sort((a, b) => a.start - b.start);

      console.log('sortedSentences', sortedSentences);
      setSubtitles(sortedSentences);
      setShowImagePlayer(false);
      setLoadingVideo(false)
      setShowPlayer(true);
  
    }
    catch (e) {
      console.error(e);
    }
  }

  const generateImages = async (SENTENCES) => {
    console.log('Generating images...', SENTENCES);

    try {
      // call Pexels API for each sentence 
      let newSentences = []

      SENTENCES.map(async (sentence) => {
        const res = await fetch(`https://api.pexels.com/v1/search?query=${sentence?.imageDescription}&per_page=1&orientation=landscape&size=medium`, {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY
          }
        });
        const data = await res.json();
        console.log(data?.photos[0]);

        newSentences.push({
              ...sentence,
              // video: data?.videos[0]
              photo: data?.photos[0]
            }
        );
      })



      console.log('newSentences', newSentences);

      const sortedSentences = newSentences.sort((a, b) => a.start - b.start);

      console.log('sortedSentences', sortedSentences);
      
      setSubtitles(sortedSentences);
      setShowPlayer(false);
      setLoadingImage(false)
      setShowImagePlayer(true);

    }
    catch (e) {
      console.error(e);
    }
  }

  // generate video function
  const generateVideo = async () => {
    // TODO:
    // 1. Write a script to generate a video based on the video topic with OpenAI's API for a 30 seconds video with 10 sentences. Return a JSON object with the sentences in order with the following properties: id, start, duration, text.
    // 2. For each sentence, find an appropriate image from Unsplash's API. Return a JSON object with the sentences in order with the following properties: id, start, duration, text, image.
    // 3. Map the JSON object and return a Sequence for each sentence with the Subtitle component and the Image component.
    
    await generateScript();
    // await generateImages();
    
    // if(sentences?.length > 0) setShowPlayer(true);

  }

  useEffect(() => {
    console.log('subtitles Updated', subtitles, subtitles?.length, subtitles[0]?.video?.duration);

    // if(subtitles[0]?.video?.duration) {
    //   console.log('Debug subtitles with Videos', subtitles);
    //   console.log('showing player...');

    //   setShowPlayer(true);
    // }
  }, [subtitles]);

  useEffect(() => {
    if(videoType==='video') {
      setLoadingImage(false);
      setLoadingVideo(true);
      generateVideo();
    } else if(videoType==='image') {
      setLoadingVideo(false);
      setLoadingImage(true);
      generateVideo();
    }
  }, [videoType]);



    return (
        <div>
            <Heading textAlign={'center'} as="h1" size="2xl" mb="10" mt="10"
            >Generate Video</Heading>

            <Stack spacing={3} w="lg" ml="auto" mr="auto">
            {/* text input for Video Topic with Chakra UI */}
            <Textarea placeholder="Video Topic" size="lg" onChange={(e) => setVideoTopic(e?.target?.value)} value={videoTopic} />

            {/* button to generate video */}
            <Button
                w='lg'
                mt='10'
                ml='auto'
                mr='auto'
                colorScheme="teal"
                onClick={() => {
                  setVideoType('image');
                }}
            >{loadingImage ? 'Generating with Images...' : 'Generate with Images'}</Button>
            <Button
                w='lg'
                mt='10'
                ml='auto'
                mr='auto'
                colorScheme="teal"
                onClick={() => {
                  setVideoType('video');
                }}
            >{loadingVideo ? 'Generating with Videos...' : 'Generate with Videos'}</Button>
            </Stack>

            <Box className="video-container" w="80%" mr="auto" ml="auto" mt="10"
            style={{position: 'relative'}}>
            {
              showPlayer ? (
                <Box className="video-container" w="lg" style={{position: 'relative'}}>
                <Player
                  component={GenerateSequence}
                  inputProps={{ sentences: subtitles, totalDurationInFrames, type: 'video' }}
                  durationInFrames={totalDurationInFrames}
                  fps={60}
                  controls
                  compositionWidth={1100}
                  compositionHeight={620}

                />
                </Box>
              )
              :
              ''
            }

            {
              showImagePlayer ? (
                <Box className="video-container" w="lg" style={{position: 'relative'}}>
                <Player
                  component={GenerateSequence}
                  inputProps={{ sentences: subtitles, totalDurationInFrames, type: 'photo' }}
                  durationInFrames={totalDurationInFrames}
                  fps={60}
                  controls
                  compositionWidth={1100}
                  compositionHeight={720}

                />
              </Box>
              )
              :
              ''
            }

            </Box>

            {/* {dummySubtitles?.length ?
              <Box className="video-container" style={{position: 'relative', height: '100vh', width: '100vw'}}>
              <Player
                component={GenerateSequence}
                inputProps={{ sentences: dummySubtitles }}
                durationInFrames={getDuration(dummySubtitles)}
                fps={30}
                controls
                compositionWidth={1200}
                compositionHeight={720}

              />
              </Box>
              : ''
            } */}

        </div>
    );
}

const GenerateSequence = ({sentences, totalDurationInFrames, type}) => {
  const sortedSentences = sentences?.sort((a, b) => a?.start - b?.start);
  const frame = useCurrentFrame();

  useEffect(() => {
    console.log('Here', sentences);
  }, [sentences]);

  return (
    <>
    {
      sortedSentences?.length && sortedSentences?.map((sentence) => {
      return (
        <Box key={sentence?.id}>
        <Sequence from={sentence?.start} duration={type === 'video' ? sentence?.video?.durationInFrames : sentence?.photo?.durationInFrames}>
          <Box className="video" mt='0' mb='0'>
            {
              type === 'video' ? (
                <Video src={sentence?.video?.video_files[0]?.link} 
                style={{ width: '100%', height: '100%' }} 
                />
              ) : (
                <Img src={sentence?.photo?.src?.landscape} 
                  style={{ width: '100%', height: '100%' }}
                />
              )
            }
          </Box>
        </Sequence>
        <Sequence from={sentence?.start + 20} duration={type === 'video' ? sentence?.video?.durationInFrames - 40 : sentence?.photo?.durationInFrames - 40}>
          <CustomTTSComponent highlight durationInFrames={type === 'video' ? sentence?.video?.durationInFrames - 40 : sentence?.photo?.durationInFrames - 40}>
            {sentence?.text}
          </CustomTTSComponent>
        </Sequence>
        <Sequence from={0} duration={totalDurationInFrames}>
          <AbsoluteFill>
            <Audio src={"https://dl.espressif.com/dl/audio/ff-16b-2c-44100hz.mp3"} 
            volume={(f) =>
              interpolate(f, [0, 30], [0, 1], { extrapolateLeft: "clamp" })
            }
            muted={frame >= totalDurationInFrames - 60 }
            // loop
            />
          </AbsoluteFill>
        </Sequence>
        </Box>
      )
    })
    }
    </>
  )
  }

const CustomTTSComponent = ({ children, durationInFrames, highlight = false }) => {
  const { ttsChildren, state, play, stop, pause } = useTts({
    children,
    markTextAsSpoken: highlight
  })

  const frame = useCurrentFrame();
  const fps = useVideoConfig()?.fps;

  const opacity = interpolate(frame, [0, 30], [0, 1])
  const translate = spring({ frame, fps, from: 0, to: 100 })

  return (
    <Heading style={{
                position: 'absolute',
                width: '100%',
                textAlign: 'center',
                opacity,
                top: '50%',
                color: 'yellow',
                fontFamily: fontFamily,
                fontSize: '2rem',
                transform: `translateY(-${translate}px)`
          }}>
      {ttsChildren}
    </Heading>
  )
}

export default GenerateVideo;

