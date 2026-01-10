import React, { useState, useEffect } from 'react';
import { 
    Box, Card, CardContent, TextField, Button, 
    FormControl, InputLabel, Select, MenuItem, Typography,
    Alert, Snackbar, CircularProgress, Container
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { getUserProfile, updateUserProfile } from '../services/api';

const UserProfile = () => {
    const [profile, setProfile] = useState({
        age: '',
        weight: '',
        gender: 'MALE',
        height: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const response = await getUserProfile();
            if (response.data) {
                setProfile({
                    age: response.data.age || '',
                    weight: response.data.weight || '',
                    gender: response.data.gender || 'MALE',
                    height: response.data.height || ''
                });
            }
        } catch (err) {
            console.log('No profile yet or error loading');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await updateUserProfile(profile);
            setSuccess(true);
            setError(null);
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <AccountCircle color="primary" sx={{ fontSize: 40 }} />
                        <Box>
                            <Typography variant="h5" fontWeight="bold">
                                Your Profile
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Help us calculate accurate calorie estimates
                            </Typography>
                        </Box>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Age"
                            type="number"
                            value={profile.age}
                            onChange={(e) => setProfile({...profile, age: e.target.value})}
                            sx={{ mb: 2 }}
                            inputProps={{ min: 10, max: 120 }}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Weight (kg)"
                            type="number"
                            value={profile.weight}
                            onChange={(e) => setProfile({...profile, weight: e.target.value})}
                            sx={{ mb: 2 }}
                            inputProps={{ min: 20, max: 300, step: 0.1 }}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Height (cm)"
                            type="number"
                            value={profile.height}
                            onChange={(e) => setProfile({...profile, height: e.target.value})}
                            sx={{ mb: 2 }}
                            inputProps={{ min: 100, max: 250 }}
                            required
                        />

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>Gender</InputLabel>
                            <Select
                                value={profile.gender}
                                label="Gender"
                                onChange={(e) => setProfile({...profile, gender: e.target.value})}
                            >
                                <MenuItem value="MALE">Male</MenuItem>
                                <MenuItem value="FEMALE">Female</MenuItem>
                                <MenuItem value="OTHER">Other</MenuItem>
                            </Select>
                        </FormControl>

                        <Button 
                            type="submit" 
                            variant="contained" 
                            fullWidth
                            size="large"
                            disabled={saving}
                            startIcon={saving && <CircularProgress size={20} color="inherit" />}
                        >
                            {saving ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </Box>

                    <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
                        <Alert severity="success" onClose={() => setSuccess(false)}>
                            Profile updated successfully! 🎉
                        </Alert>
                    </Snackbar>
                    
                    <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
                        <Alert severity="error" onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    </Snackbar>
                </CardContent>
            </Card>
        </Container>
    );
};

export default UserProfile;
