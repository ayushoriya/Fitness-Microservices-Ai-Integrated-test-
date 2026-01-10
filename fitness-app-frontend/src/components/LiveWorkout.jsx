import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    Box, Card, CardContent, Typography, Button, LinearProgress,
    Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
    Grid, Paper, CircularProgress, Alert
} from '@mui/material';
import {
    PlayArrow, Pause, Stop, CheckCircle, NavigateNext,
    NavigateBefore, Timer, Close
} from '@mui/icons-material';
import {
    getTemplateById, startWorkoutSession, completeExercise,
    completeWorkout, abandonWorkout, getActiveWorkout
} from '../services/api';
import RestTimer from './RestTimer';

const LiveWorkout = () => {
    const { templateId } = useParams();
    const navigate = useNavigate();
    
    const [template, setTemplate] = useState(null);
    const [session, setSession] = useState(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSet, setCurrentSet] = useState(1);
    const [isResting, setIsResting] = useState(false);
    const [restTimeRemaining, setRestTimeRemaining] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quitDialogOpen, setQuitDialogOpen] = useState(false);

    useEffect(() => {
        initializeWorkout();
    }, [templateId]);

    const initializeWorkout = async () => {
        try {
            setLoading(true);
            
            // Check for active workout
            const activeResponse = await getActiveWorkout();
            if (activeResponse.status === 200 && activeResponse.data) {
                setSession(activeResponse.data);
                // Resume from where user left off
                const completedCount = activeResponse.data.exerciseProgress
                    .filter(ep => ep.isCompleted).length;
                setCurrentExerciseIndex(completedCount);
            } else {
                // Start new workout
                const templateResponse = await getTemplateById(templateId);
                setTemplate(templateResponse.data);
                
                const sessionResponse = await startWorkoutSession(templateId);
                setSession(sessionResponse.data);
            }
            
            setError(null);
        } catch (err) {
            console.error('Error initializing workout:', err);
            setError(err.response?.data?.message || 'Failed to start workout');
        } finally {
            setLoading(false);
        }
    };

    const currentExercise = session?.exerciseProgress?.[currentExerciseIndex];
    const templateExercise = template?.exercises?.[currentExerciseIndex];

    const handleSetComplete = async () => {
        if (currentSet >= currentExercise.targetSets) {
            // Exercise complete
            await handleExerciseComplete();
        } else {
            // Start rest timer
            const restSeconds = templateExercise?.restSeconds || 60;
            setRestTimeRemaining(restSeconds);
            setIsResting(true);
            setCurrentSet(currentSet + 1);
        }
    };

    const handleExerciseComplete = async () => {
        try {
            await completeExercise({
                sessionId: session.id,
                exerciseType: currentExercise.exerciseType,
                completedSets: currentExercise.targetSets,
                completedReps: currentExercise.targetReps
            });

            if (currentExerciseIndex < session.exerciseProgress.length - 1) {
                // Move to next exercise
                setCurrentExerciseIndex(currentExerciseIndex + 1);
                setCurrentSet(1);
            } else {
                // Workout complete!
                await handleWorkoutComplete();
            }
        } catch (err) {
            console.error('Error completing exercise:', err);
            setError('Failed to save progress');
        }
    };

    const handleWorkoutComplete = async () => {
        try {
            await completeWorkout(session.id);
            navigate('/activities', { 
                state: { message: 'Workout completed! 🎉' }
            });
        } catch (err) {
            console.error('Error completing workout:', err);
        }
    };

    const handleQuit = async () => {
        try {
            await abandonWorkout(session.id);
            navigate('/templates');
        } catch (err) {
            console.error('Error abandoning workout:', err);
        }
    };

    const formatActivityName = (type) => {
        return type?.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error || !session) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error || 'Failed to load workout'}</Alert>
                <Button onClick={() => navigate('/templates')} sx={{ mt: 2 }}>
                    Back to Templates
                </Button>
            </Box>
        );
    }

    const progress = ((currentExerciseIndex) / session.exerciseProgress.length) * 100;

    return (
        <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                    {session.templateName}
                </Typography>
                <IconButton color="error" onClick={() => setQuitDialogOpen(true)}>
                    <Close />
                </IconButton>
            </Box>

            {/* Progress Bar */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                            Exercise {currentExerciseIndex + 1} of {session.exerciseProgress.length}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                            {Math.round(progress)}% Complete
                        </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                </CardContent>
            </Card>

            {/* Current Exercise */}
            <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {formatActivityName(currentExercise?.exerciseType)}
                    </Typography>
                    
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={4}>
                            <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.2)' }}>
                                <Typography variant="h3" fontWeight="bold">
                                    {currentSet}
                                </Typography>
                                <Typography variant="caption">
                                    of {currentExercise?.targetSets} sets
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.2)' }}>
                                <Typography variant="h3" fontWeight="bold">
                                    {currentExercise?.targetReps}
                                </Typography>
                                <Typography variant="caption">reps</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.2)' }}>
                                <Typography variant="h3" fontWeight="bold">
                                    {templateExercise?.restSeconds || 60}s
                                </Typography>
                                <Typography variant="caption">rest</Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    {templateExercise?.notes && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            💡 {templateExercise.notes}
                        </Alert>
                    )}

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={<CheckCircle />}
                        onClick={handleSetComplete}
                        disabled={isResting}
                        sx={{ 
                            mt: 3, 
                            bgcolor: 'white', 
                            color: '#667eea',
                            '&:hover': { bgcolor: '#f0f0f0' }
                        }}
                    >
                        {currentSet >= currentExercise?.targetSets 
                            ? 'Complete Exercise' 
                            : 'Complete Set'}
                    </Button>
                </CardContent>
            </Card>

            {/* Rest Timer */}
            {isResting && (
                <RestTimer
                    duration={restTimeRemaining}
                    onComplete={() => {
                        setIsResting(false);
                        setRestTimeRemaining(0);
                    }}
                    onSkip={() => {
                        setIsResting(false);
                        setRestTimeRemaining(0);
                    }}
                />
            )}

            {/* Quit Dialog */}
            <Dialog open={quitDialogOpen} onClose={() => setQuitDialogOpen(false)}>
                <DialogTitle>Quit Workout?</DialogTitle>
                <DialogContent>
                    Are you sure you want to quit? Your progress will be lost.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setQuitDialogOpen(false)}>Continue Workout</Button>
                    <Button onClick={handleQuit} color="error" variant="contained">
                        Quit
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LiveWorkout;
