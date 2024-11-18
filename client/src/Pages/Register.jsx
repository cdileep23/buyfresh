import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, Lock, Sprout, Store, CreditCard, Home } from 'lucide-react';

const Register = () => {
  const [signupData, setSignupData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    isFarmer: false,
    password: '',
    walletAddress: '',
    address: ''
  });

  const navigate = useNavigate();

  const checkUserToken = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/user/check-user",
        { withCredentials: true }
      );
      const data = response.data;

      if (data.success) {
        if (data.role === 'buyer') {
          navigate("/");
        } else {
          navigate('/admin');
        }
      }
    } catch (error) {
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

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      console.log(signupData)
      const response = await axios.post('http://localhost:8080/api/user/register', {
        fullname: signupData.fullname,
        email: signupData.email,
        phoneNumber: signupData.phoneNumber,
        password: signupData.password,
        role: signupData.isFarmer ? 'farmer' : 'buyer',
        walletAddress: signupData.walletAddress,
        address: signupData.address,
      }, { withCredentials: true });

      if (response.data.success) {
        console.log(response.data)
        alert(response.data.message);
        navigate('/login')
      }

    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-50 to-green-100 flex flex-col lg:grid lg:grid-cols-2 gap-8 p-4">
      {/* Left side: Heading and Cards */}
      <div className="lg:flex lg:flex-col lg:justify-center lg:items-start lg:px-8">
        {/* Heading Section */}
        <div className="mb-8 text-center lg:text-left lg:w-1/2 mx-auto">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Direct Market Access</h1>
          <p className="text-lg text-green-700 max-w-md mx-auto lg:mx-0">
            Connect farmers directly with customers. Fresh produce, fair prices, no middlemen.
          </p>
        </div>

        {/* Cards Section (Hidden on small screens) */}
        <div className="lg:grid lg:grid-cols-3 gap-4 max-w-4xl w-full mx-auto hidden lg:block">
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

      {/* Right side: Signup Card */}
      <div className="flex justify-center items-center">
        <Card className="w-full max-w-md border-green-200 bg-white/90 backdrop-blur shadow-md">
          <CardHeader className="text-center border-b border-green-100 bg-green-50/50">
            <CardTitle className="text-2xl font-bold text-green-800">Sign Up</CardTitle>
            <CardDescription className="text-green-600">
              Create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-green-600" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    className="pl-10 border-green-200 focus:ring-green-500"
                    value={signupData.fullname}
                    onChange={(e) => setSignupData({ ...signupData, fullname: e.target.value })}
                    required
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-green-600" />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="pl-10 border-green-200 focus:ring-green-500"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-green-600" />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    className="pl-10 border-green-200 focus:ring-green-500"
                    value={signupData.phoneNumber}
                    onChange={(e) => setSignupData({ ...signupData, phoneNumber: e.target.value })}
                    required
                  />
                </div>
                {/* New Fields */}
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-5 w-5 text-green-600" />
                  <Input
                    type="text"
                    placeholder="Wallet Address"
                    className="pl-10 border-green-200 focus:ring-green-500"
                    value={signupData.walletAddress}
                    onChange={(e) => setSignupData({ ...signupData, walletAddress: e.target.value })}
                    required
                  />
                </div>
                <div className="relative">
                  <Home className="absolute left-3 top-3 h-5 w-5 text-green-600" />
                  <Input
                    type="text"
                    placeholder="Address"
                    className="pl-10 border-green-200 focus:ring-green-500"
                    value={signupData.address}
                    onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    className={`flex-1 ${signupData.isFarmer ? 'bg-green-600' : 'bg-green-100 text-green-800'}`}
                    onClick={() => setSignupData({ ...signupData, isFarmer: true })}
                  >
                    <Sprout className="w-4 h-4 mr-2" />
                    I'm a Farmer
                  </Button>
                  <Button
                    type="button"
                    className={`flex-1 ${!signupData.isFarmer ? 'bg-green-600' : 'bg-green-100 text-green-800'}`}
                    onClick={() => setSignupData({ ...signupData, isFarmer: false })}
                  >
                    <Store className="w-4 h-4 mr-2" />
                    I'm a Customer
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-green-600" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="pl-10 border-green-200 focus:ring-green-500"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full bg-green-600 text-white">
                Sign Up
              </Button>
            </form>
            <div className="text-center mt-4">
                <p className="text-sm text-green-600">
                 Already have a Account?{" "}
                  <a href="/login" className="text-green-800 font-semibold hover:underline">
                  Login
                  </a>
                </p>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
