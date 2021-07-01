import { UsersMessagesGetParams } from '../../library/gmail-api';
import { getAccessToken } from '../../api';
import { getLabels, getMessage, getUserProfile } from '../../api';
import { useParams } from 'react-router';
import { useQuery } from 'react-query';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import React from 'react';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import getEmailLabelById from '../../utils/getEmailLabelById';
import parseEmailData from '../../utils/parseEmailData';

const Message: React.FC = () => {
  const { messageId } = useParams<{ messageId: string }>();

  const accessToken = getAccessToken();

  const { data: user } = useQuery(
    ['user', 'me'],
    ({ queryKey }) => getUserProfile(queryKey[1]),
    { enabled: !!accessToken, staleTime: 30 * 60 * 1000, cacheTime: Infinity }
  );

  const userId = user?.emailAddress;

  const { isLoading, data, isError, error } = useQuery(
    ['message', 'full', { userId: user?.emailAddress, messageId }],
    ({ queryKey }) => {
      const { userId, messageId } = queryKey[2] as UsersMessagesGetParams;
      return getMessage(userId, messageId, 'full');
    },
    {
      enabled: !!userId && !!messageId,
      // staleTime: 0
      // cacheTime: 10 * 1000, // 10 sekund
    }
  );

  const { data: labels } = useQuery(
    ['labels', { userId }],
    ({ queryKey }) => {
      const { userId } = queryKey[1] as { userId: string };
      return getLabels(userId);
    },
    {
      enabled: !!userId,
    }
  );

  const renderEmailBody = () => {
    if (data && data.payload.parts) {
      const email = parseEmailData(data);
      return (
        <Row>
          <Col>
            <Card>
              <Card.Body>
                {labels &&
                  labels.labels.length > 0 &&
                  email.labelIds.map((labelId) => {
                    const l = getEmailLabelById(labelId, labels.labels ?? []);
                    return l ? (
                      <Badge
                        key={`label-pill:${labelId}`}
                        pill
                        variant="info"
                        className="mr-1"
                      >
                        {l.name}
                      </Badge>
                    ) : null;
                  })}

                <Card.Title>{email.subject}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {email.from}
                </Card.Subtitle>
                <div>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{email.body}</pre>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      );
    }
    return null;
  };

  return (
    <Container>
      {data && data.payload.parts ? (
        renderEmailBody()
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

export default Message;
