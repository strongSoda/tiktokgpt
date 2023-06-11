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

            {/* button on clcik call /api/render which returns an mp4 download it */}
            <button 
                onClick={() => {
                    fetch('/api/render')
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data)
                        // the data is the mp4 file so we can download it
                        const link = document.createElement('a');
                        link.href = data;
                        link.download = 'video.mp4';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    })
                }}
            >Download</button>
        </div>
    )
}

export default Home;
