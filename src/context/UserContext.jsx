import React, { createContext, useState } from 'react'
import run from '../gemini';
export const datacontext=createContext()

function UserContext({children}) {

// useState is used to manage the state of the application
// if speaking is true, then showing the text response
// if false, then showing the mic button
let [speaking,setSpeaking]=useState(false)
let [prompt,setPrompt]=useState("listening...")
let [response,setResponse]=useState(false)

    function speak(text){
let text_speak=new SpeechSynthesisUtterance(text)
text_speak.volume=1;
text_speak.rate=1;
text_speak.pitch=1;
text_speak.lang="hi-GB"
window.speechSynthesis.speak(text_speak)
    }

// AI response
// async because the run function coz it returns a promise after some time
async function aiResponse(prompt){
    let text=await run(prompt)
    // console.log(text)
    let newText=text.split("**")&&text.split("*")&&text.replace("google","Rishi")&&text.replace("Google","Rishi")
    setPrompt(newText)
    speak(newText)
    setResponse(true)
    setTimeout(()=>{
     setSpeaking(false)
    },5000)
    
    
}

// speech recognition
let speechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition
let recognition=new speechRecognition()

// recognition config
recognition.onresult=(e)=>{ 
    // console.log(e)
    // the spoken text is in e.results[0][0].transcript, so we have to return the 0th index of the results
let currentIndex=e.resultIndex
let transcript=e.results[currentIndex][0].transcript
    // console.log(transcript)

// set the prompt to the spoken text
setPrompt(transcript)
takeCommand(transcript.toLowerCase())
}

function takeCommand(command) {
  const speakAndSet = (text) => {
    speak(text);
    setResponse(true);
    setPrompt(text);
    setTimeout(() => setSpeaking(false), 5000);
  };

  const openSite = async (siteName) => {
    const domain = siteName.toLowerCase().replace(/\s/g, "") + ".com";
    const url = `https://www.${domain}`;

    try {
      const response = await fetch(url, { mode: "no-cors" });
      window.open(url, "_blank");
      speakAndSet(`Opening ${siteName}`);
    } catch (error) {
      // Fallback to Google search
      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(siteName)}`;
      window.open(googleUrl, "_blank");
      speakAndSet(`Couldn't open ${siteName}, searching instead`);
    }
  };

  const googleSearch = (query) => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, "_blank");
    speakAndSet(`Searching for ${query}`);
  };

  // --- Main Conditions ---

  // "search something" or "search for something"
  if (command.includes("search")) {
    const match = command.match(/search(?: for)? (.+)/); // matches "search" or "search for"
    if (match && match[1]) {
      const query = match[1].trim();
      googleSearch(query);
    } else {
      speakAndSet("Please tell me what to search");
    }
  }
    // google search
  else if(command.includes("open") && command.includes("google")){
        window.open("https://www.google.com/","_blank")
        speak("opening google")
        setResponse(true)
        setPrompt("opening google...")
        setTimeout(()=>{
            setSpeaking(false)
           },5000)
  }

    // "open something" with fallback
  else if (command.includes("open")) {
        const match = command.match(/open\s+(.+)/);
        if (match && match[1]) {
        const siteName = match[1].trim();
        openSite(siteName);
        } else {
        speakAndSet("Please tell me which website to open");
        }
  }

  // Get time
  else if (command.includes("time")) {
    let time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
    speakAndSet(`The time is ${time}`);
  }

  // Get date
  else if (command.includes("date")) {
    let date = new Date().toLocaleString(undefined, { day: "numeric", month: "short" });
    speakAndSet(`Today's date is ${date}`);
  }

  // Default: AI model response
  else {
    aiResponse(command);
  }
}


   let value={
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    response,
    setResponse
   }
  return (
    <div>
     <datacontext.Provider value={value}>
      {children}
      </datacontext.Provider>
    </div>
  )
}

export default UserContext
