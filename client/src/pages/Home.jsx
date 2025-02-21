import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  LinearProgress,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'Technology',
    'Art',
    'Music',
    'Film',
    'Games',
    'Publishing',
    'Fashion',
    'Food',
    'Other'
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: '-createdAt', label: 'Oldest First' },
    { value: 'currentAmount', label: 'Most Funded' },
    { value: 'backers', label: 'Most Backed' }
  ];

  useEffect(() => {
    fetchProjects();
  }, [search, category, sort, page]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 12,
        sort,
        ...(search && { search }),
        ...(category && { category })
      });

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/projects?${params}`
      );

      setProjects(res.data.projects);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (current, target) => {
    return (current / target) * 100;
  };

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 4,
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Fund Innovation
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          Discover and support creative projects
        </Typography>
        <Button
          component={Link}
          to="/create-project"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 2 }}
        >
          Start Your Project
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              variant="outlined"
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              variant="outlined"
              label="Sort By"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {/* Projects Grid */}
      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={4}>
          {projects.map((project) => (
            <Grid item key={project._id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={project.images[0] || 'https://via.placeholder.com/400x200'}
                  alt={project.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {project.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      mb: 2
                    }}
                  >
                    {project.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={calculateProgress(project.currentAmount, project.targetAmount)}
                      sx={{ mb: 1 }}
                    />
                    <Grid container justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        ${project.currentAmount.toLocaleString()} raised
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {calculateProgress(
                          project.currentAmount,
                          project.targetAmount
                        ).toFixed(0)}
                        %
                      </Typography>
                    </Grid>
                  </Box>
                  <Button
                    component={Link}
                    to={`/projects/${project._id}`}
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    View Project
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            sx={{ mr: 1 }}
          >
            Previous
          </Button>
          <Typography sx={{ mx: 2, alignSelf: 'center' }}>
            Page {page} of {totalPages}
          </Typography>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            sx={{ ml: 1 }}
          >
            Next
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Home;
