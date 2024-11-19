import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ShoppingCart, Package, LogOut, Menu, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]); // Initialize as an empty array
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserToken()
    fetchOrders();
  }, []);
  const checkUserToken = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/check-user', {
        withCredentials: true,
      });
      if (!response.data.success) navigate('/login');
    } catch (error) {
      console.error('Error checking token:', error);
      navigate('/login');
    }
  };


  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/get-all-order', {
        withCredentials: true,
      });
      console.log(response.data.orders);
      if (response.data.success) {
        setOrders(response.data.orders|| []); // Fallback to empty array if undefined
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/logout', {
        withCredentials: true,
      });
      const data = await response.json();
      if (data.success) {
        alert("sucessfully logout")
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleNavigate = (path) => {
    navigate(path);
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

      {/* Orders Content */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-green-800 mb-6">Your Orders</h1>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading orders...</p>
        ) : Array.isArray(orders) && orders.length === 0 ? ( // Ensure orders is an array
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleNavigate('/')}
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {Array.isArray(orders) && orders.map((order) => ( // Safely iterate orders
              <Card key={order._id} className="w-full">
                <CardContent className="flex flex-col md:flex-row items-center p-4">
                  <img
                    src={order.product.productImageUrl}
                    alt={order.product.productName}
                    className="w-32 h-32 object-cover rounded-md mb-4 md:mb-0 md:mr-6"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-green-800">
                          {order.product.productName}
                        </h3>
                        <p className="text-gray-600">{order.product.description}</p>
                        <p className="text-green-600 mt-2">
                          Category: {order.product.productType}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <p className="text-green-900 font-bold text-lg">
                          ₹{order.paymentAmount}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      <p>Order Date: {formatDate(order.date)}</p>
                      <p>Delivery Address: {order.userAddress}</p>
                      <p>Contact: {order.userPhoneNo}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
