require('dotenv').config();  // Load the .env file

let apiKey= process.env.GEMINI_API_KEY;

import {
    GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, 
} from '@google/generative-ai';

const genAI= new GoogleGenerativeAI(apiKey);
const model= genAI.getGenerativeModel({
    model:"gemini-1.5-flash",
});

const generationConfig= {
    temperature:1,
    maxOutputTokens: 8192,
    topK: 40,
    topP: 0.95,
    responseMimeType: "text/plain",
};

async function run( prompt ) {
    const chatSession= model.startChat({
        generationConfig,
        history: [

        ],
    });

    const result = await chatSession.sendMessage(prompt);
    console.log(result.response.text());

}

export default run();