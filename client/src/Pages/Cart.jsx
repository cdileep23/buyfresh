import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ShoppingCart, Package, LogOut, Menu, X, Trash2 } from 'lucide-react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/get-all-cart-items', {
        withCredentials: true,
      });

      console.log(response.data);

      if (response.data.success) {
        setCartItems(response.data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      console.log(cartItemId);

      const response = await axios.get(`http://localhost:8080/api/user/cart/${cartItemId}`, {
        withCredentials: true,
      });

      console.log(response.data);

      if (response.data.success) {
        alert('Item removed from cart successfully!');
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      alert('Failed to remove item from cart');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/logout', {
   withCredentials:true,
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.productPrice, 0);
  };

  const handleNavigate = (path) => {
    window.location.href = path;
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/product/user/buyProduct',
       // Add any required request body
        {
          withCredentials: true,
        }
      );

      console.log(response.data);

      if (response.data.success) {
        alert(response.data.message); // "Purchase successful"
        fetchCartItems(); // Refresh the cart to show updated items
      } else {
        alert('Checkout failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred during checkout. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-green-700">FreshBuy</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          <button onClick={() => handleNavigate('/')} className="flex items-center text-green-700 hover:underline">
            <Home className="mr-2" /> Products
          </button>
          <button onClick={() => handleNavigate('/cart')} className="flex items-center text-green-700 hover:underline">
            <ShoppingCart className="mr-2" /> Cart
          </button>
          <button onClick={() => handleNavigate('/orders')} className="flex items-center text-green-700 hover:underline">
            <Package className="mr-2" /> Orders
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        <Button
          variant="destructive"
          onClick={handleLogout}
          className="hidden md:flex bg-red-500 hover:bg-red-600"
        >
          <LogOut className="mr-2" /> Logout
        </Button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col space-y-2 p-4">
            <button onClick={() => handleNavigate('/')} className="flex items-center text-green-700">
              <Home className="mr-2" /> Products
            </button>
            <button onClick={() => handleNavigate('/cart')} className="flex items-center text-green-700">
              <ShoppingCart className="mr-2" /> Cart
            </button>
            <button onClick={() => handleNavigate('/orders')} className="flex items-center text-green-700">
              <Package className="mr-2" /> Orders
            </button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex items-center bg-red-500 hover:bg-red-600"
            >
              <LogOut className="mr-2" /> Logout
            </Button>
          </div>
        </div>
      )}

      {/* Cart Content */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-green-800 mb-6">Your Shopping Cart</h1>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading cart items...</p>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleNavigate('/')}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item._id} className="w-full">
                <CardContent className="flex flex-col md:flex-row items-center p-4">
                  <img
                    src={item.product.productImageUrl}
                    alt={item.product.productName}
                    className="w-32 h-32 object-cover rounded-md mb-4 md:mb-0 md:mr-6"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-green-800">
                      {item.product.productName}
                    </h3>
                    <p className="text-gray-600">{item.product.description}</p>
                    <p className="text-green-600 mt-2">
                      Category: {item.product.productType}
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
                      <p className="text-green-900 font-bold text-lg">
                        ₹{item.product.productPrice}
                      </p>
                      <Button
                        variant="destructive"
                        onClick={() => handleRemoveFromCart(item._id)}
                        className="mt-2 md:mt-0"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Cart Summary */}
            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-green-800">Total</h3>
                  <p className="text-2xl font-bold text-green-900">₹{calculateTotal()}</p>
                </div>
                <Button
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
