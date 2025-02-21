import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Tabs,
  Tab,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '../context/AuthContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedReward, setSelectedReward] = useState(null);
  const [pledgeAmount, setPledgeAmount] = useState(0);
  const [showPledgeDialog, setShowPledgeDialog] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/projects/${id}`
      );
      setProject(res.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const calculateProgress = (current, target) => {
    return (current / target) * 100;
  };

  const handleRewardSelect = (reward) => {
    setSelectedReward(reward);
    setPledgeAmount(reward.amount);
    setShowPledgeDialog(true);
  };

  const handlePledgeSubmit = async (details) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payments/capture-order`,
        {
          orderId: details.orderID,
          projectId: project._id,
          rewardId: selectedReward?._id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Refresh project data
      fetchProject();
      setShowPledgeDialog(false);
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (!project) {
    return (
      <Container>
        <Typography>Project not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Project Image */}
          <Box
            component="img"
            src={project.images[0] || 'https://via.placeholder.com/800x400'}
            alt={project.title}
            sx={{
              width: '100%',
              height: 400,
              objectFit: 'cover',
              borderRadius: 2,
              mb: 4
            }}
          />

          {/* Tabs Section */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={selectedTab} onChange={handleTabChange}>
              <Tab label="Story" />
              <Tab label="Updates" />
              <Tab label="FAQ" />
              <Tab label="Comments" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ mb: 4 }}>
            {selectedTab === 0 && (
              <Typography variant="body1">{project.description}</Typography>
            )}

            {selectedTab === 1 && (
              <List>
                {project.updates.map((update, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemText
                      primary={update.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {new Date(update.date).toLocaleDateString()}
                          </Typography>
                          {" — " + update.content}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}

            {selectedTab === 2 && (
              <List>
                {project.faqs.map((faq, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={faq.question}
                      secondary={faq.answer}
                    />
                  </ListItem>
                ))}
              </List>
            )}

            {selectedTab === 3 && (
              <Typography>Comments section coming soon...</Typography>
            )}
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                ${project.currentAmount.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                pledged of ${project.targetAmount.toLocaleString()} goal
              </Typography>

              <LinearProgress
                variant="determinate"
                value={calculateProgress(project.currentAmount, project.targetAmount)}
                sx={{ my: 2 }}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="h6">
                    {project.backers.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    backers
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">
                    {Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    days to go
                  </Typography>
                </Grid>
              </Grid>

              {user && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={() => setShowPledgeDialog(true)}
                >
                  Back this project
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Creator Info */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About the Creator
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={project.creator.profileImage}
                  alt={project.creator.name}
                  sx={{ mr: 2 }}
                />
                <Typography>{project.creator.name}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {project.creator.bio || 'No bio available'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Rewards Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Support this project
        </Typography>
        <Grid container spacing={3}>
          {project.rewards.map((reward) => (
            <Grid item xs={12} sm={6} md={4} key={reward._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pledge ${reward.amount}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {reward.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {reward.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Estimated delivery: {new Date(reward.estimatedDelivery).toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleRewardSelect(reward)}
                  >
                    Select this reward
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Pledge Dialog */}
      <Dialog
        open={showPledgeDialog}
        onClose={() => setShowPledgeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Back this project</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Selected reward: {selectedReward?.title || 'Custom pledge'}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Pledge amount: ${pledgeAmount}
          </Typography>
          <PayPalButtons
            createOrder={async () => {
              try {
                const response = await axios.post(
                  `${process.env.REACT_APP_API_URL}/api/payments/create-order`,
                  {
                    projectId: project._id,
                    amount: pledgeAmount,
                    rewardId: selectedReward?._id
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                  }
                );
                return response.data.orderId;
              } catch (error) {
                console.error('Error creating order:', error);
                throw error;
              }
            }}
            onApprove={async (data, actions) => {
              const details = await actions.order.capture();
              handlePledgeSubmit(details);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPledgeDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectDetails;
