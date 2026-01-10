// import { Box, Button, Typography, AppBar, Toolbar, Container } from "@mui/material";
// import { useContext, useEffect } from "react";
// import { AuthContext } from "react-oauth2-code-pkce";
// import { useDispatch } from "react-redux";
// import { BrowserRouter as Router, Navigate, Route, Routes, useNavigate } from "react-router-dom";
// import { setCredentials } from "./store/authSlice";
// import ActivityForm from "./components/ActivityForm";
// import ActivityList from "./components/ActivityList";
// import ActivityDetail from "./components/ActivityDetail";
// import UserProfile from "./components/UserProfile";
// import StreakCalendar from "./components/StreakCalendar";
// import StatisticsDashboard from "./components/StatisticsDashboard";
// import GoalsAchievements from "./components/GoalsAchievements";
// import TemplateLibrary from "./components/TemplateLibrary";
// import TemplateBuilder from "./components/TemplateBuilder";
// import LiveWorkout from "./components/LiveWorkout";
// import { 
//     FitnessCenter, Logout, Person, Whatshot, Assessment, 
//     EmojiEvents, DirectionsRun 
// } from "@mui/icons-material";

// // ✅ Simple Activities Page (No AI here)
// const ActivitiesPage = () => {
//     return (
//         <Container maxWidth="lg" sx={{ mt: 4 }}>
//             <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
//                 My Fitness Activities
//             </Typography>
//             <ActivityForm onActivityAdded={() => window.location.reload()} />
//             <ActivityList />
//         </Container>
//     );
// };

// function App() {
//     const { token, tokenData, logIn, logOut } = useContext(AuthContext);
//     const dispatch = useDispatch();
    
//     useEffect(() => {
//         if (token && tokenData) {
//             dispatch(setCredentials({ token, user: tokenData }));
//         }
//     }, [token, tokenData, dispatch]);

//     const AppContent = () => {
//         const navigate = useNavigate();

//         return (
//             <>
//                 <AppBar position="static">
//                     <Toolbar>
//                         <FitnessCenter sx={{ mr: 2 }} />
//                         <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//                             Fitness Tracker Pro
//                         </Typography>
                        
//                         <Button 
//                             color="inherit" 
//                             onClick={() => navigate('/activities')}
//                             startIcon={<DirectionsRun />}
//                         >
//                             Activities
//                         </Button>

//                         <Button 
//                             color="inherit" 
//                             onClick={() => navigate('/templates')}
//                             startIcon={<FitnessCenter />}
//                         >
//                             Templates
//                         </Button>
                        
//                         <Button 
//                             color="inherit" 
//                             onClick={() => navigate('/stats')}
//                             startIcon={<Assessment />}
//                         >
//                             Stats
//                         </Button>

//                         <Button 
//                             color="inherit" 
//                             onClick={() => navigate('/goals')}
//                             startIcon={<EmojiEvents />}
//                         >
//                             Goals
//                         </Button>
                        
//                         <Button 
//                             color="inherit" 
//                             onClick={() => navigate('/streak')}
//                             startIcon={<Whatshot />}
//                         >
//                             Streak
//                         </Button>
                        
//                         <Button 
//                             color="inherit" 
//                             onClick={() => navigate('/profile')}
//                             startIcon={<Person />}
//                         >
//                             Profile
//                         </Button>
                        
//                         <Typography variant="body2" sx={{ mx: 2 }}>
//                             Welcome, {tokenData?.given_name || tokenData?.email || 'User'}
//                         </Typography>
//                         <Button 
//                             color="inherit" 
//                             onClick={() => logOut()}
//                             startIcon={<Logout />}
//                         >
//                             Logout
//                         </Button>
//                     </Toolbar>
//                 </AppBar>

//                 <Routes>
//                     {/* Activity Routes */}
//                     <Route path="/activities" element={<ActivitiesPage />} />
//                     <Route path="/activities/:id" element={<ActivityDetail />} />
                    
