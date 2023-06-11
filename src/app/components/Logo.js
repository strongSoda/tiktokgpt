import {
  Stack,
  useColorModeValue,
  Link,
  Heading,
  Image
} from '@chakra-ui/react';

const Logo = (props) => {
  return (
    <Link 
        px={2}
        py={0}
        _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href='/' style={{ textDecoration: 'none' }}
    >
    <Stack direction='row' spacing={1} align='center'>
        <Image 
        width={{
          base: '90px',
          md: '80px',
          xl: '50px',
        }}
        src="https://i.pinimg.com/originals/65/f2/70/65f270d7d57999a5f48b8855d4a181b4.png" alt="logo" />
        <Heading as='h3' 
            fontSize={['3em', '20em', '4em', 'xl']}
            ml={2}
            display='inline' fontFamily={'Titan One'}>
            GPT
        </Heading>
    </Stack>
    </Link>

  );
};

export default Logo
