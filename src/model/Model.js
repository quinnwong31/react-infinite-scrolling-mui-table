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

export const TRANSCRIPTS_DISABLED = 0;
export const REALTIME_TRANSCRIPTS_ENABLED = 1;
export const VOICETOTEXT_TRANSCRIPTS_ENABLED = 2;
export class Model {
  constructor() {
    // Application State
    this.myContact = null;
    this.me = null;
    this.initialized = false;
    this.isAuthenticated = false;
    this.isArchive = false;
    this.hasRecording = false;
    this.isProcessed = false;
    this.streamTextEvent = null;
    this.isStreaming = false;
    this.currentTranscriptStatus = "waiting";

    // The Event
    this.eventId = -1;
    this.event = null;
    this.transcripts = 0; // 0 | 1
    this.transcriptId = -1;
    this.myTranscript = null;
    this.transcriptBookmarkId = -1;
    this.myTranscriptBookmarks = null;

    // Transcript Viewer State
    this.lines = [];
    this.eventCode = "";
    this.lastPosition = 0;
    this.witnessIndex = 0; // How does this get populated?
    this.currentLine = 0;
    this.currentPage = 0;
    this.eventCode = "TEST_EVENT_CODE";
    this.pageLineMaxHash = [];
    this.transcript = [];
    this.transcriptBookmarks = [];
    this.colors = [];
    this.transcriptSpeakerMapping = [];

    // Permissions
    this.permissions = null;
    this.isAdmin = false;
    this.isHost = false;
    this.role = "participant";
    this.grantSaveTranscripts = false;
    this.grantViewTranscripts = true;
    this.currentTranscriptStatus = "not-started";
  }
}
