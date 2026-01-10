import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import { Timer, SkipNext } from '@mui/icons-material';

const RestTimer = ({ duration, onComplete, onSkip }) => {
    const [timeRemaining, setTimeRemaining] = useState(duration);

    useEffect(() => {
        if (timeRemaining <= 0) {
            onComplete();
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, onComplete]);

    const progress = ((duration - timeRemaining) / duration) * 100;

    return (
        <Card sx={{ 
            mb: 3, 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
        }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Timer sx={{ fontSize: 60, mb: 2 }} />
                
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {timeRemaining}s
                </Typography>
                
                <Typography variant="h6" sx={{ mb: 3 }}>
                    Rest Time
                </Typography>

                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 3 }}>
                    <CircularProgress
                        variant="determinate"
                        value={progress}
                        size={100}
                        thickness={4}
                        sx={{ color: 'white' }}
                    />
                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography variant="h4" component="div" color="white" fontWeight="bold">
                            {Math.round(progress)}%
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<SkipNext />}
                    onClick={onSkip}
                    sx={{ 
                        bgcolor: 'white', 
                        color: '#f5576c',
                        '&:hover': { bgcolor: '#f0f0f0' }
                    }}
                >
                    Skip Rest
                </Button>
            </CardContent>
        </Card>
    );
};

export default RestTimer;
