import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import React from 'react';

export const Home: React.FC = () => {
  return (
    <Container>
      <Jumbotron>
        <h1>Wellcome!</h1>
        <p>
          This is the simple example of email client, that interacts with Your
          gMail account.
        </p>
      </Jumbotron>
    </Container>
  );
};
