import React from 'react';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default () => {
  return (
    <AppBar position="fixed">
      <Toolbar variant="dense">
        {/* <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton> */}
        <Typography variant="h6" color="inherit" component="div">
          GIO Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};