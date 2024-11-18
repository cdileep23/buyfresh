import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Mail, User, Sprout, Store, Phone } from 'lucide-react';

const Auth = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    isFarmer: false,
    password: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic here
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // Add signup logic here
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-50 to-green-100 flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-800 mb-2">Direct Market Access</h1>
        <p className="text-lg text-green-700 max-w-md mx-auto">
          Connect farmers directly with customers. Fresh produce, fair prices, no middlemen.
        </p>
      </div>

      {/* Auth Card */}
      <Card className="w-full max-w-md border-green-200 bg-white/90 backdrop-blur shadow-md">
        <CardHeader className="text-center border-b border-green-100 bg-green-50/50">
          <CardTitle className="text-2xl font-bold text-green-800">Welcome</CardTitle>
          <CardDescription className="text-green-600">
            Join our community of farmers and conscious consumers
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-green-50">
              <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-green-800">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-green-800">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
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
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Login
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Form */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-green-600" />
                    <Input
                      type="text"
                      placeholder="Full Name"
                      className="pl-10 border-green-200 focus:ring-green-500"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
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
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      className={`flex-1 ${
                        signupData.isFarmer ? 'bg-green-600' : 'bg-green-100 text-green-800'
                      }`}
                      onClick={() => setSignupData({ ...signupData, isFarmer: true })}
                    >
                      <Sprout className="w-4 h-4 mr-2" />
                      I'm a Farmer
                    </Button>
                    <Button
                      type="button"
                      className={`flex-1 ${
                        !signupData.isFarmer ? 'bg-green-600' : 'bg-green-100 text-green-800'
                      }`}
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
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Features Section */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full hidden lg:grid">
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
  );
};

export default Auth;
