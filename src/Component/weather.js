import axios from 'axios';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent} from '@mui/material';
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
                    time: new Date(item.dt * 1000),
                    temperature: item.main.temp,
                    weather: item.weather[0].description,
                    icon: item.weather[0].icon,
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
            <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4, mb: 5 }}>
                <Typography mt={4} mb={5}>Your current location is {weatherData?.name}</Typography>
                {weatherData ? (
                    <>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h4" mb={5}>
                                    Weather Information
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
                                        <WiThermometer size={40} style={iconStyle} />
                                        <Typography variant="body1">
                                            Feels like: {weatherData.main.feels_like}°C
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
                    </>
                ) : (
                    <Typography variant="body1" mt={4}>Loading weather data...</Typography>
                )}
            </Box>
            <HourlyForecast hourlyForecast={hourlyForecast}/>
        </>
    );
};

export default Weather;