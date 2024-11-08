import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import LineChart from '../Components/LineChart';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import data from '../data.json'

// Theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#003566', // Set primary color
            light: '#001d3d', // Light shade of primary color
            dark: '#000814', // Dark shade of primary color
        },
        background: {
            default: '#000814', // Background color
            paper: '#0B192C', // Paper (card) color
        },
        text: {
            primary: '#FFFFFF', // Primary text color
            secondary: '#FF6500', // Secondary text color
        },
    },
});

// Main App
const MainDashboard = () => {


    console.log(data);


    const reformatedData = data["Time Series (Daily)"]
        ? Object.keys(data["Time Series (Daily)"]).map(dateTime => {
            const unixTimestamp = Date.parse(dateTime); // Convert to Unix timestamp in milliseconds
            const closePrice = data["Time Series (Daily)"][dateTime]["4. close"];
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
                    Der heilige Amumbo
                </Typography>
                <Typography variant="h8" paddingInline={2}>
                    <i>"Cry rich or try dying!"</i> - 50 Cent (angelsächsischer Sprechgesangskünstler)
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
