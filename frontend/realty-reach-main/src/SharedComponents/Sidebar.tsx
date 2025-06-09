import React, {useContext} from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Button, Divider } from "@mui/material";
import { Home, Business, Email, Settings, Logout } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../Context/userContext";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  variant?: "permanent" | "persistent" | "temporary";
}

const Sidebar: React.FC<SidebarProps> = ({ 
  open = true, 
  onClose = () => {}, 
  variant = "permanent" 
}) => {
  const { logout, getUserRole } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = getUserRole();

  const isCustomer = userRole === "Customer";
  const isProfessional = userRole === "Professional";

  const menuItems = [
    {
      text: "Dashboard",
      icon: <Home />,
      path: isCustomer ? "/customerdashboard" : "/professionaldashboard",
      roles: ["Customer", "Professional"],
    },
    {
      text: "My Jobs",
      icon: <Business />,
      path: "/my-jobs",
      roles: ["Customer"],
    },
    {
      text: "Available Jobs",
      icon: <Business />,
      path: "/available-jobs",
      roles: ["Professional"],
    },
    {
      text: "Messages",
      icon: <Email />,
      path: "/messages",
      roles: ["Customer", "Professional"],
    },
    {
      text: "Settings",
      icon: <Settings />,
      path: "/settings",
      roles: ["Customer", "Professional"],
    },
  ];

  const drawerContent = (
    <>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          RealtyReach
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {isCustomer ? "Customer Portal" : "Professional Portal"}
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {menuItems.filter(item => item.roles.includes(userRole || "")).map((item) => (
          <ListItem 
            button 
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Logout />}
          onClick={logout}
          fullWidth
        >
          Logout
        </Button>
      </Box>
    </>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
