import React, { useState, useEffect } from 'react';
import CartItem from './CartItem';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { Box, Checkbox, Grid } from '@mui/material';
import { StoreMallDirectoryOutlined } from '@mui/icons-material';

const Cart = ({ cartItems, setCartItems, removeFromCart, updateQuantity, updateNote }) => {
  const [groupedCartItems, setGroupedCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    const groupedItems = cartItems.reduce((acc, item) => {
      const storeId = item.shop.id;
      if (!acc[storeId]) {
        acc[storeId] = [];
      }
      acc[storeId].push(item);
      return acc;
    }, {});
    setGroupedCartItems(Object.entries(groupedItems));
  }, [cartItems]);

  const handleCheck = (id) => {
    setCheckedItems(prevState =>
      prevState.includes(id)
        ? prevState.filter(item => item !== id)
        : [...prevState, id]
    );
  };

  const checkAll = () => {
    const allItemIds = cartItems.map(item => item.id);
    if (checkedItems.length === allItemIds.length) {
      setCheckedItems([]); 
    } else {
      setCheckedItems(allItemIds);
    }
  };

  const deleteCheckedItems = () => {
    checkedItems.forEach(itemId => {
      const itemToRemove = cartItems.find(item => item.id === itemId);
      if (itemToRemove) {
        setCartItems(prevCartItems =>
          prevCartItems.filter(item => item.id !== itemId)
        );
      }
    });
    setCheckedItems([]);
  };

  const itemsByStore = (storeId) => {
    const items = groupedCartItems.find(([id, items]) => id === storeId)?.[1] || [];
    return items;
  }

  const isStoreChecked = (storeId) => {
    return itemsByStore(storeId).every(item => checkedItems.includes(item.id));
  }

  const checkByStore = (storeId) => {
    const items = itemsByStore(storeId);
    const itemsId = items.map(item => item.id);
    items.every(item => checkedItems.includes(item.id)) 
      ? setCheckedItems(prevState => prevState.filter(item => !itemsId.includes(item)))
      : setCheckedItems(prevState => [...new Set([...prevState, ...itemsId])]);
  };

  const subtotalPrice = groupedCartItems.reduce((acc, [storeId, items]) => {
    const storeSubtotal = items.reduce((storeAcc, item) => {
      if (checkedItems.includes(item.id)) {
        return storeAcc + item.price * item.quantity;
      }
      return storeAcc;
    }, 0);
    return acc + storeSubtotal;
  }, 0);

  const totalDiscount = groupedCartItems.reduce((acc, [storeId, items]) => {
    const storeDiscount = items.reduce((storeAcc, item) => {
      if (checkedItems.includes(item.id) && item.discount_percentage) {
        return storeAcc + (item.price * item.quantity * item.discount_percentage) / 100;
      }
      return storeAcc;
    }, 0);
    return acc + storeDiscount;
  }, 0);

  const totalPrice = subtotalPrice - totalDiscount;

  const handleCheckout = () => {
    if (checkedItems.length === 0) {
      return;
    }
    if (window.confirm('Are you sure you want to checkout?')) {
      deleteCheckedItems();
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={9}>
          {groupedCartItems.length === 0 ? (
            <Typography variant="subtitle1">Your cart is empty</Typography>
          ) : (
            <List>
              <ListItem sx={{ border: '1px solid #ccc', borderRadius: '8px', my: 1 }}>
                <Checkbox
                  checked={checkedItems.length === cartItems.length}
                  onChange={checkAll}
                />
                <ListItemText primary={"Select All"} />
                {checkedItems.length > 0 && (
                  <Button variant="text" color="primary" onClick={deleteCheckedItems}>
                    Delete
                  </Button>
                )}
              </ListItem>
              {groupedCartItems.map(([storeId, items]) => (
                <React.Fragment key={storeId}>
                  <Divider variant='middle' component='li' />
                  <List sx={{ border: '1px solid #ccc', borderRadius: '8px', my: 1 }}>
                    <ListItem>
                      <Checkbox
                        checked={isStoreChecked(storeId)}
                        onChange={() => checkByStore(storeId)}
                      />
                      <StoreMallDirectoryOutlined />
                      <ListItemText className='mx-3' primary={items[0].shop.name} />
                    </ListItem>
                    {items.map(item => (
                      <React.Fragment key={item.id}>
                        <CartItem
                          item={item}
                          handleCheck={() => handleCheck(item.id)}
                          checked={checkedItems.includes(item.id)}
                          removeFromCart={removeFromCart}
                          updateQuantity={updateQuantity}
                          updateNote={updateNote}
                        />
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </React.Fragment>
              ))}
            </List>
          )}
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box p={2} sx={{ border: '1px solid #ccc', borderRadius: '8px', my: 2 }}>
            <Typography gutterBottom variant="h5">Summary</Typography>
            <Grid sx={{ display:'flex' }}>
              <ListItemText secondary="Subtotal" />
              <Typography variant="body1">${subtotalPrice.toFixed(2)}</Typography>
            </Grid>
            <Grid sx={{ display:'flex' }}>
              <ListItemText secondary="Total Discount" />
              <Typography variant="body1">${totalDiscount.toFixed(2)}</Typography>
            </Grid>
            <Divider />
            <Grid sx={{ display:'flex' }}>
              <ListItemText secondary="Total" />
              <Typography variant="h6" color={'primary'}>${totalPrice.toFixed(2)}</Typography>
            </Grid>
            <Button
              variant='contained'
              sx={{ mt: 2, width: '100%' }}
              onClick={handleCheckout}
              disabled={checkedItems.length === 0}
            >
              Checkout
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Cart;
