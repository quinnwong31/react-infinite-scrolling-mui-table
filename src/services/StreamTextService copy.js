/**
////////////////////////////////////////////////////////////////////////////////
//
// HUSEBY INC
// Copyright 2021 Huseby, Inc.
// All Rights Reserved.
//
// NOTICE: Huseby, Inc permits you to use this file in in accordance with the terms 
// of the license agreement accompanying it.  Do not modify, sell or distribute
// without the expressed, written consent of Huseby, Inc.
//
////////////////////////////////////////////////////////////////////////////////
*/

import React from "react";
import axios from "axios";
import { isEmpty, isNil, merge } from "lodash";
import { v4 } from "uuid";
import { Model } from "../model/Model";
import { FeedDataVO } from "../model/FeedData";

const DELAY = 800;
const BROADCAST_INTERVAL = 100;
const streamTextStreamUrl = "https://stage.streamtext.net/";
const CHARACTER_BACKSPACE = "\b";

// Variables
let transcriptIndex = 0;
let currentLineNumber = 0;
let currentPageNumber = 1;
let currentLineChunk = "";
let currentTimestamp = "";
let nextLineChunk = "";
let currentTranscript = null; // FeedDataVO
let isNewLine = true;
let lastPosition = 0;
let transcripts = [];
let testData = [];

let reducer = (data, newData) => {
  newData.clear && delete data[newData.clear] && delete newData.clear;
  return { ...merge(data, newData) };
};

const initialState = new Model();

/**
 * The timer for streaming transcripts.
 */
let streamingTranscriptTimer;

const StreamTextContext = React.createContext();

