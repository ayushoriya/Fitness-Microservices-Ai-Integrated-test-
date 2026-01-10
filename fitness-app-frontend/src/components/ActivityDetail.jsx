

// export default ActivityDetail;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Paper, Typography, Box, CircularProgress, Alert, AlertTitle,
    Button, Grid, Chip, Divider, Card, CardContent, Fade
} from '@mui/material';
import {
    FitnessCenter, LocalFireDepartment, AccessTime, CalendarToday,
    ArrowBack, Delete, TrendingUp, AutoAwesome, Assessment,
    Lightbulb, HealthAndSafety, CheckCircle, Refresh
} from '@mui/icons-material';
import { getActivityDetail, deleteActivity, getRecommendationByActivity } from '../services/api';

const ActivityDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);
    
    // AI Recommendation States
    const [aiRecommendation, setAiRecommendation] = useState(null);
    const [recommendationLoading, setRecommendationLoading] = useState(false);
    const [recommendationError, setRecommendationError] = useState(null);

    useEffect(() => {
        fetchActivityDetail();
    }, [id]);

    const fetchActivityDetail = async () => {
        try {
            console.log('🔍 Fetching activity with ID:', id);
            setLoading(true);
            setError(null);
            
            const response = await getActivityDetail(id);
            console.log('✅ Activity loaded:', response.data);
            
            setActivity(response.data);
            
            // Load AI recommendation after activity loads
            loadAIRecommendation(id);
        } catch (err) {
            console.error('❌ Error loading activity:', err);
            
            if (err.response?.status === 404) {
                setError('Activity not found. It may have been deleted.');
            } else if (err.response?.status === 403) {
                setError('You do not have permission to view this activity.');
            } else if (err.response?.status === 500) {
                setError('Server error. Please try again later.');
            } else {
                setError('Failed to load activity details. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Load AI Recommendation
    const loadAIRecommendation = async (activityId) => {
        try {
            console.log('🤖 Loading AI recommendation for activity:', activityId);
            setRecommendationLoading(true);
            setRecommendationError(null);
            
            const response = await getRecommendationByActivity(activityId);
            console.log('✅ AI Recommendation received:', response.data);
            
            setAiRecommendation(response.data);
        } catch (err) {
            console.error('❌ Error loading recommendation:', err);
            
            if (err.response?.status === 404) {
                setRecommendationError('AI recommendation is being generated. Please check back in a few moments.');
            } else {
                setRecommendationError('Failed to load AI recommendation.');
            }
        } finally {
            setRecommendationLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this activity? This action cannot be undone.')) {
            return;
        }

        try {
            console.log('🗑️ Deleting activity:', id);
            setDeleting(true);
            
            await deleteActivity(id);
            console.log('✅ Activity deleted successfully');
            
            navigate('/activities', { 
                state: { message: 'Activity deleted successfully' } 
            });
        } catch (err) {
            console.error('❌ Error deleting activity:', err);
            alert('Failed to delete activity. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    const formatActivityType = (type) => {
        if (!type) return 'Unknown';
        return type.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActivityColor = (type) => {
        const colors = {
            RUNNING: 'error',
            CYCLING: 'primary',
            SWIMMING: 'info',
            WEIGHTLIFTING: 'warning',
            YOGA: 'success',
            WALKING: 'secondary'
        };
        return colors[type] || 'default';
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading activity details...
                </Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
                <Button 
                    variant="contained"
                    startIcon={<ArrowBack />} 
                    onClick={() => navigate('/activities')}
                >
                    Back to Activities
                </Button>
            </Container>
        );
    }

    if (!activity) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="info" sx={{ mb: 3 }}>
                    No activity data available
                </Alert>
                <Button 
                    variant="contained"
                    startIcon={<ArrowBack />} 
                    onClick={() => navigate('/activities')}
                >
                    Back to Activities
                </Button>
            </Container>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
            pb: 6
        }}>
            <Container maxWidth="lg" sx={{ pt: 4 }}>
                {/* Header Actions */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button 
                        variant="outlined"
                        startIcon={<ArrowBack />} 
                        onClick={() => navigate('/activities')}
                        sx={{ fontWeight: 'bold' }}
                    >
                        Back to Activities
                    </Button>
                    
                    <Button 
                        variant="outlined"
                        color="error" 
                        startIcon={<Delete />} 
                        onClick={handleDelete}
                        disabled={deleting}
                        sx={{ fontWeight: 'bold' }}
                    >
                        {deleting ? 'Deleting...' : 'Delete Activity'}
                    </Button>
                </Box>

                {/* Main Activity Card */}
                <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: 3 }}>
                    {/* Title Section */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Box 
                            sx={{ 
                                background: `linear-gradient(135deg, ${getActivityColor(activity.type)}.light, ${getActivityColor(activity.type)}.main)`,
                                p: 2.5, 
                                borderRadius: 2,
                                mr: 2 
                            }}
                        >
                            <FitnessCenter sx={{ fontSize: 48, color: 'white' }} />
                        </Box>
                        <Box>
                            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                                {formatActivityType(activity.type)}
                            </Typography>
                            <Chip 
                                label={formatActivityType(activity.type)}
                                color={getActivityColor(activity.type)}
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    {/* Key Metrics Grid */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={4}>
                            <Card 
                                elevation={0}
                                sx={{ 
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    color: 'white',
                                    height: '100%',
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'translateY(-8px)' }
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                    <AccessTime sx={{ fontSize: 56, mb: 1.5 }} />
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {activity.duration || 0}
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        Minutes
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                            <Card 
                                elevation={0}
                                sx={{ 
                                    background: 'linear-gradient(135deg, #F7B731, #F79F1F)',
                                    color: 'white',
                                    height: '100%',
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'translateY(-8px)' }
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                    <LocalFireDepartment sx={{ fontSize: 56, mb: 1.5 }} />
                                    <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {activity.caloriesBurned || 0}
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        Calories Burned
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                            <Card 
                                elevation={0}
                                sx={{ 
                                    background: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
                                    color: 'white',
                                    height: '100%',
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'translateY(-8px)' }
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                                    <CalendarToday sx={{ fontSize: 56, mb: 1.5 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {new Date(activity.createdAt).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        {formatTime(activity.createdAt)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Performance Summary */}
                    <Box sx={{ mt: 4, p: 3, bgcolor: '#F7F7F7', borderRadius: 2, borderLeft: '4px solid #667eea' }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            📊 Performance Summary
                        </Typography>
                        <Typography variant="body1">
                            You burned <strong>{activity.caloriesBurned || 0} calories</strong> in{' '}
                            <strong>{activity.duration || 0} minutes</strong> of{' '}
                            <strong>{formatActivityType(activity.type)}</strong>.
                        </Typography>
                        {activity.caloriesBurned && activity.duration && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Average burn rate: <strong>{Math.round(activity.caloriesBurned / activity.duration)} cal/min</strong>
                            </Typography>
                        )}
                    </Box>

                    {/* Notes Section */}
                    {activity.notes && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                📝 Notes
                            </Typography>
                            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#FFF4E6', borderRadius: 2 }}>
                                <Typography variant="body1">
                                    {activity.notes}
                                </Typography>
                            </Paper>
                        </Box>
                    )}
                </Paper>

                {/* 🤖 AI RECOMMENDATION SECTION - COMPACT & REFRESHABLE */}
                {aiRecommendation && (
                    <Fade in={true}>
                        <Box sx={{ mt: 4 }}>
                            <Paper 
                                elevation={3}
                                sx={{ 
                                    p: 4, 
                                    borderRadius: 3,
                                    background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)',
                                    border: '2px solid #667eea30',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Decorative Background */}
                                <Box sx={{ 
                                    position: 'absolute',
                                    top: -50,
                                    right: -50,
                                    width: 200,
                                    height: 200,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea20, #764ba220)',
                                    filter: 'blur(40px)'
                                }} />

                                {/* Header with Refresh Button */}
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    mb: 3,
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    <Box sx={{ 
                                        p: 1.5, 
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                        mr: 2
                                    }}>
                                        <AutoAwesome sx={{ fontSize: 32, color: 'white' }} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h5" fontWeight="bold" sx={{ 
                                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}>
                                            AI-Powered Insights
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Personalized recommendations
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Refresh />}
                                        onClick={() => loadAIRecommendation(id)}
                                        disabled={recommendationLoading}
                                        sx={{ 
                                            borderColor: '#667eea',
                                            color: '#667eea',
                                            fontWeight: 'bold',
                                            mr: 1,
                                            '&:hover': {
                                                borderColor: '#764ba2',
                                                bgcolor: '#667eea10'
                                            }
                                        }}
                                    >
                                        Refresh
                                    </Button>
                                    <Chip 
                                        label="Gemini AI" 
                                        size="small"
                                        sx={{ 
                                            bgcolor: '#667eea20',
                                            color: '#667eea',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                </Box>

                                {/* Overall Analysis */}
                                {aiRecommendation.recommendation && (
                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                            <Assessment sx={{ color: '#667eea', mr: 1, fontSize: 24 }} />
                                            <Typography variant="h6" fontWeight="bold">
                                                Performance Analysis
                                            </Typography>
                                        </Box>
                                        <Paper 
                                            elevation={0}
                                            sx={{ 
                                                p: 2.5, 
                                                bgcolor: 'white',
                                                borderRadius: 2,
                                                borderLeft: '4px solid #667eea'
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                                                {aiRecommendation.recommendation}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                )}

                                {/* Improvements Section - COMPACT */}
                                {aiRecommendation.improvements && aiRecommendation.improvements.length > 0 && (
                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                            <TrendingUp sx={{ color: '#F7B731', mr: 1, fontSize: 24 }} />
                                            <Typography variant="h6" fontWeight="bold">
                                                Areas for Improvement
                                            </Typography>
                                        </Box>
                                        <Grid container spacing={1.5}>
                                            {aiRecommendation.improvements.map((improvement, index) => (
                                                <Grid item xs={12} key={index}>
                                                    <Card 
                                                        elevation={0}
                                                        sx={{ 
                                                            p: 1.5,
                                                            borderRadius: 2,
                                                            border: '1px solid #F7B73120',
                                                            transition: 'all 0.2s',
                                                            '&:hover': {
                                                                borderColor: '#F7B731',
                                                                bgcolor: '#F7B73105'
                                                            }
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                            <Box sx={{ 
                                                                width: 24,
                                                                height: 24,
                                                                borderRadius: '50%',
                                                                bgcolor: '#F7B73120',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                mr: 1.5,
                                                                flexShrink: 0,
                                                                mt: 0.2
                                                            }}>
                                                                <Typography fontSize="0.75rem" fontWeight="bold" color="#F7B731">
                                                                    {index + 1}
                                                                </Typography>
                                                            </Box>
                                                            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                                                {improvement}
                                                            </Typography>
                                                        </Box>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )}

                                {/* Suggestions Section - COMPACT */}
                                {aiRecommendation.suggestions && aiRecommendation.suggestions.length > 0 && (
                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                            <Lightbulb sx={{ color: '#4ECDC4', mr: 1, fontSize: 24 }} />
                                            <Typography variant="h6" fontWeight="bold">
                                                Workout Suggestions
                                            </Typography>
                                        </Box>
                                        <Grid container spacing={1.5}>
                                            {aiRecommendation.suggestions.map((suggestion, index) => (
                                                <Grid item xs={12} key={index}>
                                                    <Card 
                                                        elevation={0}
                                                        sx={{ 
                                                            p: 1.5,
                                                            borderRadius: 2,
                                                            background: 'linear-gradient(135deg, #4ECDC405, #44A08D05)',
                                                            border: '1px solid #4ECDC420',
                                                            transition: 'all 0.2s',
                                                            '&:hover': {
                                                                borderColor: '#4ECDC4',
                                                                bgcolor: '#4ECDC410'
                                                            }
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                            <FitnessCenter sx={{ 
                                                                color: '#4ECDC4', 
                                                                fontSize: 20,
                                                                mr: 1.5,
                                                                flexShrink: 0,
                                                                mt: 0.2
                                                            }} />
                                                            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                                                {suggestion}
                                                            </Typography>
                                                        </Box>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )}

                                {/* Safety Guidelines - COMPACT */}
                                {aiRecommendation.safety && aiRecommendation.safety.length > 0 && (
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                            <HealthAndSafety sx={{ color: '#FF6B6B', mr: 1, fontSize: 24 }} />
                                            <Typography variant="h6" fontWeight="bold">
                                                Safety & Recovery Tips
                                            </Typography>
                                        </Box>
                                        <Paper 
                                            elevation={0}
                                            sx={{ 
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: '#FF6B6B10',
                                                border: '1px solid #FF6B6B20'
                                            }}
                                        >
                                            <Grid container spacing={1.5}>
                                                {aiRecommendation.safety.map((tip, index) => (
                                                    <Grid item xs={12} sm={6} key={index}>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                            <CheckCircle sx={{ 
                                                                color: '#FF6B6B', 
                                                                fontSize: 18,
                                                                mr: 1,
                                                                mt: 0.2,
                                                                flexShrink: 0
                                                            }} />
                                                            <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                                                {tip}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Paper>
                                    </Box>
                                )}

                                {/* AI Attribution Footer */}
                                <Box sx={{ 
                                    mt: 3, 
                                    pt: 2, 
                                    borderTop: '1px solid #66666620',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Generated {new Date(aiRecommendation.createdAt).toLocaleString()}
                                    </Typography>
                                    <Chip 
                                        icon={<AutoAwesome sx={{ fontSize: 14 }} />}
                                        label="AI Content"
                                        size="small"
                                        variant="outlined"
                                        sx={{ 
                                            borderColor: '#667eea',
                                            color: '#667eea',
                                            fontSize: '0.7rem'
                                        }}
                                    />
                                </Box>
                            </Paper>
                        </Box>
                    </Fade>
                )}

                {/* Loading State */}
                {recommendationLoading && (
                    <Box sx={{ mt: 4 }}>
                        <Paper 
                            elevation={3}
                            sx={{ 
                                p: 4, 
                                borderRadius: 3,
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)'
                            }}
                        >
                            <CircularProgress size={48} sx={{ mb: 2, color: '#667eea' }} />
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Generating AI Insights...
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Analyzing your workout data
                            </Typography>
                        </Paper>
                    </Box>
                )}

                {/* Error State */}
                {recommendationError && !aiRecommendation && (
                    <Box sx={{ mt: 4 }}>
                        <Alert 
                            severity="info"
                            icon={<AutoAwesome sx={{ fontSize: 28 }} />}
                            action={
                                <Button 
                                    size="small" 
                                    startIcon={<Refresh />}
                                    onClick={() => loadAIRecommendation(id)}
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    Retry
                                </Button>
                            }
                            sx={{ borderRadius: 2, p: 2 }}
                        >
                            <AlertTitle sx={{ fontWeight: 'bold' }}>
                                AI Recommendations Being Processed
                            </AlertTitle>
                            {recommendationError}
                        </Alert>
                    </Box>
                )}

                {/* Action Buttons */}
                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button 
                        variant="contained"
                        size="large"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/activities')}
                        sx={{ fontWeight: 'bold', px: 4 }}
                    >
                        Back to Activities
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default ActivityDetail;
