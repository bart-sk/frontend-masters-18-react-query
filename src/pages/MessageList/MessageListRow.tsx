import { UsersMessagesGetParams } from '../../library/gmail-api';
import { getAccessToken, getMessage } from '../../api';
import { useQuery } from 'react-query';
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import parseEmailData from '../../utils/parseEmailData';

interface Props {
  messageId: string;
  userId: string;
}

export const MessageListRow: React.FC<Props> = ({ messageId, userId }) => {
  const accessToken = getAccessToken();
  const { isLoading, isError, data, error } = useQuery(
    ['message', 'metadata', { userId, messageId }],
    ({ queryKey }) => {
      const { userId, messageId } = queryKey[2] as UsersMessagesGetParams;
      return getMessage(userId, messageId);
    },
    { enabled: !!accessToken && !!userId }
  );

  if (isLoading) {
    return (
      <>
        <td>
          <Spinner animation="grow" size="sm" />
        </td>
        <td>
          <Spinner animation="grow" size="sm" />
        </td>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <td>Error reading message matadata!</td>
        <td>{(error as Error).message}</td>
      </>
    );
  }

  if (data) {
    const { from, subject } = parseEmailData(data);
    return (
      <>
        <td>{from}</td>
        <td>{subject}</td>
      </>
    );
  }
  return <>???</>;
};

export default MessageListRow;
