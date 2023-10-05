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

export class FeedDataVO {
  constructor(id, text, pageNumber, lineNumber, timeStamp, isNewLine = true) {
    this.id = id;
    this.text = text;
    this.pageNumber = parseInt(pageNumber);
    this.lineNumber = parseInt(lineNumber);
    this.timeStamp = timeStamp;
    this.isNewLine = isNewLine;
  }
}
