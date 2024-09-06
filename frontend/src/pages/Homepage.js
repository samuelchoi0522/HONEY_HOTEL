import React, { useState, useEffect } from 'react';
import '../styles/Homepage.css';

const Homepage = () => {
    const [backgroundVideo, setBackgroundVideo] = useState(true);
    const [backgroundSource, setBackgroundSource] = useState('/uploads/Landing_Video.mp4');
    const [opacity, setOpacity] = useState(1);

    const changeBackground = (isVideo, source) => {
        if (backgroundSource !== source || backgroundVideo !== isVideo) {
            setOpacity(0);
            setTimeout(() => {
                setBackgroundVideo(isVideo);
                setBackgroundSource(source);
                setOpacity(1);
            }, 500);
        }
    };
    

    return (
        <div className="homepage-container">
            {/* Video or Image */}
            <div className="video-container">
                {backgroundVideo ? (
                    <video
                        className="background-video"
                        id="mainVideo"
                        autoPlay
                        loop
                        muted
                        style={{ opacity: opacity }}
                    >
                        <source src={backgroundSource} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div
                        className="background-image"
                        style={{
                            backgroundImage: `url(${backgroundSource})`,
                            backgroundSize: 'cover',
                            height: '100%',
                            width: '100%',
                            opacity: opacity, // Bind opacity to the fade effect
                        }}
                    ></div>
                )}
            </div>

            {/* Navigation Bar */}
            <div className="navigation-bar">
                <div className="nav-item" onMouseEnter={() => changeBackground(true, '/uploads/Landing_Video.mp4')}>
                    <img src="/icons/HOTEL_RESORTS_ICON.png" alt="Hotels and Resorts" />
                    <span>HOTELS AND RESORTS</span>
                </div>
                <div className="nav-item" onMouseEnter={() => changeBackground(false, '/uploads/HOTEL_AMENITIES_PHOTO.jpeg')}>
                    <img src="/icons/AMENITIES_ICON.png" alt="AMENITIES" />
                    <span>AMENITIES</span>
                </div>
                <div className="nav-item" onMouseEnter={() => changeBackground(false, '/uploads/HOTEL_DINING_PHOTO.jpeg')}>
                    <img src="/icons/DINING_ICON.png" alt="DINING" />
                    <span>DINING</span>
                </div>
                <div className="nav-item" onMouseEnter={() => changeBackground(false, '/uploads/HOTEL_SHOPPING_PHOTO.jpeg')}>
                    <img src="/icons/SHOPPING_ICON.png" alt="SHOP" />
                    <span>SHOP</span>
                </div>
                <div className="nav-item" onMouseEnter={() => changeBackground(true, '/uploads/Landing_Video.mp4')}>
                    <img src="/icons/SIGNIN_ICON.png" alt="SIGN IN" />
                    <span>SIGN IN</span>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
