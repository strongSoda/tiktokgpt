import { Box, Button, Heading, Image, Text } from "@chakra-ui/react"
import { useState } from "react"
import benflekvoice from '../assets/ben-aflek.mp3'
import benflekpic from '../assets/ben-aflek.jpeg'
import { getScript } from "./api/getSentences";
import logUsage from "@/logusage";
// import Player from "@madzadev/audio-player";
// import "@madzadev/audio-player/dist/index.css";

const tracks = [
  {
    url: benflekvoice,
    title: "Ben Aflek interview",
    tags: [""],
  },
];

const ELEVEN_LABS_API_KEY = "3ca7341753d9d1e90f62f5434122fad7"
const Poc = () => {
  const [audioFile, setAudioFile] = useState(null)
  const [scriptTopic, setScriptTopic] = useState('bees')
  const [script, setScript] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [showClonedVoiceId, setshowClonedVoiceId] = useState(false)
  const [LoadingVoiceClone, setLoadingVoiceClone] = useState(false)
  const [GeneratingSCript, setGeneratingScript] = useState(false)
  const [generatingVoiceover, setgeneratingVoiceover] = useState(false)
  const [generatingVideo, setgeneratingVideo] = useState(false)
  const [videoUrl, setVideoUrl ] = useState('')
  const[voiceOver, setVoiceOver] = useState("")

  // TODO: make backend API to clone voice
  const cloneVoice = async () => {
    const formData = new FormData()
    formData.append('audioFile', audioFile)
    const res = await fetch(``, {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    console.log(data)
  }

  const generateScript = async () => {
    if(!scriptTopic) return

    setGeneratingScript(true)
    
    const script = await getScript(scriptTopic)

    console.log(script)

    setScript(script)

    setGeneratingScript(false)

  }

  const generateVoiceover = async () => {
    if (!script) return
    
    setgeneratingVoiceover(true)
    const res = await fetch('http://127.0.0.1:5000/generate-voiceover-s3?text=' + script)

    const data = await res?.json()

    console.log(data)

    setVoiceOver(data?.url)
    setgeneratingVoiceover(false)

  }

  const getTalk = async (id) => {
    const res = await fetch("http://127.0.0.1:5000/get-talking-video/" + id)

    const data = await res?.json()

    console.log(data)
    
    if(!data?.response.result_url) getTalk(id)


    setVideoUrl(data?.response.result_url)
    
    if(
      data?.response.result_url
    ) {
      logUsage({"text": 'New Video: ' + script?.split('\n')[0], 'video_url': data?.response.result_url, 'title': script?.split('\n')[0], 'description': script, tags: script?.split(' ')})
    }

  }

    const generateVideo = async () => {
    if (!script) return
    
    setgeneratingVideo(true)
    const res = await fetch('http://127.0.0.1:5000/generate-talking-video?text=' + script)

    const data = await res?.json()

    console.log(data)

    await getTalk(data?.response.id)
    // await getTalk("tlk_8FXyYYIztxV9MHEGqpHDW")
    // setVoiceOver(data?.url)
    setgeneratingVideo(false)

  }

    return (
        <Box className="container" w={['200vw', '100vw', '100%', '100%']}
         ml='auto' mr='auto' mt='0' mb='10' p='2'>
          <Heading as='h1' size='3xl' className="title" textAlign='center' mt='10' mb='10'>
              POC
          </Heading>

          <Heading as='h2' size='2xl' className="title" textAlign='center' mt='10' mb='10'>
            Clone Ben Aflek's voice
          </Heading>

          <Box className="voice-cloning" w='lg' ml='auto' mr='auto'>
            <Box className="voice-cloning__input">
              <audio controls>
                <source src={benflekvoice} type="audio/mp3" />
              </audio>
              {/* <Player trackList={tracks} /> */}
              <br/>
              <Button colorScheme="teal" size="md" w='lg' ml='auto' mr='auto'
              onClick={() => {
                setLoadingVoiceClone(true)
                setTimeout(() => {
                  setshowClonedVoiceId(true)
                  setLoadingVoiceClone(false)
                }, 2000)
              }}
              isLoading={LoadingVoiceClone}
              >Clone Voice</Button>
            </Box>
            <Box className="voice-cloning__output">
              {
                showClonedVoiceId && <Text>Voice Cloned Successfully. Cloned Voice Id: VRP88UL6dZxAVjGJ2Dli</Text>
              }
            </Box>
          </Box>
          <Heading as='h2' size='2xl' className="title" textAlign='center' mt='10' mb='10'>
            Generate a script
          </Heading>

          <Box className="script-generation" w='lg' ml='auto' mr='auto'>
            <Box className="script-generation__input">
              <input 

              style={{
                width: '100%',
                height: '40px',
                border: '1px solid black',
                borderRadius: '5px'
              }}
              

              type="text" value={scriptTopic} onChange={e => setScriptTopic(e.target.value)} />
              <br/>
              <Button colorScheme="teal" size="md" w='lg' ml='auto' mr='auto'
              onClick={generateScript}
              isLoading={GeneratingSCript}
              >Generate Script</Button>
            </Box>
            <Box className="script-generation__output">
              {script &&
                <Text>
                  {script}
                </Text>
              }
            </Box>
          </Box>


          <Heading as='h2' size='2xl' className="title" textAlign='center' mt='10' mb='10'>
            Ben Aflek Avatar
          </Heading>

          <Box className="avatar-generation" w='lg' ml='auto' mr='auto'>
            <Box className="avatar-generation__input">
              <Image src="./ben-aflek.jpeg" w={250} h={300}/>
              <br/>
              {/* <Button colorScheme="teal" size="md" w='lg' ml='auto' mr='auto'
              // onClick={ava}
              >Generate Avatar</Button> */}
            </Box>
            <Box className="avatar-generation__output">
            </Box>
          </Box>

          <Heading as='h2' size='2xl' className="title" textAlign='center' mt='10' mb='10'>
            Generate Voiceover
          </Heading>
          
          <Box className="voiceover-generation" w='lg' ml='auto' mr='auto'>
            <Box className="voiceover-generation__input">
              {/* <input type="file" accept="audio/*" value={audioFile} onChange={e => setAudioFile(e.target.value)} /> */}
              {/* <br/> */}
              <Button colorScheme="teal" size="md" w='lg' ml='auto' mr='auto'
              onClick={generateVoiceover}
              isLoading={generatingVoiceover}
              >Generate Voiceover</Button>
            </Box>
            <Box className="voiceover-generation__output">
              {voiceOver && 
              <audio controls>
                <source src={voiceOver} type="audio/mp3" />
              </audio>
              }
            </Box>
          </Box>


          <Heading as='h2' size='2xl' className="title" textAlign='center' mt='10' mb='10'>
            Generate Video
          </Heading>

          <Box className="video-generation" w='lg' ml='auto' mr='auto'>
            <Box className="video-generation__input">
              {/* <input type="file" accept="audio/*" value={audioFile} onChange={e => setAudioFile(e.target.value)} /> */}
              {/* <br/> */}
              <Button colorScheme="teal" size="md" w='lg' ml='auto' mr='auto'
              onClick={generateVideo}
              isLoading={generatingVideo}
              >Generate Video</Button>
            </Box>
            <Box className="video-generation__output">
              {
                videoUrl &&

                <>                
                <video controls>
                  <source src={videoUrl} />
                </video>

                <p>{videoUrl}</p>
                </>
              }
            </Box>
          </Box>
        </Box>
    )
}

export default Poc
