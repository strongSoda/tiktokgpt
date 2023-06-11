import React from "react";
import { Player } from "@remotion/player";
import { MyComposition } from "@/remotion/Composition";
import subtitles from "@/data/subtitles";
import Nav from "@/app/components/Nav";
import { Heading, Box, Button, Image } from '@chakra-ui/react'
import { RenderLoading, RenderPoster } from "@/app/components/RenderAssets";

const Home = () => {

return (
    <>
        <Nav />
        <Box className="container" w='60%' ml='auto' mr='auto' mt='0' mb='0' p='2'>
            <Heading as='h1' size='3xl' className="title" textAlign='center' mt='10' mb='10'>
                My Feed
            </Heading>

            <Box w='lg' className="video-container" ml='auto' mr='auto'>
                <Player
                    component={MyComposition}
                    inputProps={{ subtitles: subtitles }}
                    durationInFrames={1200}
                    compositionWidth={515}
                    compositionHeight={720}
                    fps={30}
                    controls
                    renderLoading={RenderLoading}
                    renderPoster={RenderPoster}
                    showPosterWhenUnplayed
                    showPosterWhenPaused
                    showPosterWhenEnded
                    />
            
                <Button 
                    w='lg'
                    mt='10'
                    ml='auto'
                    mr='auto'
                    colorScheme="teal"
                    
                    onClick={() => {
                        window.open('/api/render', '_blank');
                    }}
                >Render Video</Button>
            </Box>

        </Box>
    </>
)
}

export default Home;
