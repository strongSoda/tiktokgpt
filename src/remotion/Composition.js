import { interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { Heading, Box } from '@chakra-ui/react'
import subtitles from "../data/subtitles";

import { loadFont } from "@remotion/google-fonts/TitanOne";
const { fontFamily } = loadFont();

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