//                     {/* Template Routes */}
//                     <Route 
//                         path="/templates" 
//                         element={
//                             <Container maxWidth="lg" sx={{ mt: 4 }}>
//                                 <TemplateLibrary />
//                             </Container>
//                         } 
//                     />
//                     <Route path="/templates/create" element={<TemplateBuilder />} />
                    
//                     {/* Workout Session Routes */}
//                     <Route path="/workout/:templateId" element={<LiveWorkout />} />
                    
//                     {/* Profile & Stats Routes */}
//                     <Route path="/profile" element={<UserProfile />} />
//                     <Route 
//                         path="/stats" 
//                         element={
//                             <Container maxWidth="lg" sx={{ mt: 4 }}>
//                                 <StatisticsDashboard />
//                             </Container>
//                         } 
//                     />
//                     <Route 
//                         path="/goals" 
//                         element={
//                             <Container maxWidth="lg" sx={{ mt: 4 }}>
//                                 <GoalsAchievements />
//                             </Container>
//                         } 
//                     />
//                     <Route 
//                         path="/streak" 
//                         element={
//                             <Container maxWidth="lg" sx={{ mt: 4 }}>
//                                 <StreakCalendar />
//                             </Container>
//                         } 
//                     />
                    
//                     {/* Default Route */}
//                     <Route path="/" element={<Navigate to="/activities" replace />} />
//                 </Routes>
//             </>
//         );
//     };

//     return (
//         <Router>
//             {!token ? (
//                 <Box
//                     sx={{
//                         height: "100vh",
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         textAlign: "center",
//                         background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                         color: "white"
//                     }}
//                 >
//                     <FitnessCenter sx={{ fontSize: 80, mb: 2 }} />
//                     <Typography variant="h3" gutterBottom fontWeight="bold">
//                         Fitness Tracker Pro
//                     </Typography>
//                     <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
//                         Track your workouts. Get AI-powered insights. Achieve your goals. 💪
//                     </Typography>
//                     <Button 
//                         variant="contained" 
//                         size="large" 
//                         onClick={() => logIn()}
//                         sx={{ 
//                             px: 4, 
//                             py: 1.5,
//                             fontSize: '1.1rem',
//                             backgroundColor: 'white',
//                             color: '#667eea',
//                             '&:hover': {
//                                 backgroundColor: '#f0f0f0'
//                             }
//                         }}
//                     >
//                         LOGIN WITH KEYCLOAK
//                     </Button>
//                 </Box>
//             ) : (
//                 <AppContent />
//             )}
//         </Router>
//     );
// }

// export default App;
import { Box, Button, Typography, AppBar, Toolbar, Container, Grid, Card, CardContent, Chip, IconButton, Fade, Paper } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityDetail from "./components/ActivityDetail";
import UserProfile from "./components/UserProfile";
import StreakCalendar from "./components/StreakCalendar";
import StatisticsDashboard from "./components/StatisticsDashboard";
import GoalsAchievements from "./components/GoalsAchievements";
import TemplateLibrary from "./components/TemplateLibrary";
import TemplateBuilder from "./components/TemplateBuilder";
import LiveWorkout from "./components/LiveWorkout";
import { 
    FitnessCenter, Logout, Person, Whatshot, Assessment, 
    EmojiEvents, DirectionsRun, LocalFireDepartment, AccessTime,
    FavoriteBorder, TrendingUp, AutoAwesome, Add
} from "@mui/icons-material";
import { getActivities } from "./services/api";

