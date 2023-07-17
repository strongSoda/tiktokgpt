import React from "react";
import { Composition, Img, Video, Audio } from "remotion";
import { CustomTTSComponent, GenerateSequence, MyComposition, Subtitle } from "./Composition";
import subtitles from "../data/subtitles";
import dummySubtitles from "../app/data/sentences";

export const RemotionRoot = () => {

  return (
    <>
      {/* <Composition
        id="Video"
        defaultProps={{ subtitles: subtitles }}
        component={MyComposition}
        durationInFrames={1200}
        fps={30}
        width={500}
        height={720}
      />
      {subtitles?.map((subtitle) => (
        <Composition
          key={subtitle?.id}
          id={`Subtitle-${subtitle?.id}`}
          component={Subtitle}
          durationInFrames={subtitle?.duration}
          fps={30}
          width={1080}
          height={720}
          defaultProps={{
            text: subtitle?.text,
          }}
        />
      ))
      } */}

      {/* {
        showPlayer && ( */}

          <Composition
            id="Videogpt"
            component={GenerateSequence}
            durationInFrames={3100}
            defaultProps={{ sentences: dummySubtitles, totalDurationInFrames: 1100, type: 'image' }}
            fps={60}
            width={1100}
            height={720}
          />

          {
            dummySubtitles?.map((sentence) => (
              <Composition
                key={`Subtitle-${sentence?.id}`}
                id={`Subtitle-${sentence?.id}`}
                component={CustomTTSComponent}
                durationInFrames={sentence?.durationInFrames}
                fps={60}
                width={1100}
                height={720}
                defaultProps={{
                  children: sentence?.text,
                  highlight: true,
                  type: 'video'
                }}
              />
            ))
          }

          {
            dummySubtitles?.map((sentence) => (
              <Composition
                key={`Image-${sentence?.id}`}
                id={`Image-${sentence?.id}`}
                component={Img}
                durationInFrames={sentence?.durationInFrames}
                fps={60}
                width={sentence?.photo?.width}
                height={sentence?.photo?.height}
                defaultProps={{
                  src: sentence?.photo?.src?.landscape,
                  style: { width: '100%', height: '100%' }
                }}
              />
            ))
          }
        {/* ) */}
      {/* } */}

      <Composition
        id="Audio"
        component={Audio}
        durationInFrames={3100}
        defaultProps={{src: "https://dl.espressif.com/dl/audio/ff-16b-2c-44100hz.mp3"}}
        fps={60}
        width={1100}
        height={720}
      />
        
    </>
  );
};