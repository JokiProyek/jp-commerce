import React from 'react';
import Grid from '@mui/material/Grid';
import ProductItem from './ProductItem';

const ProductList = ({ products, addToCart }) => {
  return (
    <Grid container spacing={{ xs:2, md:3 }}>
      {products.map(product => (
        <ProductItem key={product.id} product={product} addToCart={addToCart} />
      ))}
    </Grid>
  );
};

export default ProductList;
