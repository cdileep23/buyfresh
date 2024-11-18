import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Auth from './Pages/Auth.jsx'
import Home from './Pages/Home.jsx'
import Register from './Pages/Register.jsx'
import  Farmer  from './Pages/Farmer.jsx'
import Login from './Pages/Login.jsx'
const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/admin',
    element: <Farmer />
  },
  {
    path: '/register',
    element: <Register />
  }

])
function App() {

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App