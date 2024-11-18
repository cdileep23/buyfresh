import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Sprout, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '', isFarmer: false });
  const navigate = useNavigate();

  const checkUserToken = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/user/check-user",
        { withCredentials: true }
      );
      const data = response.data;
      console.log(data);
  
      if (data.success) {
        if (data.role === 'buyer') {
          navigate("/");
        } else {
          navigate('/admin');
        }
      }
    } catch (error) {
      // Check if the error is 401 (Unauthorized)
      if (error.response && error.response.status === 401) {
        console.warn("Unauthorized access - token might be missing or invalid.");
      } else {
        console.error("Error checking token:", error);
        navigate("/login");
      }
    }
  };
  
  useEffect(() => {
    checkUserToken();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    console.log('Login Data:', loginData);
  
    try {
      const response = await axios.post(
        'http://localhost:8080/api/user/login',
        {
          email: loginData.email,
          password: loginData.password,
          role: loginData.isFarmer ? 'farmer' : 'buyer'
        },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        alert(response.data.message);
        console.log("login details", response.data);
  
        if (response.data.user.role === 'farmer') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        // Handle unsuccessful login attempt
        alert(response.data.message);
      }
  
    } catch (error) {
      // Check if the error has a response and handle the API response error
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        console.error("Login error:", error);
        alert("Some error occurred");
      }
    }
  };
  

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
      {/* Main content wrapper */}
      <div className="w-full max-w-7xl px-4 py-8">
        
        {/* Centered content: Heading for farmers, Login form */}
        <div className="text-center">
          
          {/* Heading Section for Farmers */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-green-800 mb-2">Direct Market Access</h1>
            <p className="text-lg text-green-700 max-w-md mx-auto">
              Connect farmers directly with customers. Fresh produce, fair prices, no middlemen.
            </p>
          </div>

          {/* Login Card Section */}
          <Card className="w-full max-w-md border-green-200 bg-white/90 backdrop-blur shadow-md mb-8 mx-auto">
            <CardHeader className="text-center border-b border-green-100 bg-green-50/50">
              <CardTitle className="text-2xl font-bold text-green-800">Login</CardTitle>
              <CardDescription className="text-green-600">
                Access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-green-600" />
                    <Input
                      type="email"
                      placeholder="Email"
                      className="pl-10 border-green-200 focus:ring-green-500"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-green-600" />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="pl-10 border-green-200 focus:ring-green-500"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  {/* Role selection using buttons */}
                  <div className="flex gap-2 justify-center">
                    <Button
                      type="button"
                      className={`flex-1 ${loginData.isFarmer ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'}`}
                      onClick={() => setLoginData({ ...loginData, isFarmer: true })}
                    >
                      <Sprout className="w-4 h-4 mr-2" />
                      I'm a Farmer
                    </Button>
                    <Button
                      type="button"
                      className={`flex-1 ${!loginData.isFarmer ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'}`}
                      onClick={() => setLoginData({ ...loginData, isFarmer: false })}
                    >
                      <Store className="w-4 h-4 mr-2" />
                      I'm a Customer
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Login
                </Button>
              </form>
              <div className="text-center mt-4">
                <p className="text-sm text-green-600">
                  Don't have an account?{" "}
                  <a href="/register" className="text-green-800 font-semibold hover:underline">
                    Sign Up
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cards Section: Hidden on small screens */}
          <div className="mt-8 lg:grid lg:grid-cols-3 gap-4 max-w-4xl w-full mx-auto hidden lg:block">
            <Card className="bg-white/80 shadow-md">
              <CardContent className="pt-6 text-center">
                <Sprout className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800">For Farmers</h3>
                <p className="text-sm text-green-600">Sell directly to customers and earn more</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 shadow-md">
              <CardContent className="pt-6 text-center">
                <Store className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800">For Customers</h3>
                <p className="text-sm text-green-600">Get fresh produce at better prices</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 shadow-md">
              <CardContent className="pt-6 text-center">
                <Lock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800">Secure Platform</h3>
                <p className="text-sm text-green-600">Safe and transparent transactions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
