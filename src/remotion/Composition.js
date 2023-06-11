import { interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { Heading } from '@chakra-ui/react'
import { loadFont } from "@remotion/google-fonts/TitanOne";
import { useEffect } from "react";
import subtitles from "../data/subtitles";
const { fontFamily } = loadFont();

export const MyComposition = ({}) => {
    const {fps, durationInFrames} = useVideoConfig();

    return (
    <>
     <Sequence from={0} durationInFrames={durationInFrames}>
        <Video 
        style={{width: '100%', height: '100%'}}
        width="100%" src={"https://repo.library.stonybrook.edu/xmlui/bitstream/handle/11401/9656/rickroll.mp4?sequence=1&isAllowed=y"} />;
    </Sequence> 
    {subtitles?.map((subtitle) => (
        <Sequence key={subtitle?.id} from={subtitle?.start} durationInFrames={subtitle?.duration}>
             <Subtitle text={subtitle?.text} />
        </Sequence>
    ))}
    </>
    )
    };


export const Subtitle = ({text}) => {
    const frame = useCurrentFrame();
    const fps = useVideoConfig()?.fps;

    const opacity = interpolate(frame, [0, 30], [0, 1])
    const translate = spring({ frame, fps, from: 0, to: 100 })
    return (
        <Heading as='h1'
            maxW='50%'
            ml='25%'
            style={{
                position: 'absolute',
                width: 'fit-content',
                textAlign: 'center',
                opacity,
                top: '30%',
                color: 'white',
                fontFamily: fontFamily,
                fontSize: '3rem',
                transform: `translateY(-${translate}px)`
            }} size='4xl' className="subtitle">
                {text}
        </Heading>
    )
}
