import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Slider, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import LineChart from '../Components/LineChart';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import data from '../data.json';

// Theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#003566',
            light: '#001d3d',
            dark: '#000814',
        },
        background: {
            default: '#000814',
            paper: '#0B192C',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#FF6500',
        },
    },
});

const marks = [
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 150, label: '150' },
    { value: 200, label: '200' },
    { value: 250, label: '250' },
    { value: 300, label: '300' },
    { value: 400, label: '400' },
    { value: 500, label: '500' },
];

const calculateSMA = (data, windowSize) => {
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

// Funktion zum Slicing der Daten
const sliceData = (data, period) => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneYear = 365 * oneDay;
    const twoYears = 2 * oneYear;
    const oneMonth = 30 * oneDay;
    const oneWeek = 7 * oneDay;

    switch (period) {
        case '2year':
            return data.filter(item => now - item.unixTimeStamp <= twoYears);
        case 'year':
            return data.filter(item => now - item.unixTimeStamp <= oneYear);
        case 'ytd':
            const startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime();
            return data.filter(item => item.unixTimeStamp >= startOfYear);
        case 'month':
            return data.filter(item => now - item.unixTimeStamp <= oneMonth);
        case 'week':
            return data.filter(item => now - item.unixTimeStamp <= oneWeek);
        case 'full':
        default:
            return data;
    }
};

// Main App
const MainDashboard = () => {
    const [sliderValue, setSliderValue] = useState(200);
    const [timePeriod, setTimePeriod] = useState('full');

    const handleChange = (event, newValue) => {
        if (typeof newValue === 'number') {
            setSliderValue(newValue);
        }
    };

    const handleTimePeriodChange = (event) => {
        setTimePeriod(event.target.value);
    };

    const reformatedData = data["Time Series (Daily)"]
        ? Object.keys(data["Time Series (Daily)"]).map(dateTime => {
            const unixTimestamp = Date.parse(dateTime);
            const closePrice = data["Time Series (Daily)"][dateTime]["4. close"];
            return { unixTimeStamp: unixTimestamp, price: parseFloat(closePrice) };
        })
        : [];


    const smaData = sliceData(calculateSMA(reformatedData, sliderValue), timePeriod);
    const current_price = Math.round((smaData.length > 0 ? smaData.at(-1)["price"] : null) * 100) / 100;
    const current_sma = Math.round((smaData.length > 0 ? smaData.at(-1)["sma"] : null) * 100) / 100;
    const difference = Math.round((current_price - current_sma) * 100) / 100;

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
                        <Paper sx={{ height: '98%'}}>
                            <Typography variant="h6" paddingInline={1}>Current</Typography>
                            <Typography variant="h4" paddingInline={1}>{current_price}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ height: '98%'}}>
                            <Typography variant="h6" paddingInline={1}>{sliderValue}SMA</Typography>
                            <Typography variant="h4" paddingInline={1}>{current_sma}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ height: '98%', color: difference > 0 ? 'red' : 'green'}}>
                            <Typography variant="h6" paddingInline={1}>Expert Rating</Typography>
                            <Typography variant="h4" paddingInline={1}> {difference > 0 ? `Sell` : `Buy`}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper sx={{ height: '98%', paddingInline: 1 }}>
                            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                                <InputLabel id="time-period-label">Select Period</InputLabel>
                                <Select
                                    labelId="time-period-label"
                                    id="time-period-select"
                                    value={timePeriod}
                                    onChange={handleTimePeriodChange}
                                    label="Select Period"
                                >
                                    <MenuItem value="full">Full</MenuItem>
                                    <MenuItem value="2year">2 Year</MenuItem> {/* Neue Option "2 Year" */}
                                    <MenuItem value="year">Year</MenuItem>
                                    <MenuItem value="ytd">Year to Date</MenuItem>
                                    <MenuItem value="month">Month</MenuItem>
                                    <MenuItem value="week">Week</MenuItem>
                                </Select>
                            </FormControl>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={9} md={11}>
                        <Paper sx={{ paddingInline: 4 }}>
                            <Slider
                                defaultValue={50}
                                aria-label="Default"
                                valueLabelDisplay="auto"
                                min={0}
                                max={marks[marks.length-1].value}
                                value={sliderValue}
                                onChange={handleChange}
                                color="primary"
                                step={null}
                                marks={marks}
                            />
                        </Paper>
                    </Grid>
                    <Grid container item xs={12} sm={3} md={1} justifyContent="center" alignItems="center">
                        <Button onClick={() => { setSliderValue(200); setTimePeriod("full")}} variant="contained" color="success"> Reset </Button>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Paper>
                            <LineChart data={smaData} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default MainDashboard;
