import React, { useState } from "react";
import MaterialTable, { MTableHeader, MTableFilterRow } from "material-table";
import TableBody from "./TableBody";
import { useDimensions } from "./useDimensions";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { Button } from "@material-ui/core";

const randomizeText = () => Math.random().toString(36).substring(7);

export const columnStyle = (
  width: CSSProperties["width"] = "",
  align?: CSSProperties["textAlign"],
  firstCol?: boolean
): CSSProperties => ({
  width: width,
  maxWidth: width,
  cellStyle: {
    width: width,
    maxWidth: width,
    textAlign: align,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    paddingLeft: firstCol ? "1rem" : "auto"
  },
  headerStyle: {
    width: width,
    maxWidth: width,
    textAlign: align,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    paddingLeft: firstCol ? "1rem" : "auto"
  },
  filterCellStyle: {
    width: width,
    maxWidth: width,
    textAlign: align,
    position: "sticky",
    top: "41px", // header height
    backgroundColor: "white"
  }
});

const tableColumns = [
  { title: "No", field: "id", ...columnStyle("10%", "center") },
  { title: "Name", field: "name", ...columnStyle("25%") },
  { title: "Surname", field: "surname", ...columnStyle("25%") },
  {
    title: "Birth Year",
    field: "birthYear",
    ...columnStyle("15%", "center")
  },
  {
    title: "Birth City",
    field: "birthCity",
    ...columnStyle("15%")
  }
];

const tableData = [...Array(10000)].map((_, index) => ({
  id: index,
  name:
    randomizeText() + "- the following text is truncated very very very well",
  surname: randomizeText(),
  birthYear: 2000 + index,
  birthCity: randomizeText()
}));

const Table = () => {
  const [
    tableRef,
    { width: tableWidth, height: tableHeight }
  ] = useDimensions();
  const [tableHeaderRef, { height: tableHeaderHeight }] = useDimensions();
  const [scrollIndex, setScrollIndex] = useState<number>();
  let testIndex = 100;
  const handleScrollToIndex = () => {
    setScrollIndex(testIndex); //FIXME doesn't work, index rows are not kept after sorting/filtering
  };
  return (
    <div ref={tableRef} s>
      <MaterialTable
        title="Virtualized material-table"
        columns={tableColumns}
        data={tableData}
        options={{
          paging: false,
          filtering: true,
          searchFieldAlignment: "left",
          minBodyHeight: "85vh", //FIXME to calculate dynamic height, needed for correct scroll position identification
          maxBodyHeight: "85vh"
        }}
        icons={
          { SortArrow: () => <></> } as Record<string, () => JSX.Element> // hides sort icons because of limited table space
        }
        components={{
          Body: (props) => (
            <TableBody
              {...props}
              headerHeight={tableHeaderHeight}
              tableWidth={tableWidth}
              tableHeight={tableHeight}
              scrollIndex={scrollIndex}
            />
          ),
          Header: (props) => (
            <div ref={tableHeaderRef} className="table-header-row">
              <MTableHeader {...props} />
            </div>
          )
        }}
      />
      <Button onClick={handleScrollToIndex}>
        Scroll to index ({testIndex})
      </Button>
    </div>
  );
};

export default Table;
