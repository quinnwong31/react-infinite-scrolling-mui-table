import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import {
  Box,
  Button,
  Paper,
  // Table,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableHead,
  // TableRow,
} from "@mui/material";
import { TableVirtuoso, TableComponents, LogLevel } from "react-virtuoso";
import { useStreamTextContext } from "./services/StreamTextService";
import { FeedDataVO } from "./model/FeedData";

import { Column, Table } from "react-virtualized";
import "react-virtualized/styles.css"; // only needs to be imported once

var timer = null;
var _index = 0;

/**
 * @returns
 */
const ReactVirtualizedWithTestData = () => {
  const [rows, setRows] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const appendInterval = useRef(null);
  const virtuosoRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const showButtonTimeoutRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const [index, setIndex] = useState(0);

  React.useEffect(() => {
    // generateTestData();
    const init = async () => {
      for (var i = 0; i < 1000000; i++) {
        var feed = new FeedDataVO();
        feed.pageNumber = 1;
        feed.lineNumber = i;
        feed.text = `This is line number: ${i}`;
        rows.push(feed);
        // setRows(_rows);
      }
    };
    init();
  }, []);

  React.useEffect(() => {
    clearTimeout(showButtonTimeoutRef.current);
    if (!atBottom) {
      showButtonTimeoutRef.current = setTimeout(() => setShowButton(true), 500);
    } else {
      setShowButton(false);
    }
  }, [atBottom, setShowButton]);

  React.useEffect(() => {
    console.log("XXXXX index", index);
    var feed = new FeedDataVO();
    feed.pageNumber = 1;
    feed.lineNumber = index;
    feed.text = `This is line number: ${index}`;
    visibleRows.push(feed);
  }, [index]);

  const handleOnClick = () => {
    console.log("XXXXX handleOnClick");
    setIsStarted(!isStarted);
    if (!isStarted) {
      timer = setInterval(() => {
        // _index = index;
        _index++;
        setIndex(_index);
      }, 200);
    } else {
      clearInterval(timer);
    }
  };

  const handleGotoBottom = () => {
    virtuosoRef.current.scrollToIndex({
      index: rows.length - 1,
      behavior: "smooth",
    });
  };

  return (
    <Paper style={{ height: 800, width: "100%" }}>
      <Box display="flex" flexDirection="row">
        <Button onClick={handleOnClick}>{!isStarted ? "Start" : "Stop"}</Button>
        {/* <Button onClick={handleGotoBottom}>Go to Bottom</Button> */}
        Index: {index}
      </Box>
      {/* <TableVirtuoso
        ref={virtuosoRef}
        initialTopMostItemIndex={999}
        data={visibleRows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
        followOutput={"auto"}
        logLevel={LogLevel.DEBUG}
      /> */}

      <Table
        width={800}
        height={800}
        headerHeight={20}
        rowHeight={30}
        rowCount={visibleRows.length}
        rowGetter={({ index }) => visibleRows[index]}
      >
        <Column label="Page Number" dataKey="pageNumber" width={100} />
        <Column label="Line Number" dataKey="lineNumber" width={100} />
        <Column width={500} label="Text" dataKey="text" />
      </Table>
    </Paper>
  );
};
export default ReactVirtualizedWithTestData;
