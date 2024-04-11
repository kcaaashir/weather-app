import React from 'react';
import { Card, CardContent, Container, Typography, Grid } from '@mui/material';

function HourlyForecast({ hourlyForecast }) {
    return (
        <Container fixed>
            <Typography mb={2} >Hourly Forecast</Typography>
            <Grid container spacing={3}>
                {hourlyForecast.map((item, index) => (

                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card >
                            <CardContent>
                                <Typography variant="h6">{item.time.toLocaleTimeString()}</Typography>
                                <Typography variant="body1">Temperature: {item.temperature}°C</Typography>
                                <Typography variant="body1">Weather: {item.weather}</Typography>
                                <img src={`https://openweathermap.org/img/wn/${item.icon}.png`} alt="Weather Icon" />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default HourlyForecast;