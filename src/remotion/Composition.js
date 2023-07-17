import { AbsoluteFill, Audio, Img, interpolate, prefetch, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { Heading, Box } from '@chakra-ui/react'
import subtitles from "../data/subtitles";

import { loadFont } from "@remotion/google-fonts/TitanOne";
const { fontFamily } = loadFont();
import { useTts } from 'tts-react'
import { useEffect } from "react";

export const MyComposition = ({}) => {
    const {fps, durationInFrames} = useVideoConfig();

    return (
        <>
        <Sequence from={0} durationInFrames={durationInFrames}>
            <Box className="video" w='lg' ml='auto' mr='auto' mt='0' mb='0' bg='black' borderWidth='1px' borderRadius='lg'>
                <Video 
                style={{width: '100%', height: '100%'}}
                src={"https://repo.library.stonybrook.edu/xmlui/bitstream/handle/11401/9656/rickroll.mp4?sequence=1&isAllowed=y"} />
            </Box>
        </Sequence> 
        {subtitles?.map((subtitle) => (
            <Sequence key={subtitle?.id} from={subtitle?.start} durationInFrames={subtitle?.duration}>
                <Subtitle text={subtitle?.text} />
            </Sequence>
        ))}
        </>
)};


export const Subtitle = ({text}) => {
    const frame = useCurrentFrame();
    const fps = useVideoConfig()?.fps;

    const opacity = interpolate(frame, [0, 30], [0, 1])
    const translate = spring({ frame, fps, from: 0, to: 100 })

    return (
        <Heading as='h1'
            maxW='100%'
            style={{
                position: 'absolute',
                width: '100%',
                textAlign: 'center',
                opacity,
                top: '50%',
                color: 'white',
                fontFamily: fontFamily,
                fontSize: '2rem',
                transform: `translateY(-${translate}px)`
            }} size='xl' className="subtitle">
                {text}
        </Heading>
    )
}

export const GenerateSequence = ({sentences, totalDurationInFrames, type}) => {
  const frame = useCurrentFrame();
  const sortedSentences = sentences?.sort((a, b) => a?.start - b?.start);

  useEffect(() => {
    console.log('sortedSentences', sortedSentences, 'totalDurationInFrames', totalDurationInFrames, 'type', type)
    }, [])


  return (
    <Box className="video" w='lg' ml='auto' mr='auto' mt='0' mb='0' bg='yellow' borderWidth='1px' borderRadius='lg'>
        {
        sortedSentences?.length && sortedSentences?.map((sentence) => {
        return (
                <>
            <Sequence from={sentence?.start} duration={sentence?.durationInFrames}>
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
            </>
            )
        })
        }

        {
        sortedSentences?.length && sortedSentences?.map((sentence) => {
            return (
                <Sequence id={`Voiceover-${sentence?.id}`} from={sentence?.start} duration={sentence?.durationInFrames}>
                    {
                    frame >= sentence?.start && frame <= sentence?.start + sentence?.durationInFrames &&
                    (
                        <AbsoluteFill>
                        <Audio src={prefetch(sentence?.audioUrl?.split('?')[0])
          .waitUntilDone()
          .then(() => {
            setAudioUrl(sentence?.audioUrl?.split('?')[0]);
          })}
                        volume={(f) =>
                        interpolate(f, [0, 30], [0, 1], { extrapolateLeft: "clamp" })
                        }
                        />
                        </AbsoluteFill>
                    )}
                </Sequence>
            )
        }
        )}


        {
        sortedSentences?.length && sortedSentences?.map((sentence) => {
            return (
                <Sequence id={`Subtitle-${sentence?.id}`} from={sentence?.start} duration={sentence?.durationInFrames}>
                    {
                    frame >= sentence?.start && frame <= sentence?.start + sentence?.durationInFrames &&
                    (
                        <CustomTTSComponent highlight durationInFrames={sentence?.durationInFrames}>
                        {sentence?.text}
                    </CustomTTSComponent>
                    )}
                </Sequence>
            )
        }
        )}


        <Sequence from={0} duration={totalDurationInFrames}>
            <AbsoluteFill>
                <Audio src={"https://jutsupoint-voiceovers.s3.amazonaws.com/revolutionizing-healthcare-with-wearable-tech/section0/paragraph0.wav"} 
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
  }

  export const CustomTTSComponent = ({ children, durationInFrames, highlight = false }) => {
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
