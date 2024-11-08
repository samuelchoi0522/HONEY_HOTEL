import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import dayjs from 'dayjs';
import SetOccupancyDialog from '../components/Set_Occupancy_Dialog';
import { useNavigate } from 'react-router-dom';
import '../styles/Homepage.css';

const hotelLocations = [
    { title: 'Brazos Bliss Hotel, Waco, Texas, USA' },
    { title: 'The Grand Palace, Paris, France' },
    { title: 'Seaside Serenity Resort, Phuket, Thailand' },
    { title: 'Urban Oasis, Tokyo, Japan' },
    { title: 'Misty Mountain Lodge, Queenstown, New Zealand' },
    { title: 'Desert Mirage Hotel, Dubai, UAE' },
    { title: 'Maple Leaf Lodge, Banff, Canada' },
    { title: 'Savannah Retreat, Nairobi, Kenya' },
    { title: 'Alpine Meadows Hotel, Interlaken, Switzerland' },
    { title: 'Casa Del Sol, Barcelona, Spain' },
    { title: 'Emerald Bay Resort, Bora Bora, French Polynesia' },
    { title: 'Crescent Cove Hotel, Sydney, Australia' },
    { title: 'Royal Garden Inn, London, UK' },
    { title: 'Blue Lagoon Resort, Reykjavik, Iceland' },
    { title: 'Rainforest Hideaway, Tulum, Mexico' },
    { title: 'Golden Sands Hotel, Cape Town, South Africa' },
    { title: 'Redwood Retreat, San Francisco, California, USA' },
    { title: 'Lakefront Lodge, Queenstown, New Zealand' },
    { title: 'Coconut Grove Resort, Bali, Indonesia' },
    { title: 'Northern Lights Inn, Tromsø, Norway' }
];

const theme = createTheme({
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    fontFamily: 'Kaisei Tokumin, serif',
                    fontSize: '0.9rem',
                    color: '#FFFFFF',
                    backgroundColor: '#363535',
                    borderRadius: 0,
                },
            },
        },
    },
});

const Homepage = () => {
    const [backgroundVideo, setBackgroundVideo] = useState(true);
    const [backgroundSource, setBackgroundSource] = useState('/uploads/Landing_Video (1).mp4');
    const [opacity, setOpacity] = useState(0.3);
    const [activeIndex, setActiveIndex] = useState(null);

    const [selectedHotel, setSelectedHotel] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [rateOption, setRateOption] = useState('Lowest Regular Rate');
    const [ratePromoCode, setRatePromoCode] = useState('');

    const navigate = useNavigate();

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

    const handleSetOccupancy = (newRooms, newAdults, newChildren) => {
        setRooms(newRooms);
        setAdults(newAdults);
        setChildren(newChildren);
    };

    const calculateNights = () => {
        if (dateRange[0] && dateRange[1]) {
            const start = dayjs(dateRange[0]);
            const end = dayjs(dateRange[1]);
            return end.diff(start, 'day');
        }
        return 0;
    };

    const handleCheckRates = () => {
        const hotelTitle = selectedHotel ? selectedHotel.title : "No hotel selected";
        const startDate = dateRange[0] ? dayjs(dateRange[0]).format('YYYY-MM-DD') : "No start date selected";
        const endDate = dateRange[1] ? dayjs(dateRange[1]).format('YYYY-MM-DD') : "No end date selected";
        const nights = calculateNights();

        const locationIsValid = Boolean(selectedHotel);
        const dateRangeIsValid = dateRange[0] && dateRange[1];

        if (!locationIsValid || !dateRangeIsValid) return;

        const bookingDetails = {
            hotelLocation: hotelTitle,
            startDate,
            endDate,
            nights,
            rooms,
            adults,
            children,
            rateOption,
            promoCode: rateOption === 'Promo Code' ? ratePromoCode : ''
        };

        fetch("http://localhost:8080/api/hives/find", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bookingDetails),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                navigate('/find-hive', {
                    state: {
                        bookingDetails,
                        rooms: data
                    }
                });
            })
            .catch(error => console.error("Error fetching available rooms:", error));
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <div className="homepage-container" style={{ backgroundColor: 'black' }}>
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

            {/* Explore Honey Hotel Section */}
            <div className="explore-honey-hotel">
                <h2 className='explore-honey-hotel-title'>EXPLORE <br></br> HONEY HOTEL</h2>
                <ThemeProvider theme={theme}>
                    <div className="check-rates-bar">
                        <Autocomplete
                            options={hotelLocations}
                            getOptionLabel={(option) => option.title}
                            value={selectedHotel}
                            onChange={(e, newValue) => setSelectedHotel(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Find A Hotel Or Resort"
                                    variant="outlined"
                                    className="homepage-destination-input"
                                />
                            )}
                        />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateRangePicker
                                value={dateRange}
                                onChange={(newValue) => setDateRange(newValue)}
                                minDate={dayjs()}
                                slots={{ field: SingleInputDateRangeField }}
                                className='homepage-date-range-picker'
                            />
                        </LocalizationProvider>

                        <div className='homepage-occupancy'>
                            <SetOccupancyDialog
                                onSetOccupancy={handleSetOccupancy}
                                rooms={rooms}
                                adults={adults}
                                children={children}
                                style={{ color: '#FFD700' }}
                            />
                        </div>

                        <button onClick={handleCheckRates} className="check-rates-button">
                            CHECK RATES
                        </button>
                    </div>
                </ThemeProvider>
            </div>

            {/* Navigation Bar */}
            <div className="nav-line">
                <div className="nav-line1"></div>
                <div
                    className="hover-box"
                    style={{
                        left: activeIndex !== null ? `${activeIndex * 17}%` : '0',
                    }}
                ></div>
            </div>

            <div className="navigation-bar">
                {['/uploads/Landing_Video (1).mp4', '/uploads/HOTEL_AMENITIES_PHOTO.jpeg', '/uploads/HOTEL_DINING_PHOTO.jpeg', '/uploads/HOTEL_SHOPPING_PHOTO.jpeg', '/uploads/Landing_Video (1).mp4'].map((source, index) => (
                    <div
                        key={index}
                        className="nav-item"
                        onMouseEnter={() => { setActiveIndex(index); changeBackground(index === 0 || index === 4, source); }}
                    >
                        <img src={`/icons/ICON${index}.png`} alt="Nav Item" />
                        <span>{['\u00A0HOTELS', 'AMENITIES', 'DINING', 'SHOP', 'ACCOUNT'][index]}</span>
                    </div>
                ))}
            </div>

            {/* Spacer */}
            <div className="spacer" style={{ height: '250px' }}></div>

            {/* Quick Links */}
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
                    <div className="restaurant-image">
                        <img
                            src="/uploads/HOMEPAGE_RESTAURANT_IMAGE.png"
                            alt="Restaurant"
                        />
                        <div className="image-caption">
                            <h3>DISCOVER OUR MICHELIN STAR RESTAURANTS</h3>
                            <p>EXPLORE OUR GROWING COLLECTION OF AWARD-WINNING RESTAURANTS</p>
                        </div>
                    </div>
                    <div className="activities-image">
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



                {/* Youtube Video */}
                <span className="the-story-text">{`THE STORY`}</span>
                <div className="video-wrapper">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/NpEaa2P7qZI?si=td7dVTOVEoADBofN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>

                {/* Instagram Posts */}
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

