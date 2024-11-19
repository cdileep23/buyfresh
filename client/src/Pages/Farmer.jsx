import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { 
  Package, 
  ShoppingCart, 
  LogOut, 
  Sprout, 
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FarmerDashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);

  const [newProduct, setNewProduct] = useState({
    imageFile: null,
    productType: '',
    productName: '',
    description: '',
    productPacked: '',
    productExpire: '',
    productPrice: '',
    web3Id: '',
    contractAddress: ''
  });
  const navigate = useNavigate();

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/order/${orderId}/updateStatus`, {
        status: newStatus,
      });

      const updatedOrder = response.data.order;
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? { ...order, status: updatedOrder.status } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const checkUserToken = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/user/check-user", 
        { withCredentials: true }
      );
      if (!response.data.success) {
        navigate('/login');
      }
    } catch (error) {
      console.error("Error checking token:", error);
      navigate("/login");
    }
  };

  useEffect(() => {
    checkUserToken();
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/product/getallproductsbyseller', {
        withCredentials: true
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/farmer/get-Allorders', {
        withCredentials: true
      });
      console.log(response.data.orders)
      setOrders(response.data.orders);

      // Calculate revenue
      const totalRevenue = response.data.orders
        .filter(order => order.status === 'Delivered')
        .reduce((sum, order) => sum + order.paymentAmount, 0);

      setRevenue(totalRevenue);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user/logout", {
        withCredentials: true
      });
      if (response.data.success) {
        alert(response.data.message);
        navigate('/login');
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newProduct).forEach(key => {
        formData.append(key, newProduct[key]);
      });

      const response = await fetch(
        'http://localhost:8080/api/product/seller/createProduct',
        {
          method: 'POST',
          credentials: 'include',
          body: formData
        }
      );
      const data = await response.json();
      alert(data.message);
      setNewProduct({
        imageFile: null,
        productType: '',
        productName: '',
        description: '',
        productPacked: '',
        productExpire: '',
        productPrice: '',
        web3Id: '',
        contractAddress: ''
      });
      fetchProducts();
    } catch (error) {
      console.error("Add product error:", error);
      alert("Failed to add product");
    }
  };

  const deliveredOrders = orders.filter(order => order.status === 'Delivered');
  const otherOrders = orders.filter(order => order.status !== 'Delivered');

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <nav className="bg-white border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Sprout className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-semibold text-green-800">Farmer Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-green-600 hover:text-green-800 hover:bg-green-50"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white/90">
            <CardContent className="flex items-center p-6">
              <div className="rounded-full p-3 bg-green-100">
                <Package className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <h3 className="text-2xl font-bold text-green-800">{products.length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90">
            <CardContent className="flex items-center p-6">
              <div className="rounded-full p-3 bg-green-100">
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <h3 className="text-2xl font-bold text-green-800">{otherOrders.length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/90">
            <CardContent className="flex items-center p-6">
              <div className="rounded-full p-3 bg-green-100">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <h3 className="text-2xl font-bold text-green-800">₹{revenue.toFixed(2)}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-white/90 p-1 space-x-2">
            <TabsTrigger value="products" className="data-[state=active]:bg-green-100">
              My Products
            </TabsTrigger>
            <TabsTrigger value="add-product" className="data-[state=active]:bg-green-100">
              Add Product
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-green-100">
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <Card key={product._id || product.id} className="bg-white/90">
                  <CardContent className="p-4">
                    <img
                      src={product.productImageUrl || '/api/placeholder/200/200'}
                      alt={product.productName}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h3 className="font-semibold text-lg text-green-800">{product.productName}</h3>
                    <p className="text-green-600 font-medium">₹{product.productPrice}</p>
                    <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add-product">
          <form onSubmit={handleAddProduct} className="grid gap-4">
                  {/* Image File Input */}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        imageFile: e.target.files[0],
                      }))
                    }
                    className="border-gray-300 rounded-md"
                  />

                  {/* Product Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="Product Type"
                      value={newProduct.productType}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          productType: e.target.value,
                        }))
                      }
                      className="border-gray-300 rounded-md"
                    />
                    <Input
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.productName}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          productName: e.target.value,
                        }))
                      }
                      className="border-gray-300 rounded-md"
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="border-gray-300 rounded-md"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      placeholder="Product Packed Date"
                      value={newProduct.productPacked}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          productPacked: e.target.value,
                        }))
                      }
                      className="border-gray-300 rounded-md"
                    />
                    <Input
                      type="date"
                      placeholder="Product Expiry Date"
                      value={newProduct.productExpire}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          productExpire: e.target.value,
                        }))
                      }
                      className="border-gray-300 rounded-md"
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder="Product Price"
                    value={newProduct.productPrice}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        productPrice: e.target.value,
                      }))
                    }
                    className="border-gray-300 rounded-md"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="Web3 ID"
                      value={newProduct.web3Id}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          web3Id: e.target.value,
                        }))
                      }
                      className="border-gray-300 rounded-md"
                    />
                    <Input
                      type="text"
                      placeholder="Contract Address"
                      value={newProduct.contractAddress}
                      onChange={(e) =>
                        setNewProduct((prev) => ({
                          ...prev,
                          contractAddress: e.target.value,
                        }))
                      }
                      className="border-gray-300 rounded-md"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 text-white hover:bg-green-700">
                    Add Product
                  </Button>
                </form>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-6">
              <h3 className="font-semibold text-xl text-green-800">Delivered Orders</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deliveredOrders.map(order => (
              <Card key={order._id} className="bg-white/90">
              <CardContent className="p-4 flex justify-between items-center">
                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-green-800">
                    {order.product.productName}
                  </h3>
                  <p className="text-sm text-gray-600">Customer: {order.userName}</p>
                  <p className="text-sm text-gray-600">Amount: ₹{order.paymentAmount}</p>
                </div>
            
                {/* Product Image */}
                <div className="ml-4">
                  <img
                    src={order.product.productImageUrl}
                    alt={order.product.productName}
                    className="w-24 h-24 object-cover rounded-md shadow-md"
                  />
                </div>
              </CardContent>
            </Card>
            
                ))}
              </div>

              <h3 className="font-semibold text-xl text-green-800">Active Orders</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherOrders.map(order => (
                  <Card key={order._id} className="bg-white/90">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg text-green-800">{order.product.productName}</h3>
                      <p className="text-sm text-gray-600">Customer: {order.userName}</p>
                      <p className="text-sm text-gray-600">Amount: ₹{order.paymentAmount}</p>
                      <div className="mt-4 flex space-x-2">
                        {order.status !== 'Delivered' && (
                          <>
                            <Button
                              variant="outline"
                              onClick={() => updateOrderStatus(order._id, 'Delivered')}
                            >
                              Mark as Delivered
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => updateOrderStatus(order._id, 'Canceled')}
                            >
                              Cancel Order
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FarmerDashboard;
