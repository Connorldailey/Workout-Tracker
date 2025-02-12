import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './signupForm';
import LoginForm from './loginForm';
import Auth from '../utils/auth';

// Manage modal visibility state
const AppNavbar = () => {
    const [showModal, setShowModal] = useState(false);

    // Render Navbar with conditional links based on user authentication and login/signup modal
    return (
        <>
            <Navbar bg='dark' variant='dark' expand='md'>
                <Container fluid>
                    <Navbar.Brand as={Link} to='/'>
                        Workout Tracker
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls='navbar' />
                    <Navbar.Collapse id='navbar'>
                        <Nav className='ms-auto d-flex'>
                            {Auth.loggedIn() ? (
                                <div className='d-flex flex-column flex-md-row align-items-center'>
                                    <Nav.Link as={Link} to='/'>Home</Nav.Link>
                                    <Nav.Link as={Link} to='/explore'>Explore</Nav.Link>
                                    <Nav.Link as={Link} to='/routines'>Routines</Nav.Link>
                                    <Nav.Link as={Link} to='/history'>History</Nav.Link>
                                    <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                                </div>
                            ) : (
                                <Nav.Link onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Modal
                size='lg'
                show={showModal}
                onHide={() => setShowModal(false)}
                aria-labelledby='signup-modal'>
                {/* tab container to do either signup or login component */}
                <Tab.Container defaultActiveKey='login'>
                    <Modal.Header closeButton>
                        <Modal.Title id='signup-modal'>
                            <Nav variant='pills'>
                                <Nav.Item>
                                    <Nav.Link eventKey='login'>Login</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tab.Content>
                            <Tab.Pane eventKey='login'>
                                <LoginForm handleModalClose={() => setShowModal(false)} />
                            </Tab.Pane>
                            <Tab.Pane eventKey='signup'>
                                <SignUpForm handleModalClose={() => setShowModal(false)} />
                            </Tab.Pane>
                        </Tab.Content>
                    </Modal.Body>
                </Tab.Container>
            </Modal>
        </>
    );
};

export default AppNavbar;