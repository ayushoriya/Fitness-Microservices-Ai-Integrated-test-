import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
    Box, Card, CardContent, Typography, Grid, Chip, Button,
    Tabs, Tab, CircularProgress, Alert, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
    FitnessCenter, AccessTime, TrendingUp, PlayArrow,
    Add, Delete, Visibility
} from '@mui/icons-material';
import { getPublicTemplates, getMyTemplates, deleteTemplate } from '../services/api';

const TemplateLibrary = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [templateToDelete, setTemplateToDelete] = useState(null);

    useEffect(() => {
        loadTemplates();
    }, [activeTab]);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            const response = activeTab === 0 
                ? await getPublicTemplates() 
                : await getMyTemplates();
            setTemplates(response.data);
            setError(null);
        } catch (err) {
            console.error('Error loading templates:', err);
            setError('Failed to load templates');
        } finally {
            setLoading(false);
        }
    };

    const handleStartWorkout = (templateId) => {
        navigate(`/workout/${templateId}`);
    };

    const handleDeleteClick = (template, e) => {
        e.stopPropagation();
        setTemplateToDelete(template);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteTemplate(templateToDelete.id);
            setTemplates(templates.filter(t => t.id !== templateToDelete.id));
            setDeleteDialogOpen(false);
            setTemplateToDelete(null);
        } catch (err) {
            console.error('Error deleting template:', err);
            setError('Failed to delete template');
        }
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            'BEGINNER': 'success',
            'INTERMEDIATE': 'warning',
            'ADVANCED': 'error'
        };
        return colors[difficulty] || 'default';
    };

    const getCategoryIcon = (category) => {
        return <FitnessCenter />;
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">
                    💪 Workout Templates
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/templates/create')}
                >
                    Create Template
                </Button>
            </Box>

            <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ mb: 3 }}>
                <Tab label="Public Templates" />
                <Tab label="My Templates" />
            </Tabs>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            {templates.length === 0 ? (
                <Alert severity="info">
                    {activeTab === 0 
                        ? 'No public templates available yet' 
                        : 'You haven\'t created any templates. Click "Create Template" to get started!'}
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {templates.map((template) => (
                        <Grid item xs={12} sm={6} md={4} key={template.id}>
                            <Card sx={{ 
                                height: '100%',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Chip 
                                            label={template.difficulty} 
                                            color={getDifficultyColor(template.difficulty)}
                                            size="small"
                                        />
                                        <Chip 
                                            icon={getCategoryIcon(template.category)}
                                            label={template.category}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>

                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {template.name}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {template.description}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <AccessTime fontSize="small" color="action" />
                                            <Typography variant="caption">
                                                {template.estimatedDuration} min
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <FitnessCenter fontSize="small" color="action" />
                                            <Typography variant="caption">
                                                {template.exercises?.length || 0} exercises
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <TrendingUp fontSize="small" color="action" />
                                            <Typography variant="caption">
                                                {template.timesUsed} uses
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            startIcon={<PlayArrow />}
                                            onClick={() => handleStartWorkout(template.id)}
                                        >
                                            Start Workout
                                        </Button>
                                        
                                        {activeTab === 1 && (
                                            <IconButton 
                                                color="error"
                                                onClick={(e) => handleDeleteClick(template, e)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Template?</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete "{templateToDelete?.name}"? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TemplateLibrary;
