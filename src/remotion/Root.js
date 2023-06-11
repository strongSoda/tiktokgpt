import React from "react";
import { Composition } from "remotion";
import { MyComposition, Subtitle } from "./Composition";
import subtitles from "../data/subtitles";

export const RemotionRoot = () => {

  return (
    <>
      <Composition
        id="Video"
        inputProps={{ subtitles: subtitles }}
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
      }
    </>
  );
};