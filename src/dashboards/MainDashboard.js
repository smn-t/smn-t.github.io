import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Slider, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import LineChart from '../Components/LineChart';
import { ThemeProvider, CssBaseline } from '@mui/material';
import data from '../data.json';
import modernDarkTheme from '../Theme/modernDarkTheme';
import SmaChart from '../Components/SmaChart';
import { Checkbox, FormControlLabel } from '@mui/material';

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
  return sortedData.map((item, index) => {
    if (index < windowSize - 1) {
      return { ...item, sma: null };
    }
    const windowSlice = sortedData.slice(index - windowSize + 1, index + 1);
    const average = windowSlice.reduce((acc, val) => acc + val.price, 0) / windowSize;
    return { ...item, sma: average };
  });
};


const getSMAForTimestamp =(data, windowSize, unixTimeStamp) =>{
  const sorted = [...data].sort((a, b) => a.unixTimeStamp - b.unixTimeStamp);
  const idx = sorted.findIndex(item => item.unixTimeStamp === unixTimeStamp);
  if (idx < windowSize - 1 || idx === -1) return null;
  const windowSlice = sorted.slice(idx - windowSize + 1, idx + 1);
  const average = windowSlice.reduce((acc, val) => acc + val.price, 0) / windowSize;
  return average;
}

const getSMAForAllWindows = (data, unixTimeStamp, min = 50, max = 500, step = 1, current_price) => {
  const result = [];
  const maxWindowSize = Math.min(max, data.length); // maximal mögliche Fenstergröße

  for (let windowSize = min; windowSize <= maxWindowSize; windowSize += step) {
    const smaVal = getSMAForTimestamp(data, windowSize, unixTimeStamp);
    if (smaVal === null) continue; // Falls für das Fenster kein SMA möglich, überspringen
    const sma = smaVal - current_price;
    result.push({ sma: windowSize, value: sma });
  }
  return result;
};


const sliceData = (data, period) => {
  const now = Date.now();
  const periods = {
    '2year': 2 * 365 * 24 * 60 * 60 * 1000,
    'year': 365 * 24 * 60 * 60 * 1000,
    'ytd': new Date(new Date().getFullYear(), 0, 1).getTime(),
    'month': 30 * 24 * 60 * 60 * 1000,
    'week': 7 * 24 * 60 * 60 * 1000,
  };

  if (period === 'full') return data;
  if (period === 'ytd') return data.filter(item => item.unixTimeStamp >= periods[period]);
  return data.filter(item => now - item.unixTimeStamp <= periods[period]);
};


const MainDashboard = () => {
  const [sliderValue, setSliderValue] = useState(200);
  const [timePeriod, setTimePeriod] = useState('full');
  const [hoverData, setHoverData] = useState({ unixTimeStamp: Date.parse(data["Meta Data"]["3. Last Refreshed"]), price: null });
  const [hoverFeatureEnabled, setHoverFeatureEnabled] = useState(false);

const handleHoverChange = (data) => {
  if (hoverFeatureEnabled && data) {
    setHoverData(data);
  }
};

  const handleChange = (event, newValue) => {
    if (typeof newValue === 'number') {
      setSliderValue(newValue);
    }
  };

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  const reformatedData = data["Time Series (Daily)"]
    ? Object.keys(data["Time Series (Daily)"]).map(dateTime => ({
        unixTimeStamp: Date.parse(dateTime),
        price: parseFloat(data["Time Series (Daily)"][dateTime]["4. close"]),
      }))
    : [];

  const smaData = sliceData(calculateSMA(reformatedData, sliderValue), timePeriod);
  const current_price = smaData.length > 0 ? smaData.at(-1).price.toFixed(2) : null;
  const current_sma = smaData.length > 0 ? smaData.at(-1).sma.toFixed(2) : null;
  const difference = current_price && current_sma ? (current_price - current_sma).toFixed(2) : null;

const activeTimestamp = hoverFeatureEnabled ? hoverData.unixTimeStamp : Date.parse(data["Meta Data"]["3. Last Refreshed"]);
const activePrice = hoverFeatureEnabled ? (hoverData.price ?? current_price) : current_price;

const smaAll = getSMAForAllWindows(reformatedData, activeTimestamp, 50, 500, 1, activePrice);


  return (
    <ThemeProvider theme={modernDarkTheme}>
      <CssBaseline />
      <Container maxWidth={false}>
        <Typography variant="h4" paddingTop={3} paddingInline={2}>
          Der heilige Amumbo - {data["Meta Data"]["2. Symbol"]} (Last Update: {data["Meta Data"]["3. Last Refreshed"]})
        </Typography>
        <Typography variant="body2" paddingInline={2}>
          <i>Keine Anlageberatung!</i>
        </Typography>
        <Grid container spacing={2} padding={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ height: 70 }}>
              <Typography variant="overline" paddingInline={1}>Current</Typography>
              <Typography variant="h5" paddingInline={1}>{current_price}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ height: 70 }}>
              <Typography variant="overline" paddingInline={1}>{sliderValue}SMA</Typography>
              <Typography variant="h5" paddingInline={1}>{current_sma}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ height: 70, color: difference > 0 ? 'red' : 'green' }}>
              <Typography variant="overline" paddingInline={1}>Signal</Typography>
              <Typography variant="h5" paddingInline={1}>{difference > 0 ? 'BULLISH' : 'BEARISH'}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ height: 70, paddingInline: 1 }}>
              <FormControl fullWidth variant="outlined" sx={{ mt: 1, height: 80 }}>
                <InputLabel id="time-period-label">Select Period</InputLabel>
                <Select
                  labelId="time-period-label"
                  id="time-period-select"
                  value={timePeriod}
                  onChange={handleTimePeriodChange}
                  label="Select Period"
                >
                  <MenuItem value="full">Full</MenuItem>
                  <MenuItem value="2year">2 Year</MenuItem>
                  <MenuItem value="year">Year</MenuItem>
                  <MenuItem value="ytd">Year to Date</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                  <MenuItem value="week">Week</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={7} md={9}>
            <Paper sx={{ paddingInline: 4, height: 55 }}>
              <Slider
                defaultValue={50}
                aria-label="Default"
                valueLabelDisplay="auto"
                min={0}
                max={marks[marks.length - 1].value}
                value={sliderValue}
                onChange={handleChange}
                color="primary"
                step={null}
                marks={marks}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={2} md={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={hoverFeatureEnabled}
                  onChange={(e) => setHoverFeatureEnabled(e.target.checked)}
                  color="primary"
                />
              }
              label="Live SMA Calculation"
              sx={{ pl: 1 }}
            />
          </Grid>
          <Grid container item xs={12} sm={3} md={2} justifyContent="center" alignItems="center">
            <Button
              fullWidth
              onClick={() => {
                setSliderValue(200);
                setTimePeriod("full");
                setHoverFeatureEnabled(false);
              }}
              variant="contained"
              color="error"
              sx={{ height: 55 }}
            >
              Reset
            </Button>
          </Grid>
          <Grid item xs={8} md={8}>
            <Paper>
              <LineChart data={smaData} onHoverChange={handleHoverChange} />
            </Paper>
          </Grid>
          <Grid item xs={4} md={4}>
          <Paper>
            <SmaChart data={smaAll} />
          </Paper>
        </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default MainDashboard;