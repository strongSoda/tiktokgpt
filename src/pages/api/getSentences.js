import {openai} from '../../app/libs/openai';

export default async function handler(req, res) {
  // get the video topic from the query string
  const { topic } = req.query;
  console.log("topic", topic);

  const sentences = await getSentences(topic);

  res.status(200).json({ sentences })
}


// console.log("process.env.OPENAI_API_KEY", process.env.NEXT_PUBLIC_OPENAI_API_KEY);

const getSentences = async (topic) => {
  
  const prompt = getPrompt(topic);
  console.log("prompt", prompt);
  try {

      const chatCompletion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{role: "user", content: prompt}],
        });
        console.log(chatCompletion?.data?.choices[0]?.message?.content?.replaceAll('\n', '').replaceAll('\\', ''));
        return chatCompletion?.data?.choices[0]?.message?.content?.replaceAll('\n', '').replaceAll('\\', '');

      // const result = await openai.createCompletion({
      //   model: "gpt-3.5-turbo",
      //   prompt: prompt,
      //   temperature: 1,
      //   max_tokens: 200,
      // });
      // console.log("response", result?.data?.choices[0]?.text);
      // return result?.data?.choices[0]?.text
    } catch (e) {
      console.error(e);
    }
  };


const getPrompt = (topic) => {
  // return a prompt for write a script for a video based on the video topic with OpenAI's API for a 30 seconds video with 10 sentences. Return a valid JSON array of objects with the sentences in order with the following properties: id, start, duration, text, imageDescription where imageDescription is the description of the image appropriate for the sentence from Unsplash's API in max 4 words.
  return `Write a script for a video with on the topic "${topic}". Return a valid JSON array of objects with the sentences in order with the following properties: id, start, durationInFrames (with 60 fps, minimum durationInFrames = 300 ), text, imageDescription. Where imageDescription is the description of the image appropriate for the sentence in max 4 words. The first object is a title for the topic of the video.
  -------

  Example Output:
  {
    "sentences": 
      [
        {
          "id": 0,
          "start": 0,
          "durationInFrames": 120,
          "text": "Topic of the video",
          "imageDescription": "Image description"
        },
        {
          "id": 1,
          "start": 120,
          "durationInFrames": 120,
          "text": "Cows have 4 stomachs",
          "imageDescription": "Cow"
        },
        {
          "id": 2,
          "start": 240,
          "durationInFrames": 120,
          "text": "Cows are herbivores",
          "imageDescription": "Cow eating grass"
        },
        {
          "id": 3,
          "start": 360,
          "durationInFrames": 120,
          "text": "Cows are sacred in India",
          "imageDescription": "Cow in India"
        }
      ],
      "totalDurationInFrames": 1200
}
  
  `;
}

// export const config = {
//   runtime: 'edge', // this is a pre-requisite
//   regions: ['bom1'], // only execute this function on iad1
// };

