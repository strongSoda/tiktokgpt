import React from "react";
import { Player } from "@remotion/player";
import { MyComposition } from "@/remotion/Composition";
import subtitles from "@/data/subtitles";
import Nav from "@/app/components/Nav";
import { Heading, Box, Button, Image, Stack, Text } from '@chakra-ui/react'
import { RenderLoading, RenderPoster } from "@/app/components/RenderAssets";
import { TriangleUpIcon, AddIcon, TriangleDownIcon } from '@chakra-ui/icons';
import Footer from "@/app/components/Footer";

const Home = () => {

return (
    <>
        <Nav />
        
        <Box className="container" w={['200vw', '100vw', '100%', '100%']}
         ml='auto' mr='auto' mt='0' mb='10' p='2'>
            <Heading as='h1' size='3xl' className="title" textAlign='center' mt='10' mb='10'>
                My Feed
            </Heading>

            {/* Remotion Player */}
            <Stack direction="row" spacing={2} align="center" width="lg" ml='auto' mr='auto'>
                <Box className="video-container">
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

                {/* action buttons */}
                <Stack direction="column" spacing={8} align="center">
                    
                    <Stack direction="column" spacing={1} align="center">
                        <Button>
                            <TriangleUpIcon />
                        </Button>
                        <Text>
                            4.5k
                        </Text>
                    </Stack>

                    <Stack direction="column" spacing={1} align="center">
                        <Button>
                            <TriangleDownIcon />
                        </Button>
                        <Text>
                            20M
                        </Text>
                    </Stack>

                    <Stack direction="column" spacing={1} align="center">
                        <Button>
                            <AddIcon />
                        </Button>
                        <Text>
                            Share
                        </Text>
                    </Stack>
                </Stack>
            </Stack>

        </Box>

        <Footer />
    </>
)
}

export default Home;
