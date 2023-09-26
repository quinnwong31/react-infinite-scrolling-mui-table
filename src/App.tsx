import { ThemeProvider } from "@material-ui/core";
import * as React from "react";
import "./styles.css";
import Table from "./Table";
import Theme from "./theme";

export default function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Table />
    </ThemeProvider>
  );
}
