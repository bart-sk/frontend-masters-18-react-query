export interface UsersMessagesGetParams {
  userId: string;
  messageId: string;
}

export interface MessageListItem {
  id: string;
  threadId: string;
}

export interface MessagePayloadHeader {
  name: string;
  value: string;
}

export interface MessagePart {
  partId: string;
  mimeType: string;
  filename: string;
  headers: MessagePayloadHeader[];
  body: {
    size: string;
    data: string;
  };
}

export interface Label {
  id: string;
  name: string;
}

export interface MessageMetadata {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    mimetype: string;
    headers: MessagePayloadHeader[];
    sizeEstimate: number;
    historyId: string;
    internalDate: string;
    parts?: MessagePart[];
  };
}
