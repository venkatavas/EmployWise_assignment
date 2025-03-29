import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, updateUser } from '../services/api';
import { User, UpdateUserData } from '../types';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UpdateUserData>({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUser = useCallback(async () => {
    try {
      // First check localStorage for any existing updates
      const storedUsers: Record<string, User> = JSON.parse(localStorage.getItem('updatedUsers') || '{}');
      const storedUser = id ? storedUsers[id] : null;

      if (storedUser) {
        setUser(storedUser);
        setFormData({
          first_name: storedUser.first_name,
          last_name: storedUser.last_name,
          email: storedUser.email,
        });
        return;
      }

      // If no stored update, fetch from API
      const response = await getUser(Number(id));
      if (response.data) {
        setUser(response.data);
        setFormData({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
        });
      }
    } catch (err) {
      setError('Failed to fetch user data');
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const updatedUser = await updateUser(Number(id), formData);
      setSuccess('User updated successfully');
      
      // Store the updated user in localStorage
      const storedUsers: Record<string, User> = JSON.parse(localStorage.getItem('updatedUsers') || '{}');
      if (id) {
        storedUsers[id] = updatedUser;
        localStorage.setItem('updatedUsers', JSON.stringify(storedUsers));
      }
      
      setTimeout(() => navigate('/users'), 1500);
    } catch (err) {
      setError('Failed to update user');
    }
  };

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Edit User
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              margin="normal"
              required
            />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Update
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/users')}
                fullWidth
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default UserEdit; 