import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { StoreMallDirectoryOutlined, AddShoppingCart } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const ProductItem = ({ product, addToCart }) => {
  const { id, price, title, description, images, shop, discount_percentage } = product;

  return (
    <Grid key={id} item xs={12} sm={6} md={4}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          height="150"
          image={images[1]}
          alt={title}
        />
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography variant="h6">
            {title}
          </Typography>
          <Typography gutterBottom variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Grid container justifyContent="space-between" alignItems="center">
              <Typography  variant="h6" color="primary">
                ${((price * (100 - (discount_percentage ?? 0))) / 100).toFixed(2)}
              </Typography>
            {discount_percentage && (
            <Grid item  alignItems="center" xs="auto">
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                ${price}
              </Typography>
              <Typography gutterBottom variant="body2" color="text.secondary">
                {discount_percentage}% Disc.
              </Typography>
            </Grid>
            )}
          </Grid>
          <Grid container justifyContent="space-between" alignItems="center" mt={1}>
            <Grid item container alignItems="center" xs="auto">
              <StoreMallDirectoryOutlined />
              <Typography variant="body2" color="text.secondary" px={1}>
                {shop.name}
              </Typography>
            </Grid>
            <IconButton
              size="medium"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
              onClick={() => addToCart(product)}
            >
              <AddShoppingCart fontSize="small"/>
            </IconButton>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ProductItem;
