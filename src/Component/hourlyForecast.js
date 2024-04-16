import React from 'react';
import Slider from 'react-slick';
import { AccessTime as ClockIcon } from '@mui/icons-material';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function HourlyForecast({ hourlyForecast }) {
    const settings = {
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 5,
    };

    return (
        <>
            <Typography mb={5} variant="h6" display="inline-flex" alignItems="center"><ClockIcon sx={{ marginRight: '0.5rem' }} />Hourly Forecast</Typography>
            <Grid spacing={1}>
                {hourlyForecast.length === 0 &&
                    (<Typography variant="body1" display={'inline-flex'} alignItems={'center'} mt={4}>Loading... <CircularProgress /></Typography>
                    )}
                <Slider   {...settings}>
                    {hourlyForecast.map((item, index) => (
                        <Grid item xs={12} sm={6} key={index} alignItems={'center'}>
                            <Card sx={{ backgroundColor: '#61dafb', textAlign: 'center' }}>
                                <CardContent>
                                    <Typography ml={9}>
                                        <img src={`https://openweathermap.org/img/wn/${item.icon}.png`} alt="Weather Icon" /></Typography>
                                    <Typography variant="h6">{item.time.toLocaleTimeString([], { hour: '2-digit' })}</Typography>
                                    <Typography variant="body1">{item.temperature}°C</Typography>
                                    <Typography variant="body1">{item.rain} mm/hr </Typography>
                                    <Typography variant="body1">{item.weather}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Slider>
            </Grid>
        </>
    );
}

export default HourlyForecast;