import React, { useState, useEffect } from 'react';
import { 
    Box, Card, CardContent, Typography, Grid, 
    CircularProgress, Chip, Paper, IconButton
} from '@mui/material';
import { 
    LocalFireDepartment, EmojiEvents, CheckCircle,
    CalendarMonth, ChevronLeft, ChevronRight
} from '@mui/icons-material';
import dayjs from 'dayjs';
import axios from 'axios';

const StreakCalendar = () => {
    const [streakData, setStreakData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(dayjs());

    useEffect(() => {
        loadStreakData();
    }, []);

    const loadStreakData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            
            const response = await axios.get('http://localhost:8080/api/activities/streak', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-User-ID': userId
                }
            });
            
            setStreakData(response.data);
        } catch (error) {
            console.error('Error loading streak:', error);
        } finally {
            setLoading(false);
        }
    };

    const isWorkoutDay = (date) => {
        if (!streakData || !streakData.workoutDates) return false;
        const dateStr = date.format('YYYY-MM-DD');
        return streakData.workoutDates.some(d => d === dateStr);
    };

    const handlePreviousMonth = () => {
        setCurrentMonth(currentMonth.subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setCurrentMonth(currentMonth.add(1, 'month'));
    };

    const renderCalendar = () => {
        const startOfMonth = currentMonth.startOf('month');
        const endOfMonth = currentMonth.endOf('month');
        const startDate = startOfMonth.startOf('week');
        const endDate = endOfMonth.endOf('week');

        const calendar = [];
        let day = startDate;

        const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        while (day.isBefore(endDate, 'day')) {
            const week = [];
            for (let i = 0; i < 7; i++) {
                const currentDay = day;
                const isCurrentMonth = currentDay.month() === currentMonth.month();
                const isToday = currentDay.isSame(dayjs(), 'day');
                const hasWorkout = isWorkoutDay(currentDay);

                week.push(
                    <Grid item xs={12/7} key={currentDay.format('YYYY-MM-DD')}>
                        <Paper
                            elevation={hasWorkout ? 3 : 0}
                            sx={{
                                aspectRatio: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                position: 'relative',
                                backgroundColor: hasWorkout 
                                    ? 'success.light' 
                                    : isToday 
                                        ? 'primary.light'
                                        : 'transparent',
                                opacity: isCurrentMonth ? 1 : 0.3,
                                border: isToday ? '2px solid' : '1px solid',
                                borderColor: isToday ? 'primary.main' : 'divider',
                                cursor: 'default',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    transform: hasWorkout ? 'scale(1.1)' : 'none',
                                }
                            }}
                        >
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    fontWeight: isToday ? 'bold' : 'normal',
                                    color: hasWorkout ? 'white' : 'text.primary'
                                }}
                            >
                                {currentDay.date()}
                            </Typography>
                            {hasWorkout && (
                                <CheckCircle 
                                    sx={{ 
                                        fontSize: 16, 
                                        color: 'white',
                                        mt: 0.5
                                    }} 
                                />
                            )}
                        </Paper>
                    </Grid>
                );
                day = day.add(1, 'day');
            }
            calendar.push(
                <Grid container spacing={1} key={day.format('YYYY-MM-DD')} sx={{ mb: 1 }}>
                    {week}
                </Grid>
            );
        }

        return (
            <Box>
                <Grid container spacing={1} sx={{ mb: 1 }}>
                    {weekDays.map(dayName => (
                        <Grid item xs={12/7} key={dayName}>
                            <Typography 
                                variant="caption" 
                                align="center" 
                                sx={{ 
                                    display: 'block',
                                    fontWeight: 'bold',
                                    color: 'text.secondary'
                                }}
                            >
                                {dayName}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
                {calendar}
            </Box>
        );
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                🔥 Your Fitness Streak
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                    }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <LocalFireDepartment sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h3" fontWeight="bold">
                                {streakData?.currentStreak || 0}
                            </Typography>
                            <Typography variant="body2">
                                Day Streak {streakData?.workedOutToday && '🔥'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white'
                    }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <EmojiEvents sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h3" fontWeight="bold">
                                {streakData?.longestStreak || 0}
                            </Typography>
                            <Typography variant="body2">
                                Longest Streak
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        color: 'white'
                    }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <CalendarMonth sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h3" fontWeight="bold">
                                {streakData?.workoutDates?.length || 0}
                            </Typography>
                            <Typography variant="body2">
                                Total Workouts
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton onClick={handlePreviousMonth} size="small">
                                <ChevronLeft />
                            </IconButton>
                            <Typography variant="h5" fontWeight="bold">
                                {currentMonth.format('MMMM YYYY')}
                            </Typography>
                            <IconButton onClick={handleNextMonth} size="small">
                                <ChevronRight />
                            </IconButton>
                        </Box>
                        {streakData?.workedOutToday ? (
                            <Chip 
                                icon={<CheckCircle />} 
                                label="Worked out today!" 
                                color="success"
                            />
                        ) : (
                            <Chip 
                                label="No workout yet today" 
                                color="warning"
                                variant="outlined"
                            />
                        )}
                    </Box>
                    
                    {renderCalendar()}
                    
                    <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                                width: 20, 
                                height: 20, 
                                backgroundColor: 'success.light',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 1
                            }} />
                            <Typography variant="caption">Workout Day</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ 
                                width: 20, 
                                height: 20, 
                                backgroundColor: 'primary.light',
                                border: '2px solid',
                                borderColor: 'primary.main',
                                borderRadius: 1
                            }} />
                            <Typography variant="caption">Today</Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default StreakCalendar;
