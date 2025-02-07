import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import backgroundImage from '../assets/—Pngtree—3d rendered gym equipment against_11966449.jpg';

const CoverPage = () => {
    return (
        <div
            className="d-flex justify-content-center align-items-center vh-100 bg-image"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                imageRendering: 'crisp-edges'
            }}
        >
            <h1 className="text-white text-center fw-bold">
                Stay Active. Stay Strong. <br />
                Track your workouts with us! Just Log in or Signup!
            </h1>
        </div>
    );
};

export default CoverPage;
