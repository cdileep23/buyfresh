import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Menu,
  Home,
  ShoppingCart,
  Package,
  LogOut,
  Search,
  Apple,
  Wheat,
  Carrot,
  Milk,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const categories = [
  { name: 'Fruits', icon: Apple },
  { name: 'Vegetables', icon: Carrot },
  { name: 'Grains', icon: Wheat },
  { name: 'Dairy', icon: Milk },
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const productsPerPage = 8;

  const navigate = useNavigate();

  useEffect(() => {
    checkUserToken();
    fetchProducts();
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

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/product', { withCredentials: true });
      if (response.data.success && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterProducts(term, selectedCategory);
  };

  const handleCategoryFilter = (category) => {
    const newCategory = category === selectedCategory ? null : category;
    setSelectedCategory(newCategory);
    filterProducts(searchTerm, newCategory);
  };

  const filterProducts = (term, category) => {
    let result = [...products];

    if (term) {
      result = result.filter((product) =>
        product.productName.toLowerCase().includes(term.toLowerCase())
      );
    }

    if (category) {
      result = result.filter((product) => product.productType === category);
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  };

  const handleLogout = async () => {
    try {
     const res= await axios.get('http://localhost:8080/api/user/logout', { withCredentials: true });
     console.log(res.data)
      if(res.data.success){
        alert(res.data.message)
        navigate('/login')
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = Array.isArray(filteredProducts)
    ? filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    : [];

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredProducts.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-green-700">FreshBuy</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="flex items-center text-green-700 hover:underline">
            <Home className="mr-2" /> Products
          </Link>
          <Link to="/cart" className="flex items-center text-green-700 hover:underline">
            <ShoppingCart className="mr-2" /> Cart
          </Link>
          <Link to="/orders" className="flex items-center text-green-700 hover:underline">
            <Package className="mr-2" /> Orders
          </Link>
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
            <Link to="/" className="flex items-center text-green-700">
              <Home className="mr-2" /> Products
            </Link>
            <Link to="/cart" className="flex items-center text-green-700">
              <ShoppingCart className="mr-2" /> Cart
            </Link>
            <Link to="/orders" className="flex items-center text-green-700">
              <Package className="mr-2" /> Orders
            </Link>
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Search and Category Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-3 text-green-600" />
            <Input
              placeholder="Search products..."
              className="pl-10 border-green-300 w-full"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.name}
                variant={selectedCategory === cat.name ? 'default' : 'outline'}
                onClick={() => handleCategoryFilter(cat.name)}
                className="flex items-center"
              >
                <cat.icon className="mr-2" /> {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {currentProducts.map((product) => (
            <Link to={`product/${product._id}`} key={product._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <img
                  src={product.productImageUrl}
                  alt={product.productName}
                  className="w-full h-32 md:h-48 object-cover rounded-md mb-4"
                />
                <h3 className="font-semibold text-green-800">{product.productName}</h3>
                <p className="text-green-600">{product.productType}</p>
                <p className="text-gray-500">{product.description}</p>
                <p className="font-bold text-green-900">₹{product.productPrice}</p>
              </CardContent>
             
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          {pageNumbers.map((number) => (
            <Button
              key={number}
              variant={currentPage === number ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
