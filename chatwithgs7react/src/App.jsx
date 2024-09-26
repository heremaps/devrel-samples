import { useState } from "react";
import OpenAI from "openai";
import SubmitButton from "./components/SubmitButton/SubmitButton";
import SearchInput from "./components/SearchInput/SearchInput";
import TextArea from "./components/TextArea/TextArea";

import "./App.css";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [textAreaState, setTextAreaState] = useState({
    userQuery: "",
    discoverQuery: "",
    discoverResult: null,
    responseText: "",
  });

  const textAreaObject = [
    {
      label: "Generated HERE API Call",
      value: textAreaState.discoverQuery,
      rows: 1,
    },
    {
      label: "HERE API Result",
      value: JSON.stringify(textAreaState.discoverResult, null, 2),
      rows: 25,
    },
    { label: "Final Response", value: textAreaState.responseText, rows: 5 },
  ];

  const system_instructions_1 = `Translate the user prompt to a full API call to HERE's discover endpoint "
  (https://discover.search.hereapi.com/v1/discover). \
  Make sure to include the at and q parameter, but omit the apiKey parameter. \
  Remember that the at parameter should contain coordinates.\
  Your response should only contain the API call, in one line and nothing else.`;
  const system_instructions_2 = `Create an informative and helpful English prompt suitable for a TTS that answers the user \
  question '#1#' solemnly based on the JSON object that is provided. \
  The prompt should be a direct answer to the question. \
  (The JSON is a response from https://discover.search.hereapi.com/v1/discover). \
  Do not mention JSON or that the information is from a JSON object.`;

  const callHereDiscoverEndpoint = async (callString) => {
    callString += `&apiKey=${import.meta.env.VITE_HERE_API_KEY}`;
    try {
      const response = await fetch(callString);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error calling HERE API:", error);
    }
  };
  const simplifyDiscoverResult = (response) => {
    return response.items.map((item) => {
      const { title, address } = item;
      return { title, address };
    });
  };

  const createGPTCompletion = (systemContent, userQuery) => ({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: systemContent,
      },
      { role: "user", content: userQuery },
    ],
  });
  const handleUserQuery = async () => {
    try {
      const completion = await openai.chat.completions.create(
        createGPTCompletion(system_instructions_1, textAreaState.userQuery)
      );

      const result = await callHereDiscoverEndpoint(
        completion.choices[0].message.content
      );
      const simplifiedResult = simplifyDiscoverResult(result);
      const simplifiedResultString = JSON.stringify(simplifiedResult).slice(
        0,
        3500
      );
      const finalCompletion = await openai.chat.completions.create(
        createGPTCompletion(
          system_instructions_2.replace("#1#", textAreaState.userQuery),
          simplifiedResultString
        )
      );
      setTextAreaState((prev) => ({
        ...prev,
        discoverQuery: completion.choices[0].message.content,
        discoverResult: simplifyDiscoverResult(result),
        responseText: finalCompletion.choices[0].message.content,
      }));
    } catch (error) {
      console.error("Error processing the query:", error);
    }
  };

  return (
    <div className="Appcontainer">
      <h1>Query the HERE API</h1>
      <SearchInput
        value={textAreaState.userQuery}
        onChange={(e) =>
          setTextAreaState((prev) => ({
            ...prev,
            userQuery: e.target.value,
          }))
        }
      />
      <SubmitButton onClick={handleUserQuery} />
      {textAreaObject.map((textarea) => (
        <TextArea
          key={textarea.label}
          label={textarea.label}
          value={textarea.value}
          rows={textarea.rows}
        />
      ))}
    </div>
  );
}

export default App;
