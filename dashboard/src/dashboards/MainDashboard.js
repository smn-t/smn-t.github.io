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

    const reformatedData = [
        { "unixTimeStamp": 1700000000000, "price": 150.50 },
        { "unixTimeStamp": 1700086400000, "price": 151.20 },
        { "unixTimeStamp": 1700172800000, "price": 149.80 },
        { "unixTimeStamp": 1700259200000, "price": 150.10 },
        { "unixTimeStamp": 1700345600000, "price": 151.75 },
        { "unixTimeStamp": 1700432000000, "price": 152.30 },
        { "unixTimeStamp": 1700518400000, "price": 153.00 },
        { "unixTimeStamp": 1700604800000, "price": 152.20 },
        { "unixTimeStamp": 1700691200000, "price": 151.60 },
        { "unixTimeStamp": 1700777600000, "price": 150.90 },
        { "unixTimeStamp": 1700864000000, "price": 151.40 },
        { "unixTimeStamp": 1700950400000, "price": 150.70 },
        { "unixTimeStamp": 1701036800000, "price": 149.90 },
        { "unixTimeStamp": 1701123200000, "price": 150.30 },
        { "unixTimeStamp": 1701209600000, "price": 151.10 },
        { "unixTimeStamp": 1701296000000, "price": 150.50 },
        { "unixTimeStamp": 1701382400000, "price": 149.80 },
        { "unixTimeStamp": 1701468800000, "price": 150.20 },
        { "unixTimeStamp": 1701555200000, "price": 150.80 },
        { "unixTimeStamp": 1701641600000, "price": 151.00 }
    ]

    const targetWeight = 80


    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Container maxWidth={false}>
                <Typography variant="h3" paddingTop={3} paddingBottom={1} paddingInline={2}>
                    Der heilige Amumbo
                </Typography>
                    <Grid item xs={12} md={8}>
                        <Paper >
                            <LineChart data={reformatedData} targetWeight={targetWeight} />
                        </Paper>
                    </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default MainDashboard;