import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUsers, deleteUser } from '../services/api';
import { User } from '../types';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Pagination,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await getUsers(page);
      // Get updated users from localStorage
      const storedUsers: Record<string, User> = JSON.parse(localStorage.getItem('updatedUsers') || '{}');
      
      // Merge API users with stored updates
      const mergedUsers = response.data.map(user => {
        const updatedUser = storedUsers[user.id.toString()];
        return updatedUser || user;
      });

      setUsers(mergedUsers);
      setTotalPages(response.total_pages);
    } catch (err) {
      setError('Failed to fetch users');
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        // Remove from localStorage if exists
        const storedUsers: Record<string, User> = JSON.parse(localStorage.getItem('updatedUsers') || '{}');
        delete storedUsers[id.toString()];
        localStorage.setItem('updatedUsers', JSON.stringify(storedUsers));
        // Update local state
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/users/${id}/edit`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Users
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={logout}
        >
          Logout
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid 
              key={user.id}
              item
              xs={12} 
              sm={6} 
              md={4}
            >
              <Card sx={{ width: '100%' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={user.avatar}
                  alt={`${user.first_name} ${user.last_name}`}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {user.first_name} {user.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(user.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default UserList; 
