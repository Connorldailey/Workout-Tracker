import Auth from '../utils/auth';
import CoverPage from '../components/CoverPage';
import HomePanel from '../components/HomePanel';

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
