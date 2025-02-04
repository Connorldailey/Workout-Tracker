import Auth from '../utils/auth';

const Homepage = () => {
    return (
        <>
            {Auth.loggedIn() ? (
                <p>Logged In</p>
            ) : (
                <p>Logged Out</p>
            )}
        </>
    )
}

export default Homepage;