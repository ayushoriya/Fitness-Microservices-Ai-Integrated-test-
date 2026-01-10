// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, Typography, Grid, Chip, Box, CircularProgress, Alert } from '@mui/material';
// import { FitnessCenter, LocalFireDepartment, AccessTime } from '@mui/icons-material';
// import { getActivities } from '../services/api';
// import { useNavigate } from 'react-router';

// const ActivityList = () => {
//     const navigate = useNavigate();
//     const [activities, setActivities] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchActivities();
//     }, []);

//     const fetchActivities = async () => {
//         try {
//             setLoading(true);
//             setError(null);
            
//             const response = await getActivities();
//             console.log('Activities response:', response);
            
//             // Handle response
//             if (response && response.data) {
//                 if (Array.isArray(response.data)) {
//                     setActivities(response.data);
//                 } else {
//                     console.warn('Expected array, got:', typeof response.data);
//                     setActivities([]);
//                 }
//             } else {
//                 console.warn('No data in response');
//                 setActivities([]);
//             }
//         } catch (err) {
//             console.error('Error fetching activities:', err);
//             setError('Failed to load activities. Please try again.');
//             setActivities([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const formatActivityName = (type) => {
//         return type.split('_').map(word => 
//             word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//         ).join(' ');
//     };

//     if (loading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     if (error) {
//         return (
//             <Alert severity="error" sx={{ mt: 2 }}>
//                 {error}
//             </Alert>
//         );
//     }

//     if (activities.length === 0) {
//         return (
//             <Alert severity="info" sx={{ mt: 2 }}>
//                 No activities found. Add your first workout!
//             </Alert>
//         );
//     }

//     return (
//         <Grid container spacing={3} sx={{ mt: 2 }}>
//             {activities.map((activity) => (
//                 <Grid item xs={12} sm={6} md={4} key={activity.id}>
//                     <Card 
//                         sx={{ 
//                             cursor: 'pointer',
//                             transition: 'transform 0.2s',
//                             '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
//                         }}
//                         onClick={() => navigate(`/activities/${activity.id}`)}
//                     >
//                         <CardContent>
//                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                                 <Chip 
//                                     icon={<FitnessCenter />} 
//                                     label={formatActivityName(activity.type)} 
//                                     color="primary"
//                                 />
//                                 <Typography variant="caption" color="text.secondary">
//                                     {new Date(activity.createdAt).toLocaleDateString()}
//                                 </Typography>
//                             </Box>

//                             <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                                     <AccessTime fontSize="small" color="action" />
//                                     <Typography variant="body2">
//                                         {activity.duration} min
//                                     </Typography>
//                                 </Box>
//                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                                     <LocalFireDepartment fontSize="small" color="action" />
//                                     <Typography variant="body2">
//                                         {activity.caloriesBurned} cal
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             ))}
//         </Grid>
//     );
// };

// export default ActivityList;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Chip, Box, CircularProgress, Alert } from '@mui/material';
import { FitnessCenter, LocalFireDepartment, AccessTime } from '@mui/icons-material';
import { getActivities } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ActivityList = () => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getActivities();
            console.log('Activities response:', response.data);
            setActivities(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Error fetching activities:', err);
            setError('Failed to load activities');
        } finally {
            setLoading(false);
        }
    };

    const formatType = (type) => {
        if (!type) return 'Unknown';
        return type.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
    }

    if (activities.length === 0) {
        return <Alert severity="info" sx={{ mt: 2 }}>No activities found. Add your first activity!</Alert>;
    }

    return (
        <Grid container spacing={3} sx={{ mt: 1 }}>
            {activities.map((activity) => (
                <Grid item xs={12} sm={6} md={4} key={activity.id}>
                    <Card
                        sx={{
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 4
                            }
                        }}
                        onClick={() => navigate(`/activities/${activity.id}`)}
                    >
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Chip
                                    icon={<FitnessCenter />}
                                    label={formatType(activity.type)}
                                    color="primary"
                                />
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(activity.createdAt).toLocaleDateString()}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <AccessTime fontSize="small" color="action" />
                                    <Typography variant="body2">
                                        {activity.duration} min
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <LocalFireDepartment fontSize="small" color="action" />
                                    <Typography variant="body2">
                                        {activity.caloriesBurned} cal
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ActivityList;
