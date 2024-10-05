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

    useEffect(() => {
        //load instagrams embed.js script
        const script = document.createElement('script');
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);


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
                    <span>ACCOUNT</span>
                </div>
            </div>

            {/* Spacer */}
            <div className="spacer" style={{ height: '250px' }}></div>

            <div className="lower-homepage-container">
                <div className="explore-more-with-honeyhotel-container">
                    <span className="explore-more-with-hotelhotel-text">{`EXPLORE MORE WITH HONEY HOTEL`}</span>
                </div>

                <div className="image-grid">
                    <div className="shopping-image">
                        <img
                            src="/uploads/HOMEPAGE_SHOPPING_IMAGE.png"
                            alt="Shopping"
                        />
                        <div className="image-caption">
                            <h3>DISCOVER OUR STORES</h3>
                            <p>PARTICIPATE IN OUR ENGAGING AND UNIQUE ACTIVITIES</p>
                        </div>
                    </div>
                    <div className="restuarant-imag">
                        <img
                            src="/uploads/HOMEPAGE_RESTAURANT_IMAGE.png"
                            alt="Restaurant"
                        />
                        <div className="image-caption">
                            <h3>DISCOVER OUR MICHELIN STAR RESTAURANTS</h3>
                            <p>EXPLORE OUR GROWING COLLECTION OF AWARD WINNING RESTAURANTS</p>
                        </div>
                    </div>
                    <div className="activities-imag">
                        <img
                            src="/uploads/HOMEPAGE_ACTIVITIES_IMAGE.png"
                            alt="Activities"
                        />
                        <div className="image-caption">
                            <h3>DISCOVER OUR ACTIVITIES</h3>
                            <p>PARTICIPATE IN OUR ENGAGING AND UNIQUE ACTIVITIES</p>
                        </div>
                    </div>
                </div>

                <span className="the-story-text">{`THE STORY`}</span>
                <div className="video-wrapper">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/NpEaa2P7qZI?si=td7dVTOVEoADBofN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>

                <span className="hashtag-honeyhotel">{`#HONEYHOTEL`}</span>
                <div className="instagram-posts">
                    <div className="instagram-post" dangerouslySetInnerHTML={{
                        __html: `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DAhjS0cPPQ9/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
                <div style="padding:16px;"> 
                <a href="https://www.instagram.com/p/DAhjS0cPPQ9/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> 
                <div style=" display: flex; flex-direction: row; align-items: center;"> 
                <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> 
                <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> 
                <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> 
                <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div>
                </div></div>
                <div style="padding: 19% 0;"></div> 
                <div style="display:block; height:50px; margin:0 auto 12px; width:50px;">
                <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000">
                <g><path d="...svg path data..."></path></g></g></g></svg>
                </div><div style="padding-top: 8px;">
                <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div>
                </div><div style="padding: 12.5% 0;"></div> 
                <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;">
                <div style=" background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div>
                <div style=" background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> 
                <div style=" background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div>
                </a></blockquote>`
                    }}></div>
                    <div className="instagram-post" dangerouslySetInnerHTML={{
                        __html: `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DAhjaR6vAS4/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
                <div style="padding:16px;"> 
                <a href="https://www.instagram.com/p/DAhjaR6vAS4/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> 
                <div style=" display: flex; flex-direction: row; align-items: center;"> 
                <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> 
                <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> 
                <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> 
                <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div>
                </div></div>
                <div style="padding: 19% 0;"></div> 
                <div style="display:block; height:50px; margin:0 auto 12px; width:50px;">
                <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000">
                <g><path d="...svg path data..."></path></g></g></g></svg>
                </div><div style="padding-top: 8px;">
                <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div>
                </div><div style="padding: 12.5% 0;"></div> 
                <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;">
                <div style=" background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div>
                <div style=" background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> 
                <div style=" background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div>
                </a></blockquote>`
                    }}></div>
                    <div className="instagram-post" dangerouslySetInnerHTML={{
                        __html: `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DAhjnB7MzC3/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
                <div style="padding:16px;"> 
                <a href="https://www.instagram.com/p/DAhjnB7MzC3/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> 
                <div style=" display: flex; flex-direction: row; align-items: center;"> 
                <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> 
                <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> 
                <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> 
                <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div>
                </div></div>
                <div style="padding: 19% 0;"></div> 
                <div style="display:block; height:50px; margin:0 auto 12px; width:50px;">
                <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000">
                <g><path d="...svg path data..."></path></g></g></g></svg>
                </div><div style="padding-top: 8px;">
                <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div>
                </div><div style="padding: 12.5% 0;"></div> 
                <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;">
                <div style=" background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div>
                <div style=" background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> 
                <div style=" background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div>
                </a></blockquote>`
                    }}></div>
                    <div className="instagram-post" dangerouslySetInnerHTML={{
                        __html: `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/DAhjt9jMhvX/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
                <div style="padding:16px;"> 
                <a href="https://www.instagram.com/p/DAhjt9jMhvX/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> 
                <div style=" display: flex; flex-direction: row; align-items: center;"> 
                <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> 
                <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> 
                <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> 
                <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div>
                </div></div>
                <div style="padding: 19% 0;"></div> 
                <div style="display:block; height:50px; margin:0 auto 12px; width:50px;">
                <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000">
                <g><path d="...svg path data..."></path></g></g></g></svg>
                </div><div style="padding-top: 8px;">
                <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">View this post on Instagram</div>
                </div><div style="padding: 12.5% 0;"></div> 
                <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;">
                <div style=" background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div>
                <div style=" background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> 
                <div style=" background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div>
                </a></blockquote>`
                    }}></div>
                </div>
            </div>


        </div>
    );
};

export default Homepage;

