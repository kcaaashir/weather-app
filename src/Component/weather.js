import axios from 'axios';
import React, { useEffect, useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Typography, Card, CardContent, Grid } from '@mui/material';
import { WiThermometer, WiHumidity, WiBarometer, WiStrongWind, WiDaySunny } from 'weather-icons-react';

import HourlyForecast from './hourlyForecast';

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [hourlyForecast, setHourlyForecast] = useState([]);

    const fetchData = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=61203fb7d983c974c5abce639ff5f438`
            );
            setWeatherData(response.data);
            console.log(response.data); //You can see all the weather data in console log
        } catch (error) {
            console.error(error);
        }
    };

    const fetchHourlyData = async (latitude, longitude) => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=61203fb7d983c974c5abce639ff5f438`;
        fetch(apiUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to fetch data');
            })
            .then(data => {
                const hourlyData = data.list.map(item => ({
                    icon: item.weather[0].icon,
                    temperature: item.main.temp,
                    time: new Date(item.dt * 1000),
                    weather: item.weather[0].description,
                    rain: item.rain ? item.rain['3h'] : 0,
                }));

                const next24HoursData = hourlyData.filter(item => item.time.getHours() < new Date().getHours() + 24);

                setHourlyForecast(next24HoursData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    fetchData(latitude, longitude);
                    fetchHourlyData(latitude, longitude)
                },
                error => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    const cardLineStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 10,
    };

    const iconStyle = {
        marginRight: 10,
    };

    return (
        <>
            <Typography mt={2} variant="h5" display="inline-flex" alignItems="center" mb={1} > <LocationOnIcon /> Location</Typography>
            <Typography variant="h6" mb={8}> {weatherData?.name} </Typography>
            <Grid mb={10} ml={4} container alignItems={'center'} justifyContent="center" >
                {weatherData ? (
                    <>
                        <Grid item xs={12} sm={6} md={4} >
                            <Card sx={{ backgroundColor: '#61dafb', width: 300, height: 330 }}>
                                <CardContent>
                                    <Typography variant="h6" mb={1}>
                                        {new Date().toLocaleString('en-us', { weekday: 'long' })}
                                    </Typography>
                                    <Typography variant="h6" mb={1}>
                                        {new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                    </Typography>
                                    <Typography variant="h6">
                                        {weatherData.weather[0].main}
                                    </Typography>
                                    <img width={150} height={150} src={`https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt='Weather Icon' />
                                    <Typography variant="h6">
                                        {weatherData.main.temp}°C
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ backgroundColor: '#61dafb', width: 300, height: 330 }}>
                                <CardContent>
                                    <Typography variant="h6" mb={2}>
                                        Today Weather Info
                                    </Typography>
                                    <>
                                        <div style={cardLineStyle}>
                                            <WiThermometer size={40} style={iconStyle} />
                                            <Typography variant="body1">
                                                Temperature: {weatherData.main.temp}°C
                                            </Typography>
                                        </div>
                                        <div style={cardLineStyle}>
                                            <WiDaySunny size={40} style={iconStyle} />
                                            <Typography variant="body1">
                                                Description: {weatherData.weather[0].description}
                                            </Typography>
                                        </div>
                                        <div style={cardLineStyle}>
                                            <WiHumidity size={40} style={iconStyle} />
                                            <Typography variant="body1">
                                                Humidity: {weatherData.main.humidity}%
                                            </Typography>
                                        </div>
                                        <div style={cardLineStyle}>
                                            <WiBarometer size={40} style={iconStyle} />
                                            <Typography variant="body1">
                                                Pressure: {weatherData.main.pressure}
                                            </Typography>
                                        </div>
                                        <div style={cardLineStyle}>
                                            <WiStrongWind size={40} style={iconStyle} />
                                            <Typography variant="body1">
                                                Wind Speed: {weatherData.wind.speed}m/s
                                            </Typography>
                                        </div>

                                    </>
                                </CardContent>
                            </Card>
                        </Grid>
                    </>
                ) : (
                    <Typography variant="body1" mt={4}>Loading weather data...</Typography>
                )}
            </Grid>
            <HourlyForecast hourlyForecast={hourlyForecast} />
        </>
    );
};

export default Weather;