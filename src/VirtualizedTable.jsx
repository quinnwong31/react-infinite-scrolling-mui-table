import React, { useState, useRef, useLayoutEffect, useCallback } from "react";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { TableVirtuoso, TableComponents } from "react-virtuoso";

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
const VirtualizedTable = () => {
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
   * Columns
   */
  const columns = [
    {
      width: 400,
      label: "Name",
      dataKey: "name",
    },
    {
      width: 400,
      label: "Type",
      dataKey: "type",
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
  function rowContent(_index, row) {
    return (
      <React.Fragment>
        {columns.map((column) => (
          <TableCell key={column.dataKey}>{row[column.dataKey]}</TableCell>
        ))}
      </React.Fragment>
    );
  }

  return (
    <Paper style={{ height: 800, width: "100%" }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
};
export default VirtualizedTable;
