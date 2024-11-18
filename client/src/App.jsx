import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Auth from './Pages/Auth.jsx'
import Home from './Pages/Home.jsx'
import Register from './Pages/Register.jsx'
import  Farmer  from './Pages/Farmer.jsx'
import Login from './Pages/Login.jsx'
import Cart from './Pages/Cart.jsx'
import Orders from './Pages/Orders.jsx'
import Product from './Pages/Product.jsx'
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
  },
  {
    path: '/cart',
    element: <Cart />
  },
  {
    path: '/orders',
    element: <Orders />
  },
  {
    path: '/product/:id',
    element: <Product />
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