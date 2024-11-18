import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
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
      navigate('/login')
      
      }
    } catch (error) {
      console.error("Error checking token:", error);
      navigate("/login");
    }
  };
  useEffect(() => {
    checkUserToken();
  }, []);

  
  return (
    <div>
      Home
    </div>
  )
}

export default Home
