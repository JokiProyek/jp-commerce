import React, { useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { EditNote, DeleteOutlineRounded } from '@mui/icons-material';
import { Box, Chip, Popover, TextField, Typography, Grid, Badge } from '@mui/material';

const style = {
  padding: 2,
  borderRadius: 2,
  boxShadow: 3,
  maxWidth: 400,
};

const CartItem = ({ item, handleCheck, checked, removeFromCart, updateQuantity, updateNote }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [note, setNote] = useState(item.note || '');
  const [savedNote, setSavedNote] = useState(item.note || '');

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSave = () => {
    setSavedNote(note);
    updateNote(item.id, note);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
      <Grid container alignItems='center'>
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            checked={checked}
            onChange={() => handleCheck(item.id)}
          />
          <ListItemAvatar>
            <Avatar
              sx={{ width: 60, height: 60, borderRadius: 2, mr: 2 }}
              alt={item.title}
              src={item.images[0]}
            />
          </ListItemAvatar>
          <ListItemText
            primary={item.title}
            secondary={
              <>
                <span>{`$${item.price}`}</span>
                {item.discount_percentage && <span>{`  |  Discount: ${item.discount_percentage}%`}</span>}
              </>
            }
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {savedNote && (
            <Chip label={savedNote} variant='outlined' sx={{ my: 1, display: { xs: 'none', sm: 'flex' } }} />
          )}
          <IconButton
              edge="end"
              aria-label="edit-notes"
              variant="outlined"
              onClick={handleOpen}
              sx={{ marginRight: '10px' }}
            >
            <Badge color="secondary" variant="dot" invisible={!savedNote} >
              <EditNote />
            </Badge>
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Box sx={style}>
              <Typography variant="h6" component="h2">
                Product Notes
              </Typography>
              <TextField
                label="Add your notes."
                fullWidth
                multiline
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                sx={{ marginTop: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button onClick={handleClose} variant="outlined">
                  Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                  Save
                </Button>
              </Box>
            </Box>
          </Popover>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => removeFromCart(item.id)}
            sx={{ marginRight: '10px' }}
          >
            <DeleteOutlineRounded />
          </IconButton>
          <ButtonGroup variant="outlined" aria-label="Quantity button" sx={{
            '& button': {
              minWidth: '30px',
              borderLeft: '1px solid transparent',
              borderRight: '1px solid transparent',
              '&:first-child': {
                borderLeft: '1px solid'
              },
              '&:last-child': {
                borderRight: '1px solid'
              },
            }
          }}>
            <Button onClick={() => updateQuantity(item, item.quantity - 1)}>-</Button>
            <Button>{item.quantity}</Button>
            <Button onClick={() => updateQuantity(item, item.quantity + 1)}>+</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </ListItem>
  );
};

export default CartItem;
