import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  ListItemSecondaryAction,
  Button
} from '@mui/material';
import {
  Close as CloseIcon,
  Circle as CircleIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  RateReview as RateReviewIcon,
  MoveToInbox as InboxIcon
} from '@mui/icons-material';

interface NotificationItem {
  id: string;
  title: string;
  content: string;
  time: string;
  type: 'job' | 'quote' | 'message' | 'system';
  read: boolean;
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  // Mock notifications data
  const notifications: NotificationItem[] = [
    {
      id: '1',
      title: 'New Quote Received',
      content: 'Samantha Lee has submitted a quote for your property job.',
      time: '5 minutes ago',
      type: 'quote',
      read: false
    },
    {
      id: '2',
      title: 'Job Update',
      content: 'Your job "House Purchase in Richmond" has been updated.',
      time: '1 hour ago',
      type: 'job',
      read: false
    },
    {
      id: '3',
      title: 'Message from John Smith',
      content: 'Hi, I would like to schedule a call to discuss...',
      time: '3 hours ago',
      type: 'message',
      read: true
    },
    {
      id: '4',
      title: 'Profile Completion Reminder',
      content: 'Please complete your profile to get the most out of RealtyReach.',
      time: '1 day ago',
      type: 'system',
      read: true
    }
  ];

  const getIconByType = (type: string) => {
    switch(type) {
      case 'job':
        return <AssignmentIcon color="primary" />;
      case 'quote':
        return <RateReviewIcon color="info" />;
      case 'message':
        return <PersonIcon color="secondary" />;
      case 'system':
      default:
        return <InboxIcon color="action" />;
    }
  };
  
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Badge 
              badgeContent={unreadCount} 
              color="error" 
              sx={{ ml: 1.5 }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <Button size="small">Mark all as read</Button>
      </Box>
      
      {notifications.length > 0 ? (
        <List sx={{ width: '100%' }}>
          {notifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem alignItems="flex-start" sx={{ pl: 2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {getIconByType(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography 
                        component="span"
                        variant="subtitle2"
                        color="text.primary"
                        sx={{ fontWeight: notification.read ? 'regular' : 'bold' }}
                      >
                        {notification.title}
                      </Typography>
                    </React.Fragment>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: 'inline', mt: 0.5 }}
                      >
                        {notification.content}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {notification.time}
                      </Typography>
                    </React.Fragment>
                  }
                />
                <ListItemSecondaryAction>
                  {!notification.read && (
                    <CircleIcon color="primary" fontSize="small" sx={{ width: 8, height: 8 }} />
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No notifications</Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default NotificationsDrawer;
