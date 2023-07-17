import { Box, Button, Heading } from "@chakra-ui/react"
import { useState } from "react"

const ELEVEN_LABS_API_KEY = "3ca7341753d9d1e90f62f5434122fad7"
const Poc = () => {
  const [audioFile, setAudioFile] = useState(null)
  const [script, setScript] = useState(null)
  const [avatar, setAvatar] = useState(null)

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
    
  }

    return (
        <Box className="container" w={['200vw', '100vw', '100%', '100%']}
         ml='auto' mr='auto' mt='0' mb='10' p='2'>
          <Heading as='h1' size='3xl' className="title" textAlign='center' mt='10' mb='10'>
              POC
          </Heading>

          <Heading as='h2' size='2xl' className="title" textAlign='center' mt='10' mb='10'>
            * Clone your voice
          </Heading>

          <Box className="voice-cloning" w='lg' ml='auto' mr='auto'>
            <Box className="voice-cloning__input">
              <input type="file" accept="audio/*" value={audioFile} onChange={e => setAudioFile(e.target.value)} />
              <br/>
              <Button colorScheme="teal" size="md" w='lg' ml='auto' mr='auto'
              onClick={cloneVoice}
              >Clone Voice</Button>
            </Box>
            <Box className="voice-cloning__output">
            </Box>
          </Box>
          <Heading as='h2' size='2xl' className="title" textAlign='center' mt='10' mb='10'>
            * Generate a script
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
              

              type="text" value={script} onChange={e => setScript(e.target.value)} />
              <br/>
              <Button colorScheme="teal" size="md" w='lg' ml='auto' mr='auto'
              onClick={generateScript}
              >Generate Script</Button>
            </Box>
            <Box className="script-generation__output">
            </Box>
          </Box>


          <Heading as='h2' size='2xl' className="title" textAlign='center' mt='10' mb='10'>
            * Upload/Generate Avatar
          </Heading>

          <Box className="avatar-generation" w='lg' ml='auto' mr='auto'>
            <Box className="avatar-generation__input">
              <input type="file" accept="image/*" value={avatar} onChange={e => setAvatar(e.target.value)} />
              <br/>
              <Button colorScheme="teal" size="md" w='lg' ml='auto' mr='auto'
              // onClick={ava}
              >Generate Avatar</Button>
            </Box>
            <Box className="avatar-generation__output">
            </Box>
          </Box>

          <Heading as='h2' size='2xl' className="title" textAlign='center' mt='10' mb='10'>
            * Generate Voiceover
          </Heading>
          
          <Box className="voiceover-generation" w='lg' ml='auto' mr='auto'>
            <Box className="voiceover-generation__input">
              {/* <input type="file" accept="audio/*" value={audioFile} onChange={e => setAudioFile(e.target.value)} /> */}
              {/* <br/> */}
              <Button colorScheme="teal" size="md" w='lg' ml='auto' mr='auto'
              // onClick={ava}
              >Generate Voiceover</Button>
            </Box>
            <Box className="voiceover-generation__output">
            </Box>
          </Box>


          <Heading as='h2' size='2xl' className="title" textAlign='center' mt='10' mb='10'>
            * Generate Video
          </Heading>

          <Box className="video-generation" w='lg' ml='auto' mr='auto'>
            <Box className="video-generation__input">
              {/* <input type="file" accept="audio/*" value={audioFile} onChange={e => setAudioFile(e.target.value)} /> */}
              {/* <br/> */}
              <Button colorScheme="teal" size="md" w='lg' ml='auto' mr='auto'
              // onClick={ava}
              >Generate Video</Button>
            </Box>
            <Box className="video-generation__output">
            </Box>
          </Box>
        </Box>
    )
}

export default Poc
