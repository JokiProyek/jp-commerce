import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import AppAppBar from './components/AppAppBar';
import StoreList from './components/StoreList';
import { Container, Grid } from '@mui/material';
import './App.css';
import productsData from './data/product.json';

const Home = ({ products, addToCart, stores, selectedStore, handleStoreSelect }) => (
  <Container maxWidth="lg" sx={{ py: 4, mt: 10 }}>
    <Grid container spacing={3}>
      <Grid item sm={3}>
        <StoreList 
          stores={stores} 
          selectedStore={selectedStore} 
          handleStoreSelect={handleStoreSelect} 
        />
      </Grid>
      <Grid item sm={9}>
        <ProductList products={products} addToCart={addToCart} />
      </Grid>
    </Grid>
  </Container>
);

const CartPage = ({ cartItems, setCartItems, removeFromCart, updateQuantity, updateNote }) => (
  <Container maxWidth="lg" sx={{ py: 4, mt: 10 }}>
    <Cart
      cartItems={cartItems}
      setCartItems={setCartItems}
      removeFromCart={removeFromCart}
      updateQuantity={updateQuantity}
      updateNote={updateNote}
    />
  </Container>
);

const App = () => {
  const [products] = useState(productsData);
  const [stores, setStores] = useState([]);
  const [cartItems, setCartItems] = useState(JSON.parse(window.localStorage.getItem('cartItems')) ?? []);
  const [selectedStore, setSelectedStore] = useState(null);

  useEffect(() => {
    const items = JSON.parse(window.localStorage.getItem('cartItems'));
    if (items) {
      setCartItems(items);
    }
  }, []);
  
  useEffect(() => {
    window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const uniqueStores = products.reduce((acc, product) => {
      const store = acc.find(item => item.id === product.shop.id);
      if (!store) {
        acc.push({ id: product.shop.id, name: product.shop.name });
      }
      return acc;
    }, []);
    setStores(uniqueStores);
  }, [products]);

  const addToCart = (product) => {
    setCartItems(prevCartItems => {
      const existingProduct = prevCartItems.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCartItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCartItems, { ...product, quantity: 1 }];
      }
    });
  }

  const removeFromCart = (id) => {
    setCartItems(prevItems => {
      return prevItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      ).filter(item => item.quantity > 0);
    });
  };

  

  const updateQuantity = (product, quantity) => {
    if (quantity <= 0) {
      removeFromCart(product);
    } else {
      setCartItems(prevItems => {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity } : item
        );
      });
    }
  };

  const updateNote = (id, note) => {
    setCartItems(prevItems => {
      return prevItems.map(item =>
        item.id === id ? { ...item, note } : item
      );
    });
  };

  const handleStoreSelect = (storeId) => {
    setSelectedStore(storeId);
  };

  const filteredProducts = selectedStore 
    ? products.filter(product => product.shop.id === selectedStore)
    : products;

  return (
    <Router>
      <div className="container">
        <AppAppBar countItem={cartItems.length}/>
        <Routes>
          <Route path="/" element={
            <Home 
              products={filteredProducts} 
              addToCart={addToCart} 
              stores={stores} 
              selectedStore={selectedStore} 
              handleStoreSelect={handleStoreSelect} 
            />
           } />
          <Route path="/cart" element={
            <CartPage 
              cartItems={cartItems}
              setCartItems={setCartItems}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              updateNote={updateNote}
            />
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
