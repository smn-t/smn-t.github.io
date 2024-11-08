import React from 'react';
import { Container, Grid, Paper, Typography, Slider } from '@mui/material';
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


const calculateSMA = (data, windowSize) => {
    // Sortiere die Daten nach unixTimeStamp
    const sortedData = [...data].sort((a, b) => a.unixTimeStamp - b.unixTimeStamp);

    let smaData = [];
    for (let i = 0; i < sortedData.length; i++) {
        if (i < windowSize - 1) {
            smaData.push({ ...sortedData[i], sma: null });
        } else {
            const windowSlice = sortedData.slice(i - windowSize + 1, i + 1);
            const sum = windowSlice.reduce((acc, val) => acc + val.price, 0);
            const average = sum / windowSize;
            smaData.push({ ...sortedData[i], sma: average });
        }
    }
    return smaData;
};

/*const findIntersections = (data) => {
    let intersections = [];
    for (let i = 1; i < data.length; i++) {
        const prev = data[i - 1];
        const current = data[i];
        if (prev.sma !== null && current.sma !== null) {
            // Prüfe, ob die Linien sich überschneiden
            if ((prev.price < prev.sma && current.price > current.sma) ||
                (prev.price > prev.sma && current.price < current.sma)) {
                intersections.push({
                    unixTimeStamp: current.unixTimeStamp,
                    price: current.price,
                });
            }
        }
    }
    return intersections;
};*/

// Main App
const MainDashboard = () => {
    const [sliderValue, setSliderValue] = React.useState(200);

    const handleChange = (event, newValue) => {
        if (typeof newValue === 'number') {
            setSliderValue(newValue);
        }
    };


    const reformatedData = data["Time Series (Daily)"]
        ? Object.keys(data["Time Series (Daily)"]).map(dateTime => {
            const unixTimestamp = Date.parse(dateTime); // Convert to Unix timestamp in milliseconds
            const closePrice = data["Time Series (Daily)"][dateTime]["4. close"];
            return { unixTimeStamp: unixTimestamp, price: parseFloat(closePrice) };
        })
        : [];


    const smaData = calculateSMA(reformatedData, sliderValue);
    // const intersections = findIntersections(smaData);

    const current_price =  Math.round((smaData.length > 0 ? smaData.at(-1)["price"] : null)*100)/100;
    const current_sma = Math.round((smaData.length > 0 ? smaData.at(-1)["sma"] : null)*100)/100;



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
                            <Typography variant="h6" paddingInline={1}>{sliderValue}SMA</Typography>
                            <Typography variant="h4" paddingInline={1}>{current_sma}</Typography>
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
                            <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" min={0} max={smaData.length} value={sliderValue}  onChange={handleChange} color='#FF6500'/>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Paper >
                            <LineChart data={smaData} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default MainDashboard;
