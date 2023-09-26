import React, { useCallback } from "react";
import { AutoSizer, List, ListRowRenderer } from "react-virtualized";
import { MTableBodyRow } from "material-table";
import { TableBodyProps } from "./Table.types";
import TableFilterRow from "./TableFilterRow";
import "react-virtualized/styles.css";

//FIXME wrong dom elements nesting: table > div > ...
const TableBody = (props: TableBodyProps) => {
  const rowRenderer = useCallback(
    (props: TableBodyProps): ListRowRenderer => ({ index, key, style }) => {
      return (
        <div
          key={key}
          style={{ ...style, display: "table", tableLayout: "fixed" }}
        >
          <MTableBodyRow
            key={key}
            index={index}
            data={props.renderData[index]}
            options={props.options}
            onToggleDetailPanel={props.onToggleDetailPanel}
            icons={props.icons}
            actions={props.actions}
            components={props.components}
            columns={props.columns}
            getFieldValue={props.getFieldValue}
            onRowClick={props.onRowClick}
          />
        </div>
      );
    },
    []
  );
  return (
    <tbody>
      {props.options?.filtering && <TableFilterRow props={props} />}
      <AutoSizer>
        {() => (
          <List
            rowCount={props.renderData.length}
            // fix height calculation
            height={props.tableHeight - 4 * props.headerHeight}
            width={props.tableWidth}
            rowHeight={50}
            rowRenderer={rowRenderer(props)}
            scrollToIndex={props.scrollIndex}
            overscanRowCount={10}
          />
        )}
      </AutoSizer>
    </tbody>
  );
};

export default TableBody;
