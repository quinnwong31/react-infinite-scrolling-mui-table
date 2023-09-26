import { ListProps } from "react-virtualized";
import { MaterialTableProps } from "material-table";

export interface TableBodyProps extends MaterialTableProps<any>, ListProps {
  tableHeight: number;
  headerHeight: number;
  tableWidth: number;
  scrollIndex: number;
}
