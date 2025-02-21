import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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

const ProjectCreate = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [rewards, setRewards] = useState([]);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
      targetAmount: '',
      deadline: '',
      tags: ''
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('Title is required')
        .min(5, 'Title must be at least 5 characters'),
      description: Yup.string()
        .required('Description is required')
        .min(50, 'Description must be at least 50 characters'),
      category: Yup.string()
        .required('Category is required'),
      targetAmount: Yup.number()
        .required('Target amount is required')
        .min(100, 'Target amount must be at least $100'),
      deadline: Yup.date()
        .required('Deadline is required')
        .min(new Date(), 'Deadline must be in the future'),
      tags: Yup.string()
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('category', values.category);
        formData.append('targetAmount', values.targetAmount);
        formData.append('deadline', values.deadline);
        formData.append('tags', values.tags.split(',').map(tag => tag.trim()));
        formData.append('rewards', JSON.stringify(rewards));

        images.forEach((image) => {
          formData.append('images', image);
        });

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/projects`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        navigate(`/projects/${response.data._id}`);
      } catch (error) {
        console.error('Error creating project:', error);
      }
    }
  });

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addReward = () => {
    setRewards([
      ...rewards,
      {
        title: '',
        description: '',
        amount: '',
        estimatedDelivery: '',
        shippingInfo: ''
      }
    ]);
  };

  const updateReward = (index, field, value) => {
    const updatedRewards = [...rewards];
    updatedRewards[index][field] = value;
    setRewards(updatedRewards);
  };

  const removeReward = (index) => {
    setRewards(rewards.filter((_, i) => i !== index));
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Your Project
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Project Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Target Amount ($)"
                name="targetAmount"
                value={formik.values.targetAmount}
                onChange={formik.handleChange}
                error={formik.touched.targetAmount && Boolean(formik.errors.targetAmount)}
                helperText={formik.touched.targetAmount && formik.errors.targetAmount}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Deadline"
                name="deadline"
                value={formik.values.deadline}
                onChange={formik.handleChange}
                error={formik.touched.deadline && Boolean(formik.errors.deadline)}
                helperText={formik.touched.deadline && formik.errors.deadline}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                name="tags"
                value={formik.values.tags}
                onChange={formik.handleChange}
                helperText="Add relevant tags to help people find your project"
              />
            </Grid>

            {/* Images Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Project Images
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                multiple
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<AddIcon />}
                >
                  Add Images
                </Button>
              </label>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                {images.map((image, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={URL.createObjectURL(image)}
                        alt={`Project image ${index + 1}`}
                      />
                      <CardContent>
                        <IconButton
                          size="small"
                          onClick={() => removeImage(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Rewards Section */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Rewards</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addReward}
                >
                  Add Reward
                </Button>
              </Box>
            </Grid>

            {rewards.map((reward, index) => (
              <Grid item xs={12} key={index}>
                <Card sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Reward Title"
                        value={reward.title}
                        onChange={(e) => updateReward(index, 'title', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Reward Description"
                        value={reward.description}
                        onChange={(e) => updateReward(index, 'description', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Amount ($)"
                        value={reward.amount}
                        onChange={(e) => updateReward(index, 'amount', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Estimated Delivery"
                        value={reward.estimatedDelivery}
                        onChange={(e) => updateReward(index, 'estimatedDelivery', e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Shipping Information"
                        value={reward.shippingInfo}
                        onChange={(e) => updateReward(index, 'shippingInfo', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => removeReward(index)}
                      >
                        Remove Reward
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Create Project
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ProjectCreate;
