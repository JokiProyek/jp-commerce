import React from 'react';
import StoreIcon from '@mui/icons-material/Store';
import { Box, Divider, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

const StoreList = ({ stores, selectedStore, handleStoreSelect }) => {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, p: { xs: 1, md: 2 }, border: '1px solid #ddd' }}>
      <List>
        <ListItemButton  
          selected={selectedStore === null} 
          onClick={() => handleStoreSelect(null)}
        >
          <ListItemIcon>
            <StoreIcon />
          </ListItemIcon>
          <ListItemText primary="All Store" />
        </ListItemButton>
        <Divider />
        {stores.map(store => (
          <ListItemButton 
            key={store.id}  
            selected={selectedStore === store.id} 
            onClick={() => handleStoreSelect(store.id)}
          >
            <ListItemIcon>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText primary={store.name} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default StoreList;
