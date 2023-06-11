import { Image } from '@chakra-ui/react'
import { AbsoluteFill } from "remotion";

export const RenderLoading = ({ height, width }) => {
return (
    <AbsoluteFill style={{ backgroundColor: "gray" }}>
        {/* loading SVG animation */}
        <Image src="https://media.tenor.com/YPOStjIfQ2IAAAAC/loading-waiting.gif" alt="loading" />
    </AbsoluteFill>
);
}

export const RenderPoster = ({ height, width }) => {
return (
    <AbsoluteFill style={{ backgroundColor: "gray" }}>
        <Image src="https://i.imgur.com/d8WjPeI.png" alt="loading" />
    </AbsoluteFill>
);
}
