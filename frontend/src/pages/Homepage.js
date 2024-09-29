import React, { useState, useEffect } from 'react';
import '../styles/Homepage.css';

const Homepage = () => {
    const [backgroundVideo, setBackgroundVideo] = useState(true);
    const [backgroundSource, setBackgroundSource] = useState('/uploads/Landing_Video (1).mp4');
    const [opacity, setOpacity] = useState(0.7);

    const changeBackground = (isVideo, source) => {
        if (backgroundSource !== source || backgroundVideo !== isVideo) {
            setOpacity(0);
            setTimeout(() => {
                setBackgroundVideo(isVideo);
                setBackgroundSource(source);
                setOpacity(0.7);
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
                            opacity: opacity,
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

            {/* Spacer */}
            <div className="spacer" style={{ height: '250px' }}></div>

            <div className="lower-homepage-container">
                <div className="explore-more-with-honeyhotel-container">
                    <span className="explore-more-with-hotelhotel-text">{`EXPLORE MORE WITH HONEY HOTEL`}</span>
                </div>

                <div className="image-grid">
                    <div className="shopping-image-646482">
                        <img
                            src="/uploads/HOMEPAGE_SHOPPING_IMAGE.png"
                            alt="Shopping Image"
                        />
                        <div className="image-caption">
                            <h3>DISCOVER OUR STORES</h3>
                            <p>PARTICIPATE IN OUR ENGAGING AND UNIQUE ACTIVITIES</p>
                        </div>
                    </div>
                    <div className="restuarant-imag-646466">
                        <img
                            src="/uploads/HOMEPAGE_RESTAURANT_IMAGE.png"
                            alt="Restaurant Image"
                        />
                        <div className="image-caption">
                            <h3>DISCOVER OUR MICHELIN STAR RESTAURANTS</h3>
                            <p>EXPLORE OUR GROWING COLLECTION OF AWARD WINNING RESTAURANTS</p>
                        </div>
                    </div>
                    <div className="activities-imag-646479">
                        <img
                            src="/uploads/HOMEPAGE_ACTIVITIES_IMAGE.png"
                            alt="Activities Image"
                        />
                        <div className="image-caption">
                            <h3>DISCOVER OUR ACTIVITIES</h3>
                            <p>PARTICIPATE IN OUR ENGAGING AND UNIQUE ACTIVITIES</p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Homepage;

