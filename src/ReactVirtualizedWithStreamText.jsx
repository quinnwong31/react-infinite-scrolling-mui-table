import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import { Box, Button, Checkbox, FormControlLabel, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Column, Table } from "react-virtualized";
import "react-virtualized/styles.css"; // only needs to be imported once
import { useStreamTextContext } from "./services/StreamTextService";
import ViewerMenu from "./components/viewerMenu/ViewerMenu";

/**
 * @returns
 */
const ReactVirtualizedWithTestData = () => {
  const tableRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const showButtonTimeoutRef = useRef(null);
  const [showButton, setShowButton] = useState(false);
  const [index, setIndex] = useState(0);
  const [autoscroll, setAutoscroll] = useState(false);
  const [pageOptions, setPageOptions] = useState([]);
  const [lineOptions, setLineOptions] = useState([]);
  const [selectedPageNumber, setSelectedPageNumber] = useState(1);
  const [selectedLineNumber, setSelectedLineNumber] = useState(1);

  const [showPagesAndLines, setShowPagesAndLines] = React.useState(false);
  const [showTime, setShowTime] = React.useState(true);
  const [backgroundColor, setBackgroundColor] = React.useState("white");
  const [fontColor, setFontColor] = React.useState("black");
  const [fontSize, setFontSize] = React.useState("12pt");
  const [isFontSizeChanged, setIsFontSizeChanged] = React.useState(false);

  const {
    data,
    loadStreamTextTestData,
    startStreamTextTranscript,
    stopStreamTextTranscript,
    getStreamTextTranscript,
  } = useStreamTextContext();

  /**
   *
   */
  React.useEffect(() => {
    // generateTestData();
    const init = async () => {
      const testData = await loadStreamTextTestData();
    };
    init();
  }, []);

  /**
   *
   */
  React.useEffect(() => {
    clearTimeout(showButtonTimeoutRef.current);
    if (!atBottom) {
      showButtonTimeoutRef.current = setTimeout(() => setShowButton(true), 500);
    } else {
      setShowButton(false);
    }
  }, [atBottom, setShowButton]);

  /**
   * Update the transcripts displayed.
   */
  React.useEffect(() => {
    // console.log("XXXXX streamText.lastRow", data?.transcript?.length);
    setVisibleRows(data.transcript);

    // If autoscroll is enabled, then scroll to last item.
    if (autoscroll) {
      tableRef.current.scrollToRow(visibleRows.length - 1);
    }

    // Update page and line options
    updatePageAndLineOptions();
  }, [data?.transcript?.length]);

  /**
   * Update the array of page and line options.
   */
  const updatePageAndLineOptions = () => {
    let maxL = 0;
    const po = new Map();
    data.transcript.forEach((tr) => {
      const pageNum = parseInt(tr.pageNumber);
      if (!po.has(pageNum))
        po.set(
          pageNum,
          <option key={pageNum} value={pageNum}>
            {pageNum}
          </option>
        );

      if (maxL < parseInt(tr.lineNumber)) maxL = parseInt(tr.lineNumber);
    });
    setPageOptions(Array.from(po.values()));

    var lo = [];
    for (let i = 1; i <= maxL; i++) {
      lo.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    setLineOptions(lo);
  };

  /**
   * Handle starting / stopping the transcripts.
   */
  const handleOnClick = async () => {
    setIsStarted(!isStarted);
    if (!isStarted) {
      await startStreamTextTranscript();
    } else {
      await stopStreamTextTranscript();
    }
  };

  /**
   * Handle enabling / disabling autoscroll.
   *
   * @param {*} e
   */
  const handleAutoScrollChanged = (e) => {
    setAutoscroll(e.target.checked);
  };

  /**
   * Scroll to page and line number.
   *
   * @param {*} pageNumber
   * @param {*} lineNumber
   */
  const scrollToPageAndLine = (pageNumber, lineNumber) => {
    console.log("XXXXX scrollToPageAndLineNumber", pageNumber, lineNumber);
    const index = data.transcript.findIndex(
      (row) =>
        row.pageNumber === parseInt(pageNumber) &&
        row.lineNumber === parseInt(lineNumber) // Scroll to the first line for this page.
    );
    console.log("XXXXX index", index);
    if (index !== -1) tableRef.current.scrollToRow(index);
  };

  /**
   *
   * @param {*} pageNumber
   * @param {*} lineNumber
   */
  const onScrollToLineChange = (pageNumber, lineNumber) => {
    scrollToPageAndLine(pageNumber, lineNumber);
  };

  /**
   *
   * @param {*} pageNumber
   * @param {*} lineNumber
   */
  const onScrollToPageChange = (pageNumber, lineNumber) => {
    scrollToPageAndLine(pageNumber, lineNumber);
  };

  /**
   *
   * @param {*} text
   * @returns
   */
  const convertToHtmlText = (text) => {
    if (text === undefined) return;
    // console.log("XXXX convertToHtmlText", text);
    let htmlText = text.split(" ").join("&nbsp;");
    htmlText = htmlText.replaceAll("\n", "<br/>");
    htmlText = htmlText.replaceAll("Q.", "<b>Q.</b>");
    htmlText = htmlText.replaceAll("A.", "<b>A.</b>");
    // htmlText = htmlText.trim();
    return htmlText;
  };

  return (
    <Paper style={{ height: "100vh", width: "100vw" }}>
      <Box
        display="flex"
        flexDirection="row"
        style={{ margin: 20, justifyContent: "space-between" }}
      >
        <Box display="flex" flexDirection="row">
          <ViewerMenu
            onBackgroundColorChange={(bgColor) => {
              setBackgroundColor(bgColor);
            }}
            onFontColorChange={(fontColor) => setFontColor(fontColor)}
            onFontSizeChange={(fontSize) => {
              setFontSize((prevFontSize) => {
                if (prevFontSize !== fontSize) {
                  setIsFontSizeChanged(true);
                }
                return fontSize;
              });
            }}
            // onEnableAutoscrollChange={(enableAutoscroll) =>
            //   setEnableAutoscroll(enableAutoscroll)
            // }
            onShowPagesAndLinesChange={(showPagesAndLines) =>
              setShowPagesAndLines(showPagesAndLines)
            }
            onShowTimeChange={(showTime) => setShowTime(showTime)}
            onScrollToPageChange={onScrollToPageChange}
            onScrollToLineChange={onScrollToLineChange}
            pageOptions={[...pageOptions]}
            lineOptions={[...lineOptions]}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={autoscroll}
                onChange={handleAutoScrollChanged}
              />
            }
            label="Auto-Scroll"
            style={{ marginLeft: 20 }}
          />
        </Box>
        <Box>
          <Button variant="contained" onClick={handleOnClick}>
            {!isStarted ? "Start" : "Stop"}
          </Button>
        </Box>
      </Box>

      <Table
        ref={tableRef}
        width={1000}
        height={800}
        // autoHeight={true}
        headerHeight={35}
        rowHeight={35}
        rowCount={visibleRows.length}
        rowGetter={({ index }) => visibleRows[index]}
        scrollToRow={visibleRows.length - 1}
        scrollToAlignment="center"
        onRowClick={() => setAutoscroll(false)}
      >
        <Column
          label="Actions"
          width={150}
          cellRenderer={() => <TranscriptActionButton />}
          style={{ fontSize: fontSize }}
        />
        {showPagesAndLines && (
          <Column
            label="Page"
            dataKey="pageNumber"
            width={100}
            style={{ fontSize: fontSize }}
          />
        )}
        {showPagesAndLines && (
          <Column
            label="Line"
            dataKey="lineNumber"
            width={100}
            style={{ fontSize: fontSize }}
          />
        )}
        <Column
          label="Text"
          dataKey="text"
          width={600}
          style={{ textAlign: "left", fontSize: fontSize }}
          cellRenderer={(props) => {
            console.log("XXXXX cellRenderer", props);
            return (
              <div
                dangerouslySetInnerHTML={{
                  __html: convertToHtmlText(props.cellData),
                }}
              />
            );
          }}
        />
        {showTime && (
          <Column
            label="Time"
            dataKey="timeStamp"
            width={200}
            style={{ fontSize: fontSize }}
          />
        )}
      </Table>
    </Paper>
  );
};

const TranscriptActionButton = (props) => {
  return <AddIcon color="primary" fontSize="small" />;
};
export default ReactVirtualizedWithTestData;
