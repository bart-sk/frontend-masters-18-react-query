import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  GoogleLogout,
} from 'react-google-login';
import { Home } from '../Home';
import { LinkContainer } from 'react-router-bootstrap';
import { Route } from 'react-router-dom';
import {
  getAccessToken,
  getUserProfile,
  removeAccessToken,
  setApiAccessToken,
} from '../../api';
import { useQuery } from 'react-query';
import Alert from 'react-bootstrap/Alert';
import AppContext from '../../context';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Message from '../Message';
import MessageList from '../MessageList';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

const GOOGLE_OAUTH_SCOPES = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly',
];

const App: React.FC = () => {
  const [accessToken, setAccessToken] = React.useState('');

  const {
    data: user,
    isFetchedAfterMount,
    isLoading,
  } = useQuery(['user', 'me'], ({ queryKey }) => getUserProfile(queryKey[1]), {
    enabled: !!accessToken, // request na usra sa pusti, len ak mame accessToken
    staleTime: 30 * 60 * 1000, // 30 minut (v response chodi aj celkovy pocet mailov
    // tak podla potrieb to moze byt aj 0.
    cacheTime: Infinity, // data budu v cache do nekonecna, nakolko ich
    // potrebujeme v kadzej obrazovke ...
  });

  const handleSuccess = (
    c: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    const response = c as GoogleLoginResponse;
    setAccessToken(response.tokenObj.access_token);
    setApiAccessToken(response.tokenObj.access_token);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (e: any) => {
    console.log(e);
  };

  const handleLogout = () => {
    removeAccessToken();
    window.location.reload(); // po odhlaseni refreshneme
  };

  React.useEffect(() => {
    const accessToken = getAccessToken();
    if (accessToken) {
      setAccessToken(accessToken);
    }
  }, []);

  return (
    <>
      <Navbar bg="dark" expand="lg" className="mb-2" variant="dark">
        <Navbar.Brand href="#home">
          <img
            src="/logo--symbol-white.png"
            width="30"
            height="30"
            className="d-inline-block align-top mr-2"
            alt="Bart logo"
          />
          {/* FM vol. 18 */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/messages">
              <Nav.Link>Messages</Nav.Link>
            </LinkContainer>
          </Nav>
          {!accessToken ? (
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID ?? ''}
              buttonText="Login"
              onSuccess={handleSuccess}
              onFailure={handleError}
              cookiePolicy={'single_host_origin'}
              scope={GOOGLE_OAUTH_SCOPES.join(' ')}
            />
          ) : (
            <div>
              <GoogleLogout
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID ?? ''}
                buttonText="Logout"
                onLogoutSuccess={handleLogout}
              />
            </div>
          )}
        </Navbar.Collapse>
      </Navbar>
      {user?.emailAddress ? (
        <AppContext.Provider value={{ accessToken }}>
          <Route exact path="/" component={Home} />
          <Route exact path="/messages" component={MessageList} />
          <Route exact path="/message/:messageId" component={Message} />
        </AppContext.Provider>
      ) : (
        <Container>
          <Row>
            <Col>
              {!accessToken || (isFetchedAfterMount && !isLoading) ? (
                <Alert variant="success">
                  <Alert.Heading>Please, log in!</Alert.Heading>
                  <p>
                    If you want to see react-query example, please, sign in with
                    your google account.
                  </p>
                </Alert>
              ) : null}
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default App;
