import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    Box, Card, CardContent, TextField, Button, FormControl,
    InputLabel, Select, MenuItem, Typography, IconButton,
    Grid, Paper, Chip, Alert, Snackbar, Divider, Switch,
    FormControlLabel
} from '@mui/material';
import {
    Add, Delete, DragIndicator, ArrowUpward, ArrowDownward,
    Save, FitnessCenter
} from '@mui/icons-material';
import { createTemplate } from '../services/api';

const TemplateBuilder = () => {
    const navigate = useNavigate();
    
    const [templateData, setTemplateData] = useState({
        name: '',
        description: '',
        difficulty: 'BEGINNER',
        category: 'STRENGTH',
        isPublic: false
    });

    const [exercises, setExercises] = useState([]);
    const [currentExercise, setCurrentExercise] = useState({
        exerciseType: 'PUSH_UP',
        sets: 3,
        reps: 10,
        restSeconds: 60,
        notes: ''
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const exerciseOptions = [
        { value: 'RUNNING', label: '🏃 Running', category: 'Cardio' },
        { value: 'WALKING', label: '🚶 Walking', category: 'Cardio' },
        { value: 'CYCLING', label: '🚴 Cycling', category: 'Cardio' },
        { value: 'SWIMMING', label: '🏊 Swimming', category: 'Cardio' },
        { value: 'JUMP_ROPE', label: '🪢 Jump Rope', category: 'Cardio' },
        { value: 'PUSH_UP', label: '💪 Push Ups', category: 'Strength' },
        { value: 'PULL_UP', label: '🦾 Pull Ups', category: 'Strength' },
        { value: 'CHIN_UP', label: '🔝 Chin Ups', category: 'Strength' },
        { value: 'SQUATS', label: '🦵 Squats', category: 'Strength' },
        { value: 'LUNGES', label: '🏋️ Lunges', category: 'Strength' },
        { value: 'BENCH_PRESS', label: '🏋️‍♂️ Bench Press', category: 'Strength' },
        { value: 'DEADLIFT', label: '💪 Deadlift', category: 'Strength' },
        { value: 'BICEP_CURLS', label: '💪 Bicep Curls', category: 'Strength' },
        { value: 'TRICEP_DIPS', label: '🔻 Tricep Dips', category: 'Strength' },
        { value: 'PLANK', label: '🧘 Plank', category: 'Core' },
        { value: 'SIT_UP', label: '🔄 Sit Ups', category: 'Core' },
        { value: 'CRUNCHES', label: '⚡ Crunches', category: 'Core' },
        { value: 'LEG_RAISES', label: '🦵 Leg Raises', category: 'Core' },
        { value: 'RUSSIAN_TWIST', label: '🌀 Russian Twist', category: 'Core' },
        { value: 'BURPEES', label: '🔥 Burpees', category: 'HIIT' }
    ];

    const handleAddExercise = () => {
        if (!currentExercise.sets || !currentExercise.reps) {
            setError('Please fill in all exercise fields');
            return;
        }

        const newExercise = {
            ...currentExercise,
            orderIndex: exercises.length
        };

        setExercises([...exercises, newExercise]);
        setCurrentExercise({
            exerciseType: 'PUSH_UP',
            sets: 3,
            reps: 10,
            restSeconds: 60,
            notes: ''
        });
    };

    const handleRemoveExercise = (index) => {
        const updated = exercises.filter((_, i) => i !== index);
        // Reorder indices
        const reordered = updated.map((ex, i) => ({ ...ex, orderIndex: i }));
        setExercises(reordered);
    };

    const handleMoveExercise = (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === exercises.length - 1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const updated = [...exercises];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        
        // Update order indices
        const reordered = updated.map((ex, i) => ({ ...ex, orderIndex: i }));
        setExercises(reordered);
    };

    const handleSubmit = async () => {
        if (!templateData.name || exercises.length === 0) {
            setError('Please provide template name and add at least one exercise');
            return;
        }

        try {
            setLoading(true);
            await createTemplate({
                ...templateData,
                exercises
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/templates');
            }, 1500);
        } catch (err) {
            console.error('Error creating template:', err);
            setError(err.response?.data?.message || 'Failed to create template');
        } finally {
            setLoading(false);
        }
    };

    const formatExerciseName = (type) => {
        return type.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    const estimatedDuration = exercises.reduce((total, ex) => {
        const workTime = ex.sets * ex.reps * 3; // 3 sec per rep
        const restTime = ex.restSeconds * (ex.sets - 1);
        return total + Math.round((workTime + restTime) / 60);
    }, 0);

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                ✨ Create Workout Template
            </Typography>

            <Grid container spacing={3}>
                {/* Template Details */}
                <Grid item xs={12} md={5}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Template Details
                            </Typography>

                            <TextField
                                fullWidth
                                label="Template Name"
                                value={templateData.name}
                                onChange={(e) => setTemplateData({ ...templateData, name: e.target.value })}
                                sx={{ mb: 2 }}
                                required
                            />

                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={3}
                                value={templateData.description}
                                onChange={(e) => setTemplateData({ ...templateData, description: e.target.value })}
                                sx={{ mb: 2 }}
                            />

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Difficulty</InputLabel>
                                <Select
                                    value={templateData.difficulty}
                                    label="Difficulty"
                                    onChange={(e) => setTemplateData({ ...templateData, difficulty: e.target.value })}
                                >
                                    <MenuItem value="BEGINNER">🟢 Beginner</MenuItem>
                                    <MenuItem value="INTERMEDIATE">🟡 Intermediate</MenuItem>
                                    <MenuItem value="ADVANCED">🔴 Advanced</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={templateData.category}
                                    label="Category"
                                    onChange={(e) => setTemplateData({ ...templateData, category: e.target.value })}
                                >
                                    <MenuItem value="STRENGTH">💪 Strength</MenuItem>
                                    <MenuItem value="CARDIO">🏃 Cardio</MenuItem>
                                    <MenuItem value="HIIT">🔥 HIIT</MenuItem>
                                    <MenuItem value="FLEXIBILITY">🧘 Flexibility</MenuItem>
                                    <MenuItem value="FULL_BODY">🏋️ Full Body</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={templateData.isPublic}
                                        onChange={(e) => setTemplateData({ ...templateData, isPublic: e.target.checked })}
                                    />
                                }
                                label="Make Public (visible to all users)"
                            />

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <FitnessCenter color="primary" />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {exercises.length} exercises
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Est. {estimatedDuration} minutes
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Add Exercise Form */}
                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Add Exercise
                            </Typography>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Exercise</InputLabel>
                                <Select
                                    value={currentExercise.exerciseType}
                                    label="Exercise"
                                    onChange={(e) => setCurrentExercise({ ...currentExercise, exerciseType: e.target.value })}
                                >
                                    {exerciseOptions.map(ex => (
                                        <MenuItem key={ex.value} value={ex.value}>
                                            {ex.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Sets"
                                        type="number"
                                        value={currentExercise.sets}
                                        onChange={(e) => setCurrentExercise({ ...currentExercise, sets: parseInt(e.target.value) })}
                                        inputProps={{ min: 1 }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Reps"
                                        type="number"
                                        value={currentExercise.reps}
                                        onChange={(e) => setCurrentExercise({ ...currentExercise, reps: parseInt(e.target.value) })}
                                        inputProps={{ min: 1 }}
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                fullWidth
                                label="Rest (seconds)"
                                type="number"
                                value={currentExercise.restSeconds}
                                onChange={(e) => setCurrentExercise({ ...currentExercise, restSeconds: parseInt(e.target.value) })}
                                sx={{ mb: 2 }}
                                inputProps={{ min: 0 }}
                            />

                            <TextField
                                fullWidth
                                label="Notes (optional)"
                                value={currentExercise.notes}
                                onChange={(e) => setCurrentExercise({ ...currentExercise, notes: e.target.value })}
                                sx={{ mb: 2 }}
                                placeholder="e.g., Keep back straight"
                            />

                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<Add />}
                                onClick={handleAddExercise}
                            >
                                Add Exercise
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Exercise List */}
                <Grid item xs={12} md={7}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Workout Plan ({exercises.length} exercises)
                            </Typography>

                            {exercises.length === 0 ? (
                                <Alert severity="info">
                                    No exercises added yet. Use the form on the left to add exercises.
                                </Alert>
                            ) : (
                                <Box>
                                    {exercises.map((exercise, index) => (
                                        <Paper
                                            key={index}
                                            elevation={2}
                                            sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}
                                        >
                                            <DragIndicator color="action" />
                                            
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {index + 1}. {formatExerciseName(exercise.exerciseType)}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                                    <Chip label={`${exercise.sets} sets`} size="small" color="primary" />
                                                    <Chip label={`${exercise.reps} reps`} size="small" color="primary" />
                                                    <Chip label={`${exercise.restSeconds}s rest`} size="small" variant="outlined" />
                                                </Box>
                                                {exercise.notes && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                                        💡 {exercise.notes}
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleMoveExercise(index, 'up')}
                                                    disabled={index === 0}
                                                >
                                                    <ArrowUpward fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleMoveExercise(index, 'down')}
                                                    disabled={index === exercises.length - 1}
                                                >
                                                    <ArrowDownward fontSize="small" />
                                                </IconButton>
                                            </Box>

                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemoveExercise(index)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Paper>
                                    ))}
                                </Box>
                            )}

                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                startIcon={<Save />}
                                onClick={handleSubmit}
                                disabled={loading || exercises.length === 0}
                                sx={{ mt: 3 }}
                            >
                                {loading ? 'Saving...' : 'Save Template'}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
                <Alert severity="success" onClose={() => setSuccess(false)}>
                    Template created successfully! 🎉
                </Alert>
            </Snackbar>

            <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default TemplateBuilder;
