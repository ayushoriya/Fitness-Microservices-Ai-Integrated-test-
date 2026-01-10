import React, { useState, useEffect } from 'react';
import {
    Box, Card, CardContent, Typography, Grid, LinearProgress,
    Button, TextField, Dialog, DialogTitle, DialogContent,
    DialogActions, Chip, Avatar, Paper, Divider
} from '@mui/material';
import {
    EmojiEvents, LocalFireDepartment, FitnessCenter,
    Star, WorkspacePremium, MilitaryTech, Flag,
    Add, CheckCircle, Lock
} from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';

const GoalsAchievements = () => {
    const [activities, setActivities] = useState([]);
    const [goals, setGoals] = useState({
        weeklyCalories: 2000,
        weeklyWorkouts: 5
    });
    const [progress, setProgress] = useState({
        caloriesBurned: 0,
        workoutsCompleted: 0
    });
    const [achievements, setAchievements] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newGoal, setNewGoal] = useState({ calories: 2000, workouts: 5 });

    useEffect(() => {
        loadActivities();
        loadGoals();
        loadAchievements();
    }, []);

    useEffect(() => {
        if (activities.length > 0) {
            calculateProgress();
            checkAchievements();
        }
    }, [activities]);

    const loadActivities = async () => {
        try {
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
        }
    };

    const loadGoals = () => {
        const savedGoals = localStorage.getItem('weeklyGoals');
        if (savedGoals) {
            setGoals(JSON.parse(savedGoals));
        }
    };

    const loadAchievements = () => {
        const saved = localStorage.getItem('achievements');
        if (saved) {
            setAchievements(JSON.parse(saved));
        } else {
            setAchievements([]);
        }
    };

    const calculateProgress = () => {
        const weekAgo = dayjs().subtract(7, 'days');
        const thisWeek = activities.filter(a => dayjs(a.createdAt).isAfter(weekAgo));

        const caloriesBurned = thisWeek.reduce((sum, a) => sum + a.caloriesBurned, 0);
        const workoutsCompleted = thisWeek.length;

        setProgress({ caloriesBurned, workoutsCompleted });
    };

    const saveGoals = () => {
        setGoals(newGoal);
        localStorage.setItem('weeklyGoals', JSON.stringify(newGoal));
        setDialogOpen(false);
    };

    const allAchievements = [
        { 
            id: 'first_workout', 
            name: 'First Steps', 
            description: 'Complete your first workout',
            icon: <Star />,
            color: '#FFD700',
            condition: () => activities.length >= 1
        },
        {
            id: 'week_streak',
            name: '7 Day Warrior',
            description: 'Maintain a 7-day workout streak',
            icon: <LocalFireDepartment />,
            color: '#FF6B6B',
            condition: () => {
                const dates = activities.map(a => dayjs(a.createdAt).format('YYYY-MM-DD'));
                const uniqueDates = [...new Set(dates)].sort();
                let streak = 1;
                for (let i = 1; i < uniqueDates.length; i++) {
                    if (dayjs(uniqueDates[i]).diff(dayjs(uniqueDates[i-1]), 'day') === 1) {
                        streak++;
                        if (streak >= 7) return true;
                    } else {
                        streak = 1;
                    }
                }
                return false;
            }
        },
        {
            id: 'calorie_crusher',
            name: 'Calorie Crusher',
            description: 'Burn 5000 calories total',
            icon: <LocalFireDepartment />,
            color: '#FF4500',
            condition: () => {
                const total = activities.reduce((sum, a) => sum + a.caloriesBurned, 0);
                return total >= 5000;
            }
        },
        {
            id: 'century_club',
            name: 'Century Club',
            description: 'Complete 100 workouts',
            icon: <FitnessCenter />,
            color: '#4A90E2',
            condition: () => activities.length >= 100
        },
        {
            id: 'weekly_warrior',
            name: 'Weekly Warrior',
            description: 'Complete 5 workouts in a week',
            icon: <EmojiEvents />,
            color: '#9B59B6',
            condition: () => {
                const weekAgo = dayjs().subtract(7, 'days');
                const thisWeek = activities.filter(a => dayjs(a.createdAt).isAfter(weekAgo));
                return thisWeek.length >= 5;
            }
        },
        {
            id: 'marathon_runner',
            name: 'Marathon Runner',
            description: 'Complete 10 running workouts',
            icon: <MilitaryTech />,
            color: '#E67E22',
            condition: () => {
                const running = activities.filter(a => a.type === 'RUNNING' || a.type === 'JOGGING');
                return running.length >= 10;
            }
        },
        {
            id: 'consistency_king',
            name: 'Consistency King',
            description: 'Work out for 30 consecutive days',
            icon: <WorkspacePremium />,
            color: '#F39C12',
            condition: () => {
                const dates = activities.map(a => dayjs(a.createdAt).format('YYYY-MM-DD'));
                const uniqueDates = [...new Set(dates)].sort();
                let streak = 1;
                for (let i = 1; i < uniqueDates.length; i++) {
                    if (dayjs(uniqueDates[i]).diff(dayjs(uniqueDates[i-1]), 'day') === 1) {
                        streak++;
                        if (streak >= 30) return true;
                    } else {
                        streak = 1;
                    }
                }
                return false;
            }
        },
        {
            id: 'early_bird',
            name: 'Early Bird',
            description: 'Complete 5 workouts before 8 AM',
            icon: <Star />,
            color: '#3498DB',
            condition: () => {
                const earlyWorkouts = activities.filter(a => {
                    const hour = dayjs(a.createdAt).hour();
                    return hour < 8;
                });
                return earlyWorkouts.length >= 5;
            }
        }
    ];

    const checkAchievements = () => {
        const unlocked = allAchievements
            .filter(achievement => achievement.condition())
            .map(a => a.id);

        const uniqueUnlocked = [...new Set([...achievements, ...unlocked])];
        
        if (uniqueUnlocked.length > achievements.length) {
            setAchievements(uniqueUnlocked);
            localStorage.setItem('achievements', JSON.stringify(uniqueUnlocked));
        }
    };

    const isAchievementUnlocked = (achievementId) => {
        return achievements.includes(achievementId);
    };

    const calorieProgress = Math.min((progress.caloriesBurned / goals.weeklyCalories) * 100, 100);
    const workoutProgress = Math.min((progress.workoutsCompleted / goals.weeklyWorkouts) * 100, 100);

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                🎯 Goals & Achievements
            </Typography>

            {/* Weekly Goals */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" fontWeight="bold">
                                    This Week's Goals
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<Flag />}
                                    onClick={() => setDialogOpen(true)}
                                >
                                    Set Goals
                                </Button>
                            </Box>

                            <Grid container spacing={3}>
                                {/* Calorie Goal */}
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 3, bgcolor: 'error.light', borderRadius: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <LocalFireDepartment sx={{ fontSize: 40, color: 'error.main' }} />
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold">
                                                    Calorie Goal
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {progress.caloriesBurned} / {goals.weeklyCalories} cal
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={calorieProgress} 
                                            sx={{ height: 10, borderRadius: 5 }}
                                        />
                                        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                                            {calorieProgress.toFixed(0)}% Complete
                                        </Typography>
                                        {calorieProgress >= 100 && (
                                            <Chip
                                                label="Goal Achieved! 🎉"
                                                color="success"
                                                size="small"
                                                sx={{ mt: 1 }}
                                            />
                                        )}
                                    </Paper>
                                </Grid>

                                {/* Workout Goal */}
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 3, bgcolor: 'primary.light', borderRadius: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <FitnessCenter sx={{ fontSize: 40, color: 'primary.main' }} />
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold">
                                                    Workout Goal
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {progress.workoutsCompleted} / {goals.weeklyWorkouts} workouts
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={workoutProgress} 
                                            sx={{ height: 10, borderRadius: 5 }}
                                        />
                                        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                                            {workoutProgress.toFixed(0)}% Complete
                                        </Typography>
                                        {workoutProgress >= 100 && (
                                            <Chip
                                                label="Goal Achieved! 🎉"
                                                color="success"
                                                size="small"
                                                sx={{ mt: 1 }}
                                            />
                                        )}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Achievements */}
            <Card>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        🏆 Achievements ({achievements.length}/{allAchievements.length})
                    </Typography>

                    <Grid container spacing={2}>
                        {allAchievements.map((achievement) => {
                            const unlocked = isAchievementUnlocked(achievement.id);
                            return (
                                <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                                    <Paper
                                        elevation={unlocked ? 3 : 0}
                                        sx={{
                                            p: 2,
                                            opacity: unlocked ? 1 : 0.5,
                                            bgcolor: unlocked ? achievement.color : 'grey.200',
                                            color: unlocked ? 'white' : 'text.secondary',
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                transform: unlocked ? 'scale(1.05)' : 'none',
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                            <Avatar sx={{ bgcolor: unlocked ? 'rgba(255,255,255,0.3)' : 'grey.400' }}>
                                                {unlocked ? achievement.icon : <Lock />}
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {achievement.name}
                                                </Typography>
                                                {unlocked && (
                                                    <CheckCircle fontSize="small" />
                                                )}
                                            </Box>
                                        </Box>
                                        <Typography variant="caption">
                                            {achievement.description}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>
                </CardContent>
            </Card>

            {/* Set Goals Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Set Your Weekly Goals</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Weekly Calorie Goal"
                        type="number"
                        fullWidth
                        value={newGoal.calories}
                        onChange={(e) => setNewGoal({ ...newGoal, calories: parseInt(e.target.value) })}
                        sx={{ mb: 2, mt: 1 }}
                        InputProps={{ inputProps: { min: 100, step: 100 } }}
                    />
                    <TextField
                        label="Weekly Workout Goal"
                        type="number"
                        fullWidth
                        value={newGoal.workouts}
                        onChange={(e) => setNewGoal({ ...newGoal, workouts: parseInt(e.target.value) })}
                        InputProps={{ inputProps: { min: 1, max: 14 } }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={saveGoals} variant="contained">Save Goals</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GoalsAchievements;
