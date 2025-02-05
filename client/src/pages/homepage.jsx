import Auth from '../utils/auth';
import CoverPage from '../components/coverPage';

const Homepage = () => {
    return (
        <>
            {Auth.loggedIn() ? (
                <p>Logged In</p>
            ) : (
                <>
                    <CoverPage />
                </>
            )}
        </>
    );
};

export default Homepage;
