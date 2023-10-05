/**
////////////////////////////////////////////////////////////////////////////////
//
// HUSEBY INC
// Copyright 2021 Huseby, Inc.
// All Rights Reserved.
//
// NOTICE: Huseby, Inc permits you to use this file in in accordance with the terms
// of the license agreement accompanying it.  Do not modify, sell or distribute
// without the expressed, written consent of Huseby, Inc.
//
////////////////////////////////////////////////////////////////////////////////
*/

import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SplitButton from "./SplitButton";

const themeTypes = [
  { value: "#FFFFFF-#000000", label: "White (B)" },
  { value: "#666666-#000000", label: "Grey (B)" },
  { value: "#111111-#FFFFFF", label: "Black (W)" },
  { value: "#111111-#FFFFCC", label: "Black (Y)" },
  { value: "#663300-#FFFFCC", label: "Sepia (Y)" },
  { value: "#1111FF-#FFFFCC", label: "Blue (Y)" },
];

const fontSizes = [
  { value: "10pt", label: "10 pt" },
  { value: "12pt", label: "12 pt" },
  { value: "14pt", label: "14 pt" },
  { value: "16pt", label: "16 pt" },
];

const useStyles = makeStyles((theme) => ({
  menuItem: {
    paddingLeft: "0px",
    paddingRight: "10px",
  },
  menuItemSmall: {
    paddingLeft: "0px",
    paddingRight: "10px",
    display: "inline-flex",
    justifyContent: "flex-end",
    width: "100%",
  },
}));

const ViewerMenu = ({
  onBackgroundColorChange,
  onFontColorChange,
  onFontSizeChange,
  onShowPagesAndLinesChange,
  onShowTimeChange,
  onScrollToPageChange,
  onScrollToLineChange,
  pageOptions,
  lineOptions,
}) => {
  const classes = useStyles();
  const [optionsAnchorEl, setOptionsAnchorEl] = useState(false);
  const [currentPageOptions, setCurrentPageOptions] = useState([]);
  const [currentLineOptions, setCurrentLineOptions] = useState([]);
  const [enableAutoscroll, setEnableAutoscroll] = React.useState(true);
  const [showPagesAndLines, setShowPagesAndLines] = React.useState(false);
  const [showTime, setShowTime] = React.useState(true);
  const [selectedPageLine, setSelectedPageLine] = React.useState({
    page: 1,
    line: 1,
  });

  useEffect(() => {
    if (optionsAnchorEl !== false) {
      setCurrentPageOptions(pageOptions);
      setCurrentLineOptions(lineOptions);
    }
  }, [optionsAnchorEl]);

  const handleThemeChange = (selectedTheme) => {
    const theme = String(selectedTheme.value).split("-");
    onBackgroundColorChange(theme[0]);
    onFontColorChange(theme[1]);
  };

  const handleShowPagesAndLinesChange = (e) => {
    setShowPagesAndLines(e.target.checked);
    onShowPagesAndLinesChange(e.target.checked);
  };

  const handleShowTimeChange = (e) => {
    setShowTime(e.target.checked);
    onShowTimeChange(e.target.checked);
  };

  const handleFontSizeChange = (fontSize) => {
    console.log("handleFontSizeChange", fontSize.value);
    const size = fontSize.value;
    // setFontSize(size);
    onFontSizeChange(size);
  };

  const handleScrollToPage = (e) => {
    const pageNumber = e.currentTarget.value;
    setSelectedPageLine({
      ...selectedPageLine,
      page: pageNumber,
    });
    onScrollToPageChange(pageNumber, selectedPageLine.line);
  };

  const handleScrollToLine = (e) => {
    // console.log('handleScrollToLine', e.currentTarget.value);
    const lineNumber = e.currentTarget.value;
    setSelectedPageLine({
      ...selectedPageLine,
      line: lineNumber,
    });
    onScrollToLineChange(selectedPageLine.page, lineNumber);
  };

  return (
    <>
      <Box component="div" display="flex" style={{ margin: 15 }}>
        <Tooltip title="Viewing Options">
          <IconButton
            variant="contained"
            onClick={(e) => setOptionsAnchorEl(e.currentTarget)}
            size="small"
          >
            {/* View Options */}
            <MenuIcon variant="contained" color="primary" />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        id="customized-menu"
        anchorEl={optionsAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: -45,
          horizontal: 130,
        }}
        keepMounted
        open={Boolean(optionsAnchorEl)}
        onClose={() => setOptionsAnchorEl(null)}
      >
        {/* <MenuItem
                    ref={(node) => {
                      if (node) {
                        node.style.setProperty("position", "static", "important");
                      }
                    }}
                  >
                    <span style={{ paddingRight: "10px" }}>Viewer Theme:</span>
                    <span className={classes.menuItemSmall} id="transcriptManagementColor">
                      <SplitButton options={themeTypes} onChange={handleThemeChange} />
                    </span>
                  </MenuItem> */}
        <MenuItem
          ref={(node) => {
            if (node) {
              node.style.setProperty("position", "static", "important");
            }
          }}
        >
          <span style={{ paddingRight: "10px" }}>Font Size:</span>
          <span
            className={classes.menuItemSmall}
            id="transcriptManagementFontSize"
          >
            <SplitButton options={fontSizes} onChange={handleFontSizeChange} />
          </span>
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                onChange={handleShowPagesAndLinesChange}
                name="checkboxShowPagesAndLines"
              />
            }
            checked={showPagesAndLines}
            label="Display Page and Lines Column"
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                onChange={handleShowTimeChange}
                name="checkboxShowTime"
              />
            }
            checked={showTime}
            label="Display Time Column"
          />
        </MenuItem>
        <MenuItem>
          <span style={{ paddingRight: "10px" }}>Go To Page Number:</span>
          <span className={classes.menuItemSmall}>
            <Select
              className={classes.select}
              native
              inputProps={{
                classes: {
                  icon: classes.icon,
                },
              }}
              onChange={handleScrollToPage}
              color="primary"
              size="small"
            >
              {currentPageOptions}
            </Select>
          </span>
        </MenuItem>
        <MenuItem>
          <span style={{ paddingRight: "10px" }}>Go To Line:</span>
          <span className={classes.menuItemSmall}>
            <Select
              className={classes.select}
              native
              inputProps={{
                classes: {
                  icon: classes.icon,
                },
              }}
              onChange={handleScrollToLine}
              size="small"
            >
              {currentLineOptions}
            </Select>
          </span>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ViewerMenu;
