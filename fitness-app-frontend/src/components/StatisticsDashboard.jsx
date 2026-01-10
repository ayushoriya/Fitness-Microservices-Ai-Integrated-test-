import React, { useState, useEffect } from 'react';
import {
    Box, Card, CardContent, Typography, Grid, CircularProgress,
    Select, MenuItem, FormControl, InputLabel, Paper
} from '@mui/material';
import {
    TrendingUp, LocalFireDepartment, FitnessCenter,
    Schedule, CalendarMonth, EmojiEvents
} from '@mui/icons-material';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import dayjs from 'dayjs';

const StatisticsDashboard = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('week'); // week, month, all
    const [stats, setStats] = useState({
        totalCalories: 0,
        totalWorkouts: 0,
        totalDuration: 0,
        avgDuration: 0,
        mostPerformedExercise: 'None',
        caloriesThisWeek: 0
    });

    useEffect(() => {
        loadActivities();
    }, []);

    useEffect(() => {
        if (activities.length > 0) {
            calculateStats();
        }
    }, [activities, timeRange]);

    const loadActivities = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            const response = await axios.get('http://localhost:8080/api/activities', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-User-ID': userId
                }
            });

            setActivities(response.data);
        } catch (error) {
            console.error('Error loading activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterActivitiesByTimeRange = () => {
        const now = dayjs();
        let cutoffDate;

        if (timeRange === 'week') {
            cutoffDate = now.subtract(7, 'days');
        } else if (timeRange === 'month') {
            cutoffDate = now.subtract(30, 'days');
        } else {
            return activities;
        }

        return activities.filter(a => 
            dayjs(a.createdAt).isAfter(cutoffDate)
        );
    };

    const calculateStats = () => {
        const filtered = filterActivitiesByTimeRange();

        const totalCalories = filtered.reduce((sum, a) => sum + a.caloriesBurned, 0);
        const totalDuration = filtered.reduce((sum, a) => sum + a.duration, 0);
        const avgDuration = filtered.length > 0 ? Math.round(totalDuration / filtered.length) : 0;

        // Most performed exercise
        const exerciseCount = {};
        filtered.forEach(a => {
            exerciseCount[a.type] = (exerciseCount[a.type] || 0) + 1;
        });
        const mostPerformed = Object.keys(exerciseCount).length > 0
            ? Object.keys(exerciseCount).reduce((a, b) => 
                exerciseCount[a] > exerciseCount[b] ? a : b
              )
            : 'None';

        // This week's calories
        const weekAgo = dayjs().subtract(7, 'days');
        const caloriesThisWeek = activities
            .filter(a => dayjs(a.createdAt).isAfter(weekAgo))
            .reduce((sum, a) => sum + a.caloriesBurned, 0);

        setStats({
            totalCalories,
            totalWorkouts: filtered.length,
            totalDuration,
            avgDuration,
            mostPerformedExercise: formatActivityName(mostPerformed),
            caloriesThisWeek
        });
    };

    const formatActivityName = (type) => {
        return type.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    // Prepare chart data
    const getCaloriesOverTime = () => {
        const filtered = filterActivitiesByTimeRange();
        const groupedByDate = {};

        filtered.forEach(activity => {
            const date = dayjs(activity.createdAt).format('MMM DD');
            groupedByDate[date] = (groupedByDate[date] || 0) + activity.caloriesBurned;
        });

        return Object.entries(groupedByDate)
            .map(([date, calories]) => ({ date, calories }))
            .slice(-7); // Last 7 data points
    };

    const getExerciseTypeBreakdown = () => {
        const filtered = filterActivitiesByTimeRange();
        const typeCount = {};

        filtered.forEach(a => {
            const name = formatActivityName(a.type);
            typeCount[name] = (typeCount[name] || 0) + 1;
        });

        return Object.entries(typeCount)
            .map(([name, count]) => ({ name, count }))
            .slice(0, 5); // Top 5
    };

    const getWorkoutsPerDay = () => {
        const filtered = filterActivitiesByTimeRange();
        const dayCount = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

        filtered.forEach(a => {
            const day = dayjs(a.createdAt).format('ddd');
            dayCount[day] = (dayCount[day] || 0) + 1;
        });

        return Object.entries(dayCount).map(([day, count]) => ({ day, count }));
    };

    const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                    📊 Statistics Dashboard
                </Typography>
                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Time Range</InputLabel>
                    <Select
                        value={timeRange}
                        label="Time Range"
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <MenuItem value="week">Last 7 Days</MenuItem>
                        <MenuItem value="month">Last 30 Days</MenuItem>
                        <MenuItem value="all">All Time</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <CardContent>
                            <LocalFireDepartment sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">{stats.totalCalories}</Typography>
                            <Typography variant="body2">Total Calories Burned</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                        <CardContent>
                            <FitnessCenter sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">{stats.totalWorkouts}</Typography>
                            <Typography variant="body2">Total Workouts</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                        <CardContent>
                            <Schedule sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" fontWeight="bold">{stats.avgDuration}</Typography>
                            <Typography variant="body2">Avg Duration (min)</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                        <CardContent>
                            <EmojiEvents sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h6" fontWeight="bold" sx={{ minHeight: 48 }}>
                                {stats.mostPerformedExercise}
                            </Typography>
                            <Typography variant="body2">Most Performed</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3}>
                {/* Calories Over Time */}
                <Grid item xs={12} lg={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Calories Burned Over Time
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={getCaloriesOverTime()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="calories" stroke="#667eea" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Workouts Per Day */}
                <Grid item xs={12} lg={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Workouts Per Day of Week
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={getWorkoutsPerDay()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#764ba2" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Exercise Type Breakdown */}
                <Grid item xs={12} lg={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Exercise Type Breakdown
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={getExerciseTypeBreakdown()}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {getExerciseTypeBreakdown().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Weekly Progress */}
                <Grid item xs={12} lg={6}>
                    <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                This Week's Progress
                            </Typography>
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="h2" fontWeight="bold">
                                    {stats.caloriesThisWeek}
                                </Typography>
                                <Typography variant="body1">Calories Burned</Typography>
                                <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
                                    Keep going! 🔥
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StatisticsDashboard;
