import * as React from 'react';
import { getAccessToken } from '../../api';
import { getMessages, getUserProfile } from '../../api';
import { useHistory } from 'react-router';
import { useQuery } from 'react-query';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import MessageListRow from './MessageListRow';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';

const MessageList: React.FC = () => {
  const accessToken = getAccessToken();
  const history = useHistory();

  const { data: user } = useQuery(
    ['user', 'me'],
    ({ queryKey }) => getUserProfile(queryKey[1]),
    { enabled: !!accessToken, staleTime: 30 * 60 * 1000, cacheTime: Infinity }
  );

  const userId = user?.emailAddress;

  const {
    data: messagesListData,
    isLoading,
    isError,
    error,
  } = useQuery(
    ['messages', { userId }],
    ({ queryKey }) => {
      const { userId } = queryKey[1] as {
        userId: string;
      };
      return getMessages(userId);
    },
    {
      enabled: !!userId,
      refetchInterval: 2.5 * 60 * 1000, // 2.5 min
    }
  );

  const handleRowClick = (messageId: string) => {
    history.push(`/message/${messageId}`);
  };

  return (
    <Container>
      {/* eslint-disable-next-line no-constant-condition */}

      {messagesListData ? (
        <Row>
          <Col>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th style={{ maxWidth: '50px' }}>#</th>
                  <th>Id</th>
                  <th>From</th>
                  <th>Subject</th>
                </tr>
              </thead>
              <tbody>
                {(messagesListData?.messages || []).map((message, idx) => {
                  return (
                    <tr
                      key={`message:${message.id}`}
                      onClick={() => {
                        handleRowClick(message.id);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ maxWidth: '50px' }}>{idx + 1}</td>
                      <td>{message.id}</td>
                      <MessageListRow
                        messageId={message.id}
                        userId={user?.emailAddress || ''}
                      />
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      ) : isLoading ? (
        <Row className="justify-content-md-center">
          <Spinner animation="grow" />
        </Row>
      ) : isError ? (
        <Alert variant="danger">
          <Alert.Heading>Error!</Alert.Heading>
          {(error as Error).message}
        </Alert>
      ) : null}
    </Container>
  );
};

export default MessageList;
