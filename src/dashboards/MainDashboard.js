import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import LineChart from '../Components/LineChart';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});


// Main App
const MainDashboard = () => {

    const [backendData, setBackendData] = useState([]);

    const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MBG.DEX&outputsize=full&apikey=demo'

    useEffect(() => {
        // Funktion zum Fetchen der Daten vom Backend
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                setBackendData(data);


            } catch (error) {
                console.error('Fehler beim Fetchen der Daten:', error);
            }
        };

        fetchData();
    }, []);


    const reformatedData = backendData["Time Series (Daily)"]
        ? Object.keys(backendData["Time Series (Daily)"]).map(dateTime => {
            const unixTimestamp = Date.parse(dateTime); // Convert to Unix timestamp in milliseconds
            const closePrice = backendData["Time Series (Daily)"][dateTime]["4. close"];
            return { unixTimeStamp: unixTimestamp, price: parseFloat(closePrice) };
        })
        : [];


    const current_price = reformatedData.length > 0 ? reformatedData.at(0)["price"] : null;


    console.log(current_price);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Container maxWidth={false}>
                <Typography variant="h3" paddingTop={3} paddingBottom={1} paddingInline={2}>
                    MBG.DEX
                </Typography>
                <Grid container spacing={2} padding={2}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper >
                            <Typography variant="h6" paddingInline={1}>Current</Typography>
                            <Typography variant="h4" paddingInline={1}>{current_price}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper >
                            <Typography variant="h6" paddingInline={1}>200SMA</Typography>
                            <Typography variant="h4" paddingInline={1}>{130}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper >
                            <Typography variant="h6" paddingInline={1}>To be Configured</Typography>
                            <Typography variant="h4" paddingInline={1}>{255}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper >
                            <Typography variant="h6" paddingInline={1}>To be Configured</Typography>
                            <Typography variant="h4" paddingInline={1}>{255}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Paper >
                            <LineChart data={reformatedData} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default MainDashboard;