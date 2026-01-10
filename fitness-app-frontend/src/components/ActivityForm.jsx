import { 
    Box, Button, FormControl, InputLabel, MenuItem, Select, 
    TextField, CircularProgress, Alert, Snackbar, Typography,
    Grid, Paper, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { addActivity } from '../services/api';
import { getUserProfile } from '../services/api';
import { Timer, FitnessCenter } from '@mui/icons-material';


const ActivityForm = ({ onActivityAdded }) => {
    const [activity, setActivity] = useState({
        type: "RUNNING", 
        duration: '', 
        sets: '',
        reps: '',
        caloriesBurned: '',
        additionalMetrics: {}
    });
    
    const [userWeight, setUserWeight] = useState(70);
    const [inputMode, setInputMode] = useState('duration'); // 'duration' or 'sets_reps'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});


    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const response = await getUserProfile();
                if (response.data && response.data.weight) {
                    setUserWeight(response.data.weight);
                }
            } catch (err) {
                console.log('Using default weight');
            }
        };
        loadUserProfile();
    }, []);


    // Exercise categories
    const cardioExercises = ['RUNNING', 'WALKING', 'CYCLING', 'SWIMMING', 'JOGGING', 'JUMP_ROPE', 'ROWING', 'HIKING'];
    const strengthExercises = ['PUSH_UP', 'PULL_UP', 'CHIN_UP', 'SQUATS', 'LUNGES', 'BENCH_PRESS', 'DEADLIFT', 'BICEP_CURLS', 'TRICEP_DIPS', 'SIT_UP', 'CRUNCHES', 'LEG_RAISES', 'RUSSIAN_TWIST', 'PLANK'];
    const sportsExercises = ['BASKETBALL', 'SOCCER', 'TENNIS', 'BADMINTON', 'CRICKET', 'BOXING', 'MARTIAL_ARTS', 'DANCING'];
    const flexibilityExercises = ['YOGA', 'STRETCHING', 'PILATES'];


    const isStrengthExercise = (type) => strengthExercises.includes(type);
    const isCardioExercise = (type) => cardioExercises.includes(type) || sportsExercises.includes(type) || flexibilityExercises.includes(type);


    // Helper function to estimate time per rep (in seconds)
    const getTimePerRep = (exerciseType) => {
        const timings = {
            // Slow exercises (3-4 seconds per rep)
            'PULL_UP': 4,
            'CHIN_UP': 4,
            'PUSH_UP': 3,
            'SQUATS': 3,
            'DEADLIFT': 4,
            'BENCH_PRESS': 3,
            'PLANK': 1,
            
            // Medium speed (2-3 seconds per rep)
            'LUNGES': 2.5,
            'SIT_UP': 2,
            'CRUNCHES': 2,
            'LEG_RAISES': 2.5,
            'RUSSIAN_TWIST': 1.5,
            'TRICEP_DIPS': 2.5,
            
            // Fast exercises (1-2 seconds per rep)
            'BICEP_CURLS': 2,
            'JUMP_ROPE': 1,
            'BURPEES': 5,
        };
        
        return timings[exerciseType] || 2.5; // Default 2.5 seconds per rep
    };


    // Calculate calories based on sets and reps
    const calculateCaloriesFromSetsReps = (type, sets, reps, weight) => {
        const caloriesPerRep = {
            'PULL_UP': 1.2,
            'CHIN_UP': 1.1,
            'PUSH_UP': 0.5,
            'BURPEES': 1.5,
            'JUMP_ROPE': 0.8,
            'SQUATS': 0.4,
            'LUNGES': 0.4,
            'BENCH_PRESS': 0.6,
            'DEADLIFT': 0.8,
            'SIT_UP': 0.3,
            'CRUNCHES': 0.3,
            'LEG_RAISES': 0.4,
            'RUSSIAN_TWIST': 0.35,
            'BICEP_CURLS': 0.25,
            'TRICEP_DIPS': 0.3,
            'PLANK': 0.2,
        };


        const baseCalories = caloriesPerRep[type] || 0.3;
        const totalReps = sets * reps;
        const weightMultiplier = weight / 70;
        
        return Math.round(totalReps * baseCalories * weightMultiplier);
    };


    // Calculate calories based on duration (MET method)
    const calculateCaloriesFromDuration = (type, duration, weight) => {
        const metValues = {
            'RUNNING': 9.8,
            'JOGGING': 7.0,
            'WALKING': 3.5,
            'CYCLING': 8.0,
            'SWIMMING': 8.0,
            'JUMP_ROPE': 12.3,
            'PUSH_UP': 8.0,
            'PULL_UP': 8.0,
            'CHIN_UP': 8.0,
            'SQUATS': 5.0,
            'LUNGES': 4.0,
            'BENCH_PRESS': 6.0,
            'DEADLIFT': 6.0,
            'BICEP_CURLS': 3.5,
            'TRICEP_DIPS': 3.5,
            'PLANK': 4.0,
            'SIT_UP': 4.8,
            'CRUNCHES': 4.5,
            'LEG_RAISES': 4.0,
            'RUSSIAN_TWIST': 4.2,
            'YOGA': 2.5,
            'STRETCHING': 2.3,
            'PILATES': 3.0,
            'BASKETBALL': 6.5,
            'SOCCER': 7.0,
            'TENNIS': 7.3,
            'BADMINTON': 5.5,
            'CRICKET': 4.8,
            'HIKING': 6.0,
            'DANCING': 4.5,
            'BOXING': 9.0,
            'MARTIAL_ARTS': 10.3,
            'ROWING': 7.0,
        };
        
        const met = metValues[type] || 5.0;
        return Math.round(met * weight * (duration / 60));
    };


    const exerciseOptions = {
        'Cardio': [
            { value: 'RUNNING', label: '🏃 Running' },
            { value: 'WALKING', label: '🚶 Walking' },
            { value: 'CYCLING', label: '🚴 Cycling' },
            { value: 'SWIMMING', label: '🏊 Swimming' },
            { value: 'JOGGING', label: '🏃‍♂️ Jogging' },
            { value: 'JUMP_ROPE', label: '🪢 Jump Rope' },
        ],
        'Strength Training': [
            { value: 'PUSH_UP', label: '💪 Push Ups' },
            { value: 'PULL_UP', label: '🦾 Pull Ups' },
            { value: 'CHIN_UP', label: '🔝 Chin Ups' },
            { value: 'SQUATS', label: '🦵 Squats' },
            { value: 'LUNGES', label: '🏋️ Lunges' },
            { value: 'BENCH_PRESS', label: '🏋️‍♂️ Bench Press' },
            { value: 'DEADLIFT', label: '💪 Deadlift' },
            { value: 'BICEP_CURLS', label: '💪 Bicep Curls' },
            { value: 'TRICEP_DIPS', label: '🔻 Tricep Dips' },
        ],
        'Core & Abs': [
            { value: 'PLANK', label: '🧘 Plank' },
            { value: 'SIT_UP', label: '🔄 Sit Ups' },
            { value: 'CRUNCHES', label: '⚡ Crunches' },
            { value: 'LEG_RAISES', label: '🦵 Leg Raises' },
            { value: 'RUSSIAN_TWIST', label: '🌀 Russian Twist' },
        ],
        'Flexibility & Balance': [
            { value: 'YOGA', label: '🧘‍♀️ Yoga' },
            { value: 'STRETCHING', label: '🤸 Stretching' },
            { value: 'PILATES', label: '🧘‍♂️ Pilates' },
        ],
        'Sports': [
            { value: 'BASKETBALL', label: '🏀 Basketball' },
            { value: 'SOCCER', label: '⚽ Soccer' },
            { value: 'TENNIS', label: '🎾 Tennis' },
            { value: 'BADMINTON', label: '🏸 Badminton' },
            { value: 'CRICKET', label: '🏏 Cricket' },
        ],
        'Other': [
            { value: 'HIKING', label: '⛰️ Hiking' },
            { value: 'DANCING', label: '💃 Dancing' },
            { value: 'BOXING', label: '🥊 Boxing' },
            { value: 'MARTIAL_ARTS', label: '🥋 Martial Arts' },
            { value: 'ROWING', label: '🚣 Rowing' },
        ]
    };


    const validateForm = () => {
        const errors = {};
        
        if (inputMode === 'duration') {
            if (!activity.duration || activity.duration <= 0) {
                errors.duration = 'Duration must be greater than 0';
            }
        } else {
            if (!activity.sets || activity.sets <= 0) {
                errors.sets = 'Sets must be greater than 0';
            }
            if (!activity.reps || activity.reps <= 0) {
                errors.reps = 'Reps must be greater than 0';
            }
        }
        
        if (!activity.caloriesBurned || activity.caloriesBurned <= 0) {
            errors.caloriesBurned = 'Calories must be greater than 0';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            
            const metrics = { ...activity.additionalMetrics };
            
            if (inputMode === 'sets_reps') {
                metrics.sets = activity.sets.toString();
                metrics.reps = activity.reps.toString();
                
                // ✅ CALCULATE REALISTIC DURATION
                const timePerRep = getTimePerRep(activity.type);
                const restBetweenSets = 60; // 60 seconds rest between sets
                
                const workTime = activity.sets * activity.reps * timePerRep; // seconds
                const restTime = (activity.sets - 1) * restBetweenSets; // seconds
                const totalSeconds = workTime + restTime;
                const estimatedDuration = Math.round(totalSeconds / 60); // minutes
                
                activity.duration = Math.max(estimatedDuration, 1); // At least 1 minute
            }
            
            const activityData = {
                ...activity,
                additionalMetrics: metrics
            };
            
            await addActivity(activityData);
            setSuccess(true);
            setActivity({ 
                type: "RUNNING", 
                duration: '', 
                sets: '',
                reps: '',
                caloriesBurned: '', 
                additionalMetrics: {} 
            });
            setValidationErrors({});
            
            setTimeout(() => {
                if (onActivityAdded) {
                    onActivityAdded();
                }
            }, 1500);
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Failed to add activity. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const handleCloseSnackbar = () => {
        setSuccess(false);
        setError(null);
    };


    const handleActivityTypeChange = (newType) => {
        setActivity({ ...activity, type: newType, duration: '', sets: '', reps: '', caloriesBurned: '' });
        
        if (isStrengthExercise(newType)) {
            setInputMode('sets_reps');
        } else {
            setInputMode('duration');
        }
    };


    const handleDurationChange = (newDuration) => {
        const estimatedCalories = calculateCaloriesFromDuration(activity.type, newDuration, userWeight);
        setActivity({
            ...activity, 
            duration: newDuration,
            caloriesBurned: estimatedCalories
        });
    };


    const handleSetsRepsChange = (sets, reps) => {
        const estimatedCalories = calculateCaloriesFromSetsReps(activity.type, sets, reps, userWeight);
        setActivity({
            ...activity,
            sets: sets,
            reps: reps,
            caloriesBurned: estimatedCalories
        });
    };


    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Activity Type</InputLabel>
                <Select
                    value={activity.type}
                    label="Activity Type"
                    disabled={loading}
                    onChange={(e) => handleActivityTypeChange(e.target.value)}
                >
                    {Object.entries(exerciseOptions).map(([category, exercises]) => [
                        <MenuItem disabled key={category} sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {category}
                        </MenuItem>,
                        ...exercises.map(exercise => (
                            <MenuItem key={exercise.value} value={exercise.value} sx={{ pl: 4 }}>
                                {exercise.label}
                            </MenuItem>
                        ))
                    ])}
                </Select>
            </FormControl>


            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <ToggleButtonGroup
                    value={inputMode}
                    exclusive
                    onChange={(e, newMode) => {
                        if (newMode !== null) {
                            setInputMode(newMode);
                            setActivity({ ...activity, duration: '', sets: '', reps: '', caloriesBurned: '' });
                        }
                    }}
                    size="small"
                >
                    <ToggleButton value="duration">
                        <Timer sx={{ mr: 1 }} /> Duration
                    </ToggleButton>
                    <ToggleButton value="sets_reps">
                        <FitnessCenter sx={{ mr: 1 }} /> Sets & Reps
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>


            {inputMode === 'duration' ? (
                <TextField 
                    fullWidth
                    label="Duration (Minutes)"
                    type='number'
                    sx={{ mb: 2 }}
                    value={activity.duration}
                    disabled={loading}
                    error={!!validationErrors.duration}
                    helperText={validationErrors.duration || "Calories will be calculated automatically"}
                    onChange={(e) => handleDurationChange(e.target.value)}
                    inputProps={{ min: 1 }}
                />
            ) : (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                        <TextField 
                            fullWidth
                            label="Sets"
                            type='number'
                            value={activity.sets}
                            disabled={loading}
                            error={!!validationErrors.sets}
                            helperText={validationErrors.sets}
                            onChange={(e) => handleSetsRepsChange(parseInt(e.target.value) || 0, activity.reps)}
                            inputProps={{ min: 1 }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField 
                            fullWidth
                            label="Reps"
                            type='number'
                            value={activity.reps}
                            disabled={loading}
                            error={!!validationErrors.reps}
                            helperText={validationErrors.reps}
                            onChange={(e) => handleSetsRepsChange(activity.sets, parseInt(e.target.value) || 0)}
                            inputProps={{ min: 1 }}
                        />
                    </Grid>
                </Grid>
            )}


            <TextField 
                fullWidth
                label="Calories Burned (Auto-calculated)"
                type='number'
                sx={{ mb: 2 }}
                value={activity.caloriesBurned}
                disabled={loading}
                error={!!validationErrors.caloriesBurned}
                helperText={
                    validationErrors.caloriesBurned || 
                    `Based on your weight: ${userWeight}kg. ${inputMode === 'sets_reps' ? `Total reps: ${(activity.sets * activity.reps) || 0}` : ''} You can edit this value.`
                }
                onChange={(e) => setActivity({...activity, caloriesBurned: e.target.value})}
                inputProps={{ min: 1 }}
            />


            {(!userWeight || userWeight === 70) && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    💡 Set your profile (weight) for accurate calorie calculations!
                </Alert>
            )}


            <Button 
                type='submit' 
                variant='contained' 
                fullWidth
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
                {loading ? 'Adding Activity...' : 'Add Activity'}
            </Button>


            <Snackbar 
                open={success} 
                autoHideDuration={3000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Activity added successfully! AI recommendations will be ready shortly.
                </Alert>
            </Snackbar>


            <Snackbar 
                open={!!error} 
                autoHideDuration={5000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};


export default ActivityForm;