const StreamTextProvider = (props) => {
  const [data, setData] = React.useReducer(reducer, initialState);

  /**
   * StreamText HTTP Service.
   */
  const streamTextHttp = axios.create({
    // baseURL: process.env.REACT_APP_ROOMSVC_API_URL,
    baseURL: streamTextStreamUrl,
  });

  /**
   * Load StreamText test data.
   *
   * @param {*} param0
   * @returns
   */
  const loadStreamTextTestData = async () => {
    console.log("XXXXX Loading StreamText test data...");
    const config = {
      method: "get",
      url: `http://localhost:3000/text-data.json`,
    };

    try {
      const { data } = await streamTextHttp(config);
      // console.log("XXXXX data", data.i);
      testData = data.i;
      // console.log("XXXXX Finished loading test data.", testData);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Get the next piece of text from StreamText.
   *
   * @param {*} param0
   * @returns
   */
  const getNextPieceOfText = async ({ eventName, lastIndex }) => {
    // console.log("XXXXX getNextPieceOfText", lastPosition);

    const next = testData[lastPosition];
    const nextJson = {
      lastPosition: lastPosition,
      i: [next],
    };
    return nextJson;
  };

  /**
   * Update the text with a backspace character.
   *
   * @param s
   * @return
   */
  const updateTextWithBackspace = (s) => {
    s = s.replace("<br/>", "");
    let updates = {};
    let tmp = "";
    for (let i = 0; i < s.length; i++) {
      if (s[i] == CHARACTER_BACKSPACE && tmp.length > 0) {
        tmp = tmp.substring(0, tmp.length - 1);
      } else {
        tmp += s[i];
      }

      if (tmp.length == 0) {
        const chunkPrevLine = s.substring(i + 2, s.length);
        updates.chunkPrevLine = chunkPrevLine;
        break;
      }
    }
    updates.transcriptText = tmp;
    return updates;
  };

  /**
   * Check if the string begins with a backspace.
   *
   * @param {} s
   * @returns
   */
  const startsWithBackspace = (s) => {
    // let MAX_SPLIT_COUNT = 100;
    let split = s.split(CHARACTER_BACKSPACE);
    let tmp = split[0];

    // Check if the first element is an empty string.  If it is, that means
    // this string begins with a backspace.
    return isEmpty(tmp);
  };

  /**
   * Start the StreamText Transcript.
   */
  const startStreamTextTranscript = async () => {
    console.log("XXXXX startStreamTextTranscript...");
    streamingTranscriptTimer = setInterval(async () => {
      getStreamTextTranscript();
    }, BROADCAST_INTERVAL);
  };

  /**
   * Stop the StreamText Transcript.
   *
   * @returns
   */
  const stopStreamTextTranscript = async () => {
    console.log("StreamTextService.stopStreamTextTranscript...");
    clearInterval(streamingTranscriptTimer);
  };

  /**
   * Get the StreamText Transcript.
   */
  const getStreamTextTranscript = async () => {
    lastPosition++;
    try {
      const data = await getNextPieceOfText({
        // eventName: "legaldemo",
        eventName: "42667",
        lastIndex: lastPosition,
      });

      // Parse results from the StreamText json data
      const jsonArray = parseResults(data);

      // Append the next piece of text to the current transcript.
      let tmpTranscripts;
      jsonArray.forEach((feed) => {
        tmpTranscripts = appendNextPieceOfTextToTranscript(feed);
      });

      // // Set the transcripts.  This will update the transcript viewer.
      // setData({ transcript: [] });
      // setData({ transcript: [...tmpTranscripts] });
      // return [...tmpTranscripts];
      return tmpTranscripts;
    } catch (error) {
      console.log("XXX error", error);
    }
  };

  const containsNewLine = (s) => {
    return s.includes("<br/>");
  };

  /**
   * Parse results from the StreamText json data that is returned from the
   * REST API call to StreamText.
   *
   * @returns
   */
  const parseResults = (data) => {
    let results = [];
    // let pageNumber = null;
    let timeStamp = null;
    if (data != null && data?.i != null) {
      let arr = data?.i;
      let resultArr = [];
      let originalString = "";
      let processedString = "";

      arr.forEach((obj, index) => {
        let jsonObj = obj;
        originalString = jsonObj?.d;

        // Handle transcript line
        let tmp = "";

        // Set local counter
        lastPosition = data?.lastPosition;
        // setLastPosition(tmpLastPosition);
        // setTranscriptData({ lastPosition: lastPosition });

        // Set the transcript line
        tmp += data?.i[index]?.d;

        // Escape %20 with &#160; so that we can display in HTML tag
        tmp = tmp.replace(/%20/g, " ");
        tmp = tmp.replace(/%08/g, "\b");
        tmp = decodeURIComponent(tmp);

        // Escape \n with <br/> so that we can display in HTML tag
        tmp = tmp.replace(/\n/g, "<br/>");
        tmp = tmp.replace(/%0A/g, "<br/>");

        processedString = tmp;
        // setTranscriptText(processedString);

        // Get pageNumber
        try {
          if (jsonObj?.p != null) {
            currentPageNumber = parseInt(jsonObj?.p);
          } else {
            currentPageNumber = 1; // Default to page 1.
          }
        } catch (e) {
          currentPageNumber = 1;
        }

        // Get timeStamp
        timeStamp = jsonObj?.m;
        if (!isNil(timeStamp) && timeStamp != "") {
          currentTimestamp = timeStamp;
        }

        results.push(
          new FeedDataVO(
            v4(),
            processedString,
            currentPageNumber,
            currentLineNumber,
            currentTimestamp
          )
        );
      });
    }

    return results;
  };

  /**
   * Append the next row of transcript text to the overall transcripts for this
   * StreamText event.   This is required because we can run into situations where:
   *
   * 1. We need to split the incoming transcript text into two lines when a new line character
   * is detected.
   *
   * 2. Delete characters from the transcript text when a backspace character is detected.
   *
   * @param task
   * @param results
   * @return
   * @throws Exception
   */
  const appendNextPieceOfTextToTranscript = (transcriptChunk) => {
    // console.log("transcriptChunk", transcriptChunk, currentPageNumber);
    // console.log("transcriptChunk.text: {}", transcriptChunk.text);
    let transcriptText = transcriptChunk.text;

    // Handle transcript text that begins on a new line. This involves
    // resetting several of the flags and counters (newLine, currentTimestamp, lineNumber, pageNumber).
    if (isNewLine == true) {
      currentTimestamp = "";
      // Increment the line number if this is the same page.
      // Else if its a new page, then reset the line number to 1.
      if (currentPageNumber == transcriptChunk.pageNumber) {
        currentLineNumber++;
      } else {
        currentLineNumber = 1;
      }

      // Add transcript row
      currentTranscript = new FeedDataVO(
        v4(),
        nextLineChunk + transcriptChunk.text,
        currentPageNumber,
        currentLineNumber,
        currentTimestamp,
        true
      );

      // Set isNewLine flag to false.
      isNewLine = false;

      transcripts.push(currentTranscript);

      return currentTranscript;
    } else {
      // Get the current transcript.  If the current transcript text starts with
      // a backspace, then get the previous transcript row.
      currentTranscript = transcripts[transcripts.length - 1];

      // If the transcriptLine's text contains new line, then split the line and add it to the next line.
      if (containsNewLine(transcriptChunk.text)) {
        isNewLine = true;
        let transcriptChunks = transcriptText.split("<br/>");
        currentLineChunk =
          transcriptChunks.length > 0 ? transcriptChunks[0] : "";
        nextLineChunk = transcriptChunks.length > 1 ? transcriptChunks[1] : "";
      } else {
        currentLineChunk = transcriptText;
      }

      // Append the current feed text to transcriptLine's text
      // if (transcripts.length > 0) {
      //   currentTranscript = transcripts[transcripts.length - 1];
      // }
      transcriptText = !isNil(currentTranscript.text)
        ? currentTranscript.text
        : "";
      transcriptText += currentLineChunk;

      // Check if the line contains a backspace.  If it does, then
      // update the transcriptText with the updated text.
      let updated = {};
      if (containsBackspace(transcriptText)) {
        // Get the updated transcript
        updated = updateTextWithBackspace(transcriptText);

        // If the chunk prev line, then update the previous line
        if (!isNil(updated.chunkPrevLine) && updated.chunkPrevLine.length > 0) {
          // console.log("XXX updated", updated);
          const tmpLine = updated.transcriptText + updated.chunkPrevLine;
          currentTranscript = transcripts[transcripts.length - 2];
          transcriptText = !isNil(currentTranscript.text)
            ? currentTranscript.text
            : "";
          // console.log("XXX transcriptText", transcriptText);
          transcriptText += tmpLine;
          // console.log("XXX transcriptText", transcriptText);
          updated = updateTextWithBackspace(transcriptText);
          // console.log("XXX updated2", updated);
          transcriptText = updated.transcriptText;
          // console.log("XXXXX updated", updated);
          transcripts.pop();
        } else {
          transcriptText = updated.transcriptText;
        }
      }

      currentTranscript.text = transcriptText;
      currentTranscript.timeStamp = currentTimestamp;
      currentTranscript.isNewLine = false;

      // Add the transcript line to the collection of transcripts.
      if (transcripts.length > 0) {
        transcripts[transcripts.length - 1] = currentTranscript;
        return currentTranscript;
      } else {
        transcripts.push(currentTranscript);
        // setTranscriptData({ transcript: [...transcripts] });
      }
    }

    // Set the current pageNumber
    currentPageNumber = transcriptChunk.pageNumber;
  };

  function escapeHTML(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  }

  const containsBackspace = (s) => {
    return s.split(CHARACTER_BACKSPACE).length > 1;
  };

  return (
    <StreamTextContext.Provider
      value={{
        data,
        setData,
        loadStreamTextTestData,
        getNextPieceOfText,
        updateTextWithBackspace,
        startsWithBackspace,
        startStreamTextTranscript,
        getStreamTextTranscript,
        stopStreamTextTranscript,
        parseResults,
      }}
    >
      {props.children}
    </StreamTextContext.Provider>
  );
};

const useStreamTextContext = () => React.useContext(StreamTextContext);

export { StreamTextContext, StreamTextProvider, useStreamTextContext };
