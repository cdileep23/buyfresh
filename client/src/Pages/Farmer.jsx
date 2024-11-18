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

  const checkUserToken = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/user/check-user", 
        { withCredentials: true }
      );
      const data = response.data;
      console.log(data);

      if (!data.success) {
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
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/product/getallproductsbyseller', {
        withCredentials: true
      });
      setProducts(response.data.products); // Assuming your backend returns an array of products
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user/logout", {
        withCredentials: true
      });

      console.log(response.data);

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
      console.log(data);
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
      })
      fetchProducts(); // Reload the products after adding a new one
    } catch (error) {
      console.error("Add product error:", error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Navbar */}
      <nav className="bg-white border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Sprout className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-semibold text-green-800">Farmer Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-green-700">{user?.email}</div>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
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
                <h3 className="text-2xl font-bold text-green-800">{orders.length}</h3>
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
                <h3 className="text-2xl font-bold text-green-800">$0.00</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
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

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product._id || product.id} className="bg-white/90">
                  <CardContent className="p-4">
                    <img
                      src={product.productImageUrl || '/api/placeholder/200/200'}
                      alt={product.productName}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                    <h3 className="font-semibold text-lg text-green-800">{product.productName}</h3>
                    <p className="text-green-600 font-medium">${product.productPrice}</p>
                    <p className="text-gray-600">Type: {product.productType}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Add Product Tab */}
          <TabsContent value="add-product">
            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle className="text-green-800">Add New Product</CardTitle>
                <CardDescription className="text-green-600">
                  List your new product for customers to purchase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <Input
                    type="file"
                    onChange={(e) => setNewProduct({...newProduct, imageFile: e.target.files[0]})}
                    className="border-green-200 focus:ring-green-500"
                    required
                  />
                  <Input
                    placeholder="Product Type"
                    value={newProduct.productType}
                    onChange={(e) => setNewProduct({...newProduct, productType: e.target.value})}
                    className="border-green-200 focus:ring-green-500"
                    required
                  />
                  <Input
                    placeholder="Product Name"
                    value={newProduct.productName}
                    onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})}
                    className="border-green-200 focus:ring-green-500"
                    required
                  />
                  <Input
                    placeholder="Product Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="border-green-200 focus:ring-green-500"
                    required
                  />
                  <Input
                    type="date"
                    placeholder="Packed Date"
                    value={newProduct.productPacked}
                    onChange={(e) => setNewProduct({...newProduct, productPacked: e.target.value})}
                    className="border-green-200 focus:ring-green-500"
                    required
                  />
                  <Input
                    type="date"
                    placeholder="Expiry Date"
                    value={newProduct.productExpire}
                    onChange={(e) => setNewProduct({...newProduct, productExpire: e.target.value})}
                    className="border-green-200 focus:ring-green-500"
                    required
                  />
                  <Input
                    placeholder="Product Price"
                    value={newProduct.productPrice}
                    onChange={(e) => setNewProduct({...newProduct, productPrice: e.target.value})}
                    className="border-green-200 focus:ring-green-500"
                    required
                  />
                  <Input
                    placeholder="Web3 ID"
                    value={newProduct.web3Id}
                    onChange={(e) => setNewProduct({...newProduct, web3Id: e.target.value})}
                    className="border-green-200 focus:ring-green-500"
                    required
                  />
                  <Input
                    placeholder="Contract Address"
                    value={newProduct.contractAddress}
                    onChange={(e) => setNewProduct({...newProduct, contractAddress: e.target.value})}
                    className="border-green-200 focus:ring-green-500"
                    required
                  />
                  <Button type="submit" className="w-full bg-green-600 text-white hover:bg-green-700">
                    Add Product
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-white/90">
              <CardHeader>
                <CardTitle className="text-green-800">My Orders</CardTitle>
                <CardDescription className="text-green-600">Manage your orders</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <ul>
                    {orders.map((order) => (
                      <li key={order.id}>
                        Order ID: {order.id} - {order.status}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No orders found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FarmerDashboard;
