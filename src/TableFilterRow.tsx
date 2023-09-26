import React from "react";
import { MTableBody } from "material-table";

// FIXME: having issues with correct typing
const TableFilterRow = ({ props }: any) => {
  return (
    <div className="table-filter-row">
      <props.components.FilterRow
        columns={props.columns.filter((columnDef: any) => !columnDef.hidden)}
        icons={props.icons}
        hasActions={
          props.actions.filter(
            (a: any) => a.position === "row" || typeof a === "function"
          ).length > 0
        }
        actionsColumnIndex={props.options.actionsColumnIndex}
        onFilterChanged={props.onFilterChanged}
        selection={props.options.selection}
        localization={{
          ...(MTableBody as any).defaultProps.localization.filterRow,
          ...props.localization.filterRow,
          dateTimePickerLocalization:
            props.localization.dateTimePickerLocalization
        }}
        hasDetailPanel={!!props.detailPanel}
        detailPanelColumnAlignment={props.options.detailPanelColumnAlignment}
        isTreeData={props.isTreeData}
        filterCellStyle={props.options.filterCellStyle}
        filterRowStyle={props.options.filterRowStyle}
        hideFilterIcons={props.options.hideFilterIcons}
        scrollWidth={props.scrollWidth}
      />
    </div>
  );
};

export default TableFilterRow;
