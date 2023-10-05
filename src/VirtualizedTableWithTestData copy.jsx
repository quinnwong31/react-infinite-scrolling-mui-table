import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { TableVirtuoso, TableComponents, LogLevel } from "react-virtuoso";
import { useStreamTextContext } from "./services/StreamTextService";
import { FeedDataVO } from "./model/FeedData";

var timer = null;
var _index = 0;

/**
 * @returns
 */
const VirtualizedTableWithTestData = () => {
  const [rows, setRows] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const appendInterval = useRef(null);
  const virtuosoRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const showButtonTimeoutRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const [index, setIndex] = useState(0);

  const {
    data,
    loadStreamTextTestData,
    startStreamTextTranscript,
    stopStreamTextTranscript,
    getStreamTextTranscript,
  } = useStreamTextContext();

  React.useEffect(() => {
    // generateTestData();
    const init = async () => {
      const testData = await loadStreamTextTestData();
    };
    init();
  }, []);

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

  // React.useEffect(() => {
  //   // console.log("XXXXX data.transcript", data.transcript);
  //   const lastRow = data?.transcript[data?.transcript?.length - 1];
  //   console.log("XXXXX lastRow", data?.transcript?.length);
  //   // if (lastRow !== undefined) setRows((rows) => [...rows, lastRow]);
  //   // if (lastRow !== undefined) rows.push(lastRow);
  //   const i = data?.transcript?.length - 1;

  //   var feed = new FeedDataVO();
  //   feed.pageNumber = 1;
  //   feed.lineNumber = i;
  //   feed.text = `This is line number: ${i}`;
  //   visibleRows.push(feed);
  //   setAtBottom(true);
  // }, [data?.transcript?.length]);

  React.useEffect(() => {
    clearTimeout(showButtonTimeoutRef.current);
    if (!atBottom) {
      showButtonTimeoutRef.current = setTimeout(() => setShowButton(true), 500);
    } else {
      setShowButton(false);
    }
  }, [atBottom, setShowButton]);

  /**
   * Load StreamText test data.
   *
   * @param {*} param0
   * @returns
   */

  /**
   * Columns
   */
  const columns = [
    {
      width: 100,
      label: "Page Number",
      dataKey: "pageNumber",
    },
    {
      width: 100,
      label: "Line Number",
      dataKey: "lineNumber",
    },
    {
      width: 500,
      label: "Text",
      dataKey: "text",
    },
    {
      width: 200,
      label: "Time Stamp",
      dataKey: "timeStamp",
    },
  ];

  /**
   *
   */
  const VirtuosoTableComponents = {
    Scroller: React.forwardRef((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table
        {...props}
        sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
      />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    TableBody: React.forwardRef((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
  };

  /**
   *
   * @returns
   */
  const fixedHeaderContent = () => {
    return (
      <TableRow>
        {columns.map((column, index) => (
          <TableCell
            key={index}
            variant="head"
            style={{ width: column.width }}
            sx={{
              backgroundColor: "background.paper",
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    );
  };

  /**
   *
   * @param {*} _index
   * @param {*} row
   * @returns
   */
  const rowContent = (_index, row) => {
    return (
      <React.Fragment>
        {columns.map((column) => (
          <TableCell key={column.dataKey}>{row[column.dataKey]}</TableCell>
        ))}
      </React.Fragment>
    );
  };

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
      <TableVirtuoso
        ref={virtuosoRef}
        initialTopMostItemIndex={999}
        data={visibleRows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
        followOutput={"auto"}
        logLevel={LogLevel.DEBUG}
        // atBottomStateChange={(bottom) => {
        //   console.log("XXXXX bottom", bottom);
        //   clearInterval(appendInterval.current);
        //   // if (bottom) {
        //   appendInterval.current = setInterval(async () => {
        //     const currentTranscript = await getStreamTextTranscript();
        //     console.log("XXXXX currentTranscript", currentTranscript);
        //     if (
        //       currentTranscript !== undefined &&
        //       currentTranscript.isNewLine === true
        //     ) {
        //       setRows((rows) => [...rows, currentTranscript]);
        //     } else {
        //       // let _rows = [...rows];
        //       // rows.splice(rows.length - 1, 1);
        //       // // // _rows.pop();
        //       // rows.pop();
        //       // rows.push(currentTranscript);
        //       // // // _rows.push(currentTranscript);
        //       // setRows((rows) => [...rows, currentTranscript]);
        //     }
        //   }, 100);
        //   // }
        //   setAtBottom(bottom);
        // }}
      />
    </Paper>
  );
};
export default VirtualizedTableWithTestData;
