import Auth from '../utils/auth';
import CoverPage from '../components/CoverPage';

const Homepage = () => {
    return (
        <>
            {Auth.loggedIn() ? (
                <>
                    <HomePanel />
                </>
            ) : (
                <>
                    <CoverPage />
                </>
            )}
        </>
    );
};

export default Homepage;
