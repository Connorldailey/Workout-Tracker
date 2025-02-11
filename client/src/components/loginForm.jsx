import { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const LoginForm = () => {
    const [userFormData, setUserFormData] = useState({ email: '', password: '' });
    const [validated, setValidated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [ error, setError ] = useState(null);
    const [loading, setLoading] = useState(false);

    const [loginUser] = useMutation(LOGIN_USER);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });

        setShowAlert(false);
        setError(null);
        setValidated(false);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
    
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        setLoading(true);
        setShowAlert(false);
        setValidated(false);

        try {
            const { data } = await loginUser({
                variables: { email: userFormData.email, password: userFormData.password }
            });

            if (!data) {
                throw new Error('Something went wrong!');
            }

            setTimeout(() => {
            Auth.login(data.login.token);
            }, 500);
        } catch (err) {
            console.error(err);
            setError("Something went wrong with your login credentials!");
            setTimeout(() => {
            setShowAlert(true);
            }, 1000);
        } finally {
            setTimeout(() => {
                setLoading(false);
                setValidated(true);
            }, 500);
        }

        setUserFormData({
            email: '',
            password: '',
        });
    };

    return (
        <>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
                    Something went wrong with your login credentials!
                </Alert>

                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='email'>Email</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Your email'
                        name='email'
                        onChange={handleInputChange}
                        value={userFormData.email || ''}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='password'>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Your password'
                        name='password'
                        onChange={handleInputChange}
                        value={userFormData.password || ''}
                        required
                    />
                    <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
                </Form.Group>
                
                <Button disabled={loading || !(userFormData.email && userFormData.password)} type='submit' variant='success'>
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Submit'}
                </Button>
            </Form>
        </>
    );
};

export default LoginForm;