// ✅ COOL & SEXY ACTIVITIES PAGE
const ActivitiesPage = () => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalActivities: 0,
        totalCalories: 0,
        totalMinutes: 0,
        weekStreak: 0
    });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadActivities();
    }, []);

    const loadActivities = async () => {
        try {
            const response = await getActivities();
            const acts = Array.isArray(response.data) ? response.data : [];
            setActivities(acts);
            calculateStats(acts);
            setLoading(false);
        } catch (err) {
            console.error('Error loading activities:', err);
            setLoading(false);
        }
    };

    const calculateStats = (acts) => {
        const totalCal = acts.reduce((sum, act) => sum + (act.caloriesBurned || 0), 0);
        const totalMin = acts.reduce((sum, act) => sum + (act.duration || 0), 0);
        
        setStats({
            totalActivities: acts.length,
            totalCalories: totalCal,
            totalMinutes: totalMin,
            weekStreak: 5 // Mock streak
        });
    };

    const formatActivityType = (type) => {
        if (!type) return 'Unknown';
        return type.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    const getActivityIcon = (type) => {
        const icons = {
            RUNNING: '🏃',
            CYCLING: '🚴',
            SWIMMING: '🏊',
            WEIGHTLIFTING: '🏋️',
            YOGA: '🧘',
            WALKING: '🚶'
        };
        return icons[type] || '💪';
    };

    const getActivityColor = (type) => {
        const colors = {
            RUNNING: '#FF6B6B',
            CYCLING: '#4ECDC4',
            SWIMMING: '#45B7D1',
            WEIGHTLIFTING: '#F7B731',
            YOGA: '#5F27CD',
            WALKING: '#00D2D3'
        };
        return colors[type] || '#667eea';
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
            pb: 6
        }}>
            <Container maxWidth="xl" sx={{ pt: 4 }}>
                {/* Hero Section */}
                <Box sx={{ 
                    mb: 4, 
                    p: 4, 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            💪 My Fitness Journey
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                            Track every rep, crush every goal!
                        </Typography>
                        <Button 
                            variant="contained" 
                            size="large"
                            startIcon={<Add />}
                            onClick={() => setShowForm(!showForm)}
                            sx={{ 
                                bgcolor: 'white', 
                                color: '#667eea',
                                fontWeight: 'bold',
                                '&:hover': { bgcolor: '#f0f0f0' }
                            }}
                        >
                            {showForm ? 'Hide Form' : 'Add New Activity'}
                        </Button>
                    </Box>
                    
                    {/* Decorative circles */}
                    <Box sx={{ 
                        position: 'absolute', 
                        top: -50, 
                        right: -50, 
                        width: 200, 
                        height: 200, 
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.1)'
                    }} />
                    <Box sx={{ 
                        position: 'absolute', 
                        bottom: -30, 
                        right: 100, 
                        width: 100, 
                        height: 100, 
                        borderRadius: '50%',
                        bgcolor: 'rgba(255,255,255,0.1)'
                    }} />
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            transition: 'transform 0.3s',
                            '&:hover': { transform: 'translateY(-8px)' }
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <FitnessCenter sx={{ fontSize: 40, mr: 2 }} />
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold">
                                            {stats.totalActivities}
                                        </Typography>
                                        <Typography variant="body2">Total Workouts</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ 
                            background: 'linear-gradient(135deg, #F7B731 0%, #F79F1F 100%)',
                            color: 'white',
                            transition: 'transform 0.3s',
                            '&:hover': { transform: 'translateY(-8px)' }
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <LocalFireDepartment sx={{ fontSize: 40, mr: 2 }} />
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold">
                                            {stats.totalCalories.toLocaleString()}
                                        </Typography>
                                        <Typography variant="body2">Calories Burned</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ 
                            background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                            color: 'white',
                            transition: 'transform 0.3s',
                            '&:hover': { transform: 'translateY(-8px)' }
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <AccessTime sx={{ fontSize: 40, mr: 2 }} />
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold">
                                            {stats.totalMinutes}
                                        </Typography>
                                        <Typography variant="body2">Minutes Active</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ 
                            background: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%)',
                            color: 'white',
                            transition: 'transform 0.3s',
                            '&:hover': { transform: 'translateY(-8px)' }
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <EmojiEvents sx={{ fontSize: 40, mr: 2 }} />
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold">
                                            {stats.weekStreak}
                                        </Typography>
                                        <Typography variant="body2">Day Streak 🔥</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Activity Form */}
                {showForm && (
                    <Fade in={showForm}>
                        <Box sx={{ mb: 4 }}>
                            <ActivityForm onActivityAdded={() => {
                                loadActivities();
                                setShowForm(false);
                            }} />
                        </Box>
                    </Fade>
                )}

                {/* Activities List */}
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <DirectionsRun sx={{ fontSize: 32, mr: 2, color: '#667eea' }} />
                        <Typography variant="h5" fontWeight="bold">
                            Recent Activities
                        </Typography>
                        <Chip 
                            label={`${activities.length} Total`} 
                            color="primary" 
                            size="small" 
                            sx={{ ml: 2 }}
                        />
                    </Box>

                    {activities.length === 0 ? (
                        <Box sx={{ 
                            textAlign: 'center', 
                            py: 8,
                            background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                            borderRadius: 2
                        }}>
                            <FitnessCenter sx={{ fontSize: 80, color: '#667eea', opacity: 0.5, mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No activities yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Start your fitness journey today!
                            </Typography>
                            <Button 
                                variant="contained" 
                                startIcon={<Add />}
                                onClick={() => setShowForm(true)}
                            >
                                Add Your First Activity
                            </Button>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {activities.map((activity) => (
                                <Grid item xs={12} sm={6} md={4} key={activity.id}>
                                    <Card 
                                        sx={{ 
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            border: '2px solid transparent',
                                            '&:hover': { 
                                                transform: 'translateY(-8px)',
                                                boxShadow: 6,
                                                borderColor: getActivityColor(activity.type)
                                            }
                                        }}
                                        onClick={() => navigate(`/activities/${activity.id}`)}
                                    >
                                        <Box sx={{ 
                                            height: 6, 
                                            background: `linear-gradient(90deg, ${getActivityColor(activity.type)}, ${getActivityColor(activity.type)}88)`
                                        }} />
                                        
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography variant="h4" sx={{ mr: 1 }}>
                                                        {getActivityIcon(activity.type)}
                                                    </Typography>
                                                    <Box>
                                                        <Typography variant="h6" fontWeight="bold">
                                                            {formatActivityType(activity.type)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(activity.createdAt).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <IconButton size="small" sx={{ color: '#FF6B6B' }}>
                                                    <FavoriteBorder />
                                                </IconButton>
                                            </Box>

                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Box sx={{ 
                                                        p: 1.5, 
                                                        bgcolor: '#F7F7F7', 
                                                        borderRadius: 2,
                                                        textAlign: 'center'
                                                    }}>
                                                        <AccessTime sx={{ fontSize: 20, color: '#667eea', mb: 0.5 }} />
                                                        <Typography variant="h6" fontWeight="bold">
                                                            {activity.duration}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            minutes
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                
                                                <Grid item xs={6}>
                                                    <Box sx={{ 
                                                        p: 1.5, 
                                                        bgcolor: '#FFF4E6', 
                                                        borderRadius: 2,
                                                        textAlign: 'center'
                                                    }}>
                                                        <LocalFireDepartment sx={{ fontSize: 20, color: '#F7B731', mb: 0.5 }} />
                                                        <Typography variant="h6" fontWeight="bold">
                                                            {activity.caloriesBurned}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            calories
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>

                                            <Box sx={{ 
                                                mt: 2, 
                                                pt: 2, 
                                                borderTop: '1px solid #f0f0f0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}>
                                                <Chip 
                                                    label="View Details" 
                                                    size="small"
                                                    icon={<TrendingUp />}
                                                    sx={{ 
                                                        bgcolor: `${getActivityColor(activity.type)}20`,
                                                        color: getActivityColor(activity.type),
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                                <Chip 
                                                    label="AI Insights" 
                                                    size="small"
                                                    icon={<AutoAwesome />}
                                                    color="secondary"
                                                />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

function App() {
    const { token, tokenData, logIn, logOut } = useContext(AuthContext);
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (token && tokenData) {
            dispatch(setCredentials({ token, user: tokenData }));
        }
    }, [token, tokenData, dispatch]);

    const AppContent = () => {
        const navigate = useNavigate();

        return (
            <>
                <AppBar position="static">
                    <Toolbar>
                        <FitnessCenter sx={{ mr: 2 }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Fitness Tracker Pro
                        </Typography>
                        
                        <Button 
                            color="inherit" 
                            onClick={() => navigate('/activities')}
                            startIcon={<DirectionsRun />}
                        >
                            Activities
                        </Button>

                        <Button 
                            color="inherit" 
                            onClick={() => navigate('/templates')}
                            startIcon={<FitnessCenter />}
                        >
                            Templates
                        </Button>
                        
                        <Button 
                            color="inherit" 
                            onClick={() => navigate('/stats')}
                            startIcon={<Assessment />}
                        >
                            Stats
                        </Button>

                        <Button 
                            color="inherit" 
                            onClick={() => navigate('/goals')}
                            startIcon={<EmojiEvents />}
                        >
                            Goals
                        </Button>
                        
                        <Button 
                            color="inherit" 
                            onClick={() => navigate('/streak')}
                            startIcon={<Whatshot />}
                        >
                            Streak
                        </Button>
                        
                        <Button 
                            color="inherit" 
                            onClick={() => navigate('/profile')}
                            startIcon={<Person />}
                        >
                            Profile
                        </Button>
                        
                        <Typography variant="body2" sx={{ mx: 2 }}>
                            Welcome, {tokenData?.given_name || tokenData?.email || 'User'}
                        </Typography>
                        <Button 
                            color="inherit" 
                            onClick={() => logOut()}
                            startIcon={<Logout />}
                        >
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>

                <Routes>
                    <Route path="/activities" element={<ActivitiesPage />} />
                    <Route path="/activities/:id" element={<ActivityDetail />} />
                    
                    <Route 
                        path="/templates" 
                        element={
                            <Container maxWidth="lg" sx={{ mt: 4 }}>
                                <TemplateLibrary />
                            </Container>
                        } 
                    />
                    <Route path="/templates/create" element={<TemplateBuilder />} />
                    
                    <Route path="/workout/:templateId" element={<LiveWorkout />} />
                    
                    <Route path="/profile" element={<UserProfile />} />
                    <Route 
                        path="/stats" 
                        element={
                            <Container maxWidth="lg" sx={{ mt: 4 }}>
                                <StatisticsDashboard />
                            </Container>
                        } 
                    />
                    <Route 
                        path="/goals" 
                        element={
                            <Container maxWidth="lg" sx={{ mt: 4 }}>
                                <GoalsAchievements />
                            </Container>
                        } 
                    />
                    <Route 
                        path="/streak" 
                        element={
                            <Container maxWidth="lg" sx={{ mt: 4 }}>
                                <StreakCalendar />
                            </Container>
                        } 
                    />
                    
                    <Route path="/" element={<Navigate to="/activities" replace />} />
                </Routes>
            </>
        );
    };

    return (
        <Router>
            {!token ? (
                <Box
                    sx={{
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white"
                    }}
                >
                    <FitnessCenter sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h3" gutterBottom fontWeight="bold">
                        Fitness Tracker Pro
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                        Track your workouts. Get AI-powered insights. Achieve your goals. 💪
                    </Typography>
                    <Button 
                        variant="contained" 
                        size="large" 
                        onClick={() => logIn()}
                        sx={{ 
                            px: 4, 
                            py: 1.5,
                            fontSize: '1.1rem',
                            backgroundColor: 'white',
                            color: '#667eea',
                            '&:hover': {
                                backgroundColor: '#f0f0f0'
                            }
                        }}
                    >
                        LOGIN WITH KEYCLOAK
                    </Button>
                </Box>
            ) : (
                <AppContent />
            )}
        </Router>
    );
}

export default App;
