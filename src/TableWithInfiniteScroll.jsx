import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const generateItems = (amount) => {
  const arr = Array.from(Array(amount));
  return arr.map((number, i) => ({
    id: i,
    name: `Name ${i + 1}`,
    type: `Item Type ${i + 1}`,
  }));
};

const NUM_TOTAL_ROWS = 1000000;

/**
 * @returns
 */
const TableWithInfiniteScroll = () => {
  const tableEl = useRef();
  const [rows, setRows] = useState([]);
  const [visibleRows, setVisibleRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distanceBottom, setDistanceBottom] = useState(0);
  // hasMore should come from the place where you do the data fetching
  // for example, it could be a prop passed from the parent component
  // or come from some store
  const [hasMore] = useState(true);

  React.useEffect(() => {
    generateTestData();
  }, []);

  /**
   * Generate test data by importing all the test JSON data for a real-time transcript.
   *
   */
  const generateTestData = () => {
    console.log("Generating test data...");
    const _rows = generateItems(NUM_TOTAL_ROWS);
    console.log("Test rows generated.  Number of rows = " + _rows.length);
    setRows(_rows);
    const start = 0;
    const end = 50;
    setVisibleRows(_rows.slice(start, end));
  };

  /**
   *
   */
  const loadMore = useCallback(() => {
    console.log("XXX loadMore...");
    const loadItems = async () => {
      await new Promise((resolve) =>
        setTimeout(() => {
          const amount = rows.length + 50;
          setRows(generateItems(amount));
          setLoading(false);
          resolve();
        }, 2000)
      );
    };
    setLoading(true);
    loadItems();
  }, [rows]);

  /**
   *
   */
  const scrollListener = useCallback(() => {
    let bottom = tableEl.current.scrollHeight - tableEl.current.clientHeight;
    console.log("XXX tableEl.current", tableEl.current);
    // console.log("XXXX scrollListener", bottom, tableEl.current.scrollTop);
    const PAGE_LENGTH = 100;
    // const end = Math.ceil(tableEl.current.scrollTop);
    const pos = tableEl.current.scrollTop;
    const end = Math.ceil(tableEl.current.scrollTop / 100) * 100;
    const start = end < PAGE_LENGTH ? 0 : end - PAGE_LENGTH;
    const _visibleRows = rows.slice(start, end);
    // console.log(
    //   "XXXX scrollListener",
    //   // Math.ceil(tableEl.current.scrollTop / 100) * 100,
    //   pos,
    //   start,
    //   end
    //   // _visibleRows
    // );
    if (_visibleRows.length !== 0) setVisibleRows(_visibleRows);
    // if you want to change distanceBottom every time new data is loaded
    // don't use the if statement
    /**  
    if (!distanceBottom) {
      // calculate distanceBottom that works for you
      setDistanceBottom(Math.round(bottom * 0.2));
    }
    if (
      tableEl.current.scrollTop > bottom - distanceBottom &&
      hasMore &&
      !loading
    ) {
      loadMore();
    }
    */
  }, [hasMore, loadMore, loading, distanceBottom]);

  /**
   *
   */
  useLayoutEffect(() => {
    const tableRef = tableEl.current;
    tableRef.addEventListener("scroll", scrollListener);
    return () => {
      tableRef.removeEventListener("scroll", scrollListener);
    };
  }, [scrollListener]);

  return (
    <TableContainer
      style={{ maxWidth: "100vw", margin: "auto", maxHeight: "100vh" }}
      ref={tableEl}
    >
      {loading && (
        <CircularProgress style={{ position: "absolute", top: "100px" }} />
      )}
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows?.map(({ id, name, type }) => (
            <TableRow key={id}>
              <TableCell>{name}</TableCell>
              <TableCell>{type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default TableWithInfiniteScroll;
