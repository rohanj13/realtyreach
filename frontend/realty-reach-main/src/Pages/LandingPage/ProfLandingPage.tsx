import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  TextField,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  AppBar,
  Toolbar,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Menu as MenuIcon,
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  AccountCircle as AccountCircleIcon,
  ArrowForward as ArrowForwardIcon,
  MonetizationOn as MonetizationOnIcon,
  VerifiedUser as VerifiedUserIcon,
  Speed as SpeedIcon,
  BuildCircle as BuildCircleIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";

const ProfLandingPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isLoggedIn, getUserRole } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isLoggedInUser = isLoggedIn();
  const userRole = getUserRole();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tabValue, setTabValue] = useState(0);
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock professional types data
  const professionalTypes = [
    {
      title: "Buyer's Advocate",
      description: "Help clients find and negotiate the purchase of properties that meet their needs and budget.",
      icon: <SearchIcon fontSize="large" />,
      benefits: ["Market knowledge", "Negotiation expertise", "Time savings"]
    },
    {
      title: "Conveyancer",
      description: "Handle the legal transfer of property ownership from seller to buyer.",
      icon: <BusinessIcon fontSize="large" />,
      benefits: ["Legal guidance", "Document preparation", "Settlement coordination"]
    },
    {
      title: "Building & Pest Inspector",
      description: "Assess properties for structural issues and pest infestations before purchase.",
      icon: <BuildCircleIcon fontSize="large" />,
      benefits: ["Identify defects", "Safety assessments", "Detailed reports"]
    },
    {
      title: "Mortgage Broker",
      description: "Connect clients with lenders to secure financing for property purchases.",
      icon: <MonetizationOnIcon fontSize="large" />,
      benefits: ["Compare loan options", "Better rates", "Application assistance"]
    }
  ];

  // Mock testimonials
  const testimonials = [
    {
      text: "RealtyReach has transformed my business. I've increased my client base by 40% in just 6 months.",
      author: "Michael Chen",
      role: "Buyer's Advocate",
      avatar: "MC"
    },
    {
      text: "The platform's ease of use and professional client management tools help me deliver better service.",
      author: "Sarah Johnson",
      role: "Conveyancer",
      avatar: "SJ"
    },
    {
      text: "I appreciate how RealtyReach connects me with clients who specifically need my services.",
      author: "David Wilson",
      role: "Building Inspector",
      avatar: "DW"
    }
  ];
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                fontWeight: 700,
                color: "primary.main",
                textDecoration: "none",
                flexGrow: { xs: 1, md: 0 }
              }}
            >
              RealtyReach
            </Typography>

            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: "flex", ml: 4 }}>
                <Button component={Link} to="/" color="inherit">Home</Button>
                <Button component={Link} to="/professionals" color="primary">For Professionals</Button>
                <Button component="a" href="#how-it-works" color="inherit">How It Works</Button>
                <Button component="a" href="#benefits" color="inherit">Benefits</Button>
                <Button component="a" href="#join-now" color="inherit">Join Now</Button>
              </Box>
            )}

            <Box sx={{ flexGrow: 0 }}>
              {isLoggedInUser ? (
                <>
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                    <AccountCircleIcon />
                  </IconButton>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => {
                      handleMenuClose();
                      navigate(userRole === 'Professional' ? '/professionaldashboard' : '/customerdashboard');
                    }}>
                      Dashboard
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box>
                  <Button component={Link} to="/login" color="inherit" sx={{ mr: 1 }}>
                    Log In
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    color="primary"
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>

            {isMobile && (
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Grow Your Property Business
              </Typography>
              <Typography variant="h5" paragraph>
                Join RealtyReach and connect with customers actively looking for your professional services.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowForwardIcon />}
                component={Link}
                to="/register"
                sx={{ mt: 2, px: 4, py: 1.5 }}
              >
                Join as a Professional
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
                alt="Professional real estate consultation"
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  boxShadow: 5,
                  height: { xs: 240, md: 320 },
                  objectFit: "cover",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box id="benefits" sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Why Join RealtyReach?
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Our platform connects property professionals with qualified leads, helping you grow your business.
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: 2,
                    p: 1.5,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.light,
                    width: 80,
                    height: 80,
                    margin: '0 auto 16px'
                  }}>
                    <MonetizationOnIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Increase Revenue
                  </Typography>
                  <Typography variant="body1">
                    Access a steady stream of new clients specifically looking for your services, with leads delivered directly to your dashboard.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: 2,
                    p: 1.5,
                    borderRadius: '50%',
                    bgcolor: theme.palette.secondary.light,
                    width: 80,
                    height: 80,
                    margin: '0 auto 16px'
                  }}>
                    <VerifiedUserIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Qualified Leads
                  </Typography>
                  <Typography variant="body1">
                    We match you with clients who need your specific expertise, saving you time and increasing your conversion rates.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: 2,
                    p: 1.5,
                    borderRadius: '50%',
                    bgcolor: theme.palette.success.light,
                    width: 80,
                    height: 80,
                    margin: '0 auto 16px'
                  }}>
                    <SpeedIcon sx={{ fontSize: 40, color: theme.palette.success.main }} />
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    Easy Management
                  </Typography>
                  <Typography variant="body1">
                    Our intuitive dashboard helps you track and respond to job opportunities quickly, so you never miss a potential client.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box id="how-it-works" sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Join RealtyReach in three simple steps
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>1</Avatar>
                <Typography variant="h5" component="h3" gutterBottom>
                  Create Your Profile
                </Typography>
                <Typography variant="body1">
                  Sign up and complete your professional profile with your qualifications, service areas, and expertise.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>2</Avatar>
                <Typography variant="h5" component="h3" gutterBottom>
                  Browse Job Opportunities
                </Typography>
                <Typography variant="body1">
                  Access relevant job listings from customers seeking your specific professional services.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>3</Avatar>
                <Typography variant="h5" component="h3" gutterBottom>
                  Respond & Connect
                </Typography>
                <Typography variant="body1">
                  Submit your proposal to customers and start building valuable client relationships.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Professional Types Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            For All Property Professionals
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 4 }}>
            RealtyReach supports various property professionals
          </Typography>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{ mb: 4 }}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
          >
            {professionalTypes.map((type, idx) => (
              <Tab key={idx} label={type.title} />
            ))}
          </Tabs>

          <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  bgcolor: theme.palette.primary.light,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  margin: '0 auto 24px',
                  alignItems: 'center'
                }}>
                  {React.cloneElement(professionalTypes[tabValue].icon, {
                    sx: { fontSize: 60, color: theme.palette.primary.main }
                  })}
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" component="h3" gutterBottom>
                  {professionalTypes[tabValue].title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {professionalTypes[tabValue].description}
                </Typography>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Key Benefits:
                </Typography>
                <List dense>
                  {professionalTypes[tabValue].benefits.map((benefit, idx) => (
                    <ListItem key={idx} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Success Stories
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
            Hear from professionals who've grown their business with RealtyReach
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                      "{testimonial.text}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {testimonial.author}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box id="join-now" sx={{ py: 8, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h2" gutterBottom>
              Ready to Grow Your Business?
            </Typography>
            <Typography variant="h6" paragraph sx={{ mb: 4 }}>
              Join RealtyReach today and start connecting with customers who need your services.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              to="/register"
              sx={{ px: 6, py: 1.5 }}
            >
              Join as a Professional
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                RealtyReach
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connecting property professionals with customers for successful property transactions.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <List dense>
                <ListItem disableGutters>
                  <Button component={Link} to="/" color="inherit">Home</Button>
                </ListItem>
                <ListItem disableGutters>
                  <Button component={Link} to="/register" color="inherit">Sign Up</Button>
                </ListItem>
                <ListItem disableGutters>
                  <Button component={Link} to="/login" color="inherit">Login</Button>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h6" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Email: support@realtyreach.com
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: (03) 9123 4567
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} RealtyReach. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default ProfLandingPage;
