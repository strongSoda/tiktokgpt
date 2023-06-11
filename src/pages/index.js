import { Player } from "@remotion/player";
import { MyComposition } from "@/remotion/Composition";
import subtitles from "@/data/subtitles";

const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <Player
                component={MyComposition}
                inputProps={{ subtitles: subtitles }}
                durationInFrames={1200}
                compositionWidth={1080}
                compositionHeight={720}
                fps={30}
                controls
                />
        </div>
    )
}

export default Home;
