import React from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  AppBar,
  Toolbar,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Assignment as AssignmentIcon, 
  Build as BuildIcon, 
  Star as StarIcon 
} from '@mui/icons-material';

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box>
      {/* Navigation */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            RealtyReach
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button component={RouterLink} to="/professionals" color="inherit">
              For Professionals
            </Button>
            <Button component={RouterLink} to="/login" variant="outlined">
              Login
            </Button>
            <Button component={RouterLink} to="/register" variant="contained" color="primary">
              Register
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
          pt: 8,
          pb: 10,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Connect with Property Professionals
              </Typography>
              <Typography variant="h5" paragraph sx={{ mb: 4, maxWidth: 600 }}>
                RealtyReach helps you find the right property professionals for your buying journey.
              </Typography>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                size="large"
                color="secondary"
                sx={{ mr: 2 }}
              >
                Get Started
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src="/house.jpg"
                alt="A modern house"
                loading='lazy'
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How it works section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ mb: 6 }}>
          How It Works
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <HomeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" align="center">
                  Create a Job
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Tell us about your property needs and what professionals you're looking for.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <AssignmentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" align="center">
                  Get Quotes
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Receive quotes and proposals from verified local professionals.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <BuildIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" align="center">
                  Compare Options
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Compare services, reviews, and prices to make the best choice.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <StarIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" align="center">
                  Get It Done
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Hire the professional and complete your property journey smoothly.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Professionals section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8, mb: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ mb: 6 }}>
            Property Professionals You Can Connect With
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                title: "Buyer's Advocates",
                description: "Expert advice and representation throughout your property purchase.",
                //image: "/advocate.jpg"
              },
              {
                title: "Conveyancers",
                description: "Legal specialists for property transfers and contracts.",
                //image: "/conveyancer.jpg"
              },
              {
                title: "Building Inspectors",
                description: "Thorough property inspections to identify any issues.",
                //image: "/inspector.jpg"
              },
              {
                title: "Mortgage Brokers",
                description: "Find the best financing options for your property purchase.",
                //image: "/broker.jpg"
              }
            ].map((prof, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    //image={prof.image}
                    alt={prof.title}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x140?text=RealtyReach';
                    }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {prof.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {prof.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              color="primary"
            >
              Start Finding Professionals
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                RealtyReach
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Connecting property buyers with the right professionals.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Typography variant="body2" paragraph>
                <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>About Us</Button>
              </Typography>
              <Typography variant="body2" paragraph>
                <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>For Professionals</Button>
              </Typography>
              <Typography variant="body2" paragraph>
                <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>Help & Support</Button>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2" paragraph>
                Email: support@realtyreach.com
              </Typography>
              <Typography variant="body2" paragraph>
                Phone: 1300 123 456
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="grey.300">
              © {new Date().getFullYear()} RealtyReach. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
