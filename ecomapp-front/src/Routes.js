import React from 'react'
import {BrowserRouter,Switch, Route} from 'react-router-dom'
import Signup from './user/Signup'
import Signin from './user/Signin' 
import Home from './core/Home'
import PrivateRoute from './auth/PrivateRoute'
import Dashboard from './user/UserDashboard'
import AdminRoute from './auth/AdminRoute'
import AdminDashboard from './user/AdminDashboard'
import AddCategory from './Admin/AddCategory'
import AddProduct from './Admin/AddProduct'
import UpdateProduct from './Admin/UpdateProduct'
import Shop from './core/Shop'
import Product from './core/Product'
import Cart from './core/Cart'
import Orders from './Admin/Order'
import Profile from './user/Profile';
import ManageProduct from './Admin/ManageProduct';
import ManageCms from './Admin/ManageCMS';

const Routes = () => {
    return (
        <BrowserRouter>
           
            <Switch>
                <Route path="/" exact component={Home} /> 
                <Route path="/shop" exact component={Shop} /> 
                <Route path="/signin" exact component={Signin} />
                <Route path="/signup" exact component={Signup} /> 
                
                <PrivateRoute 
                    path="/user/dashboard" 
                    exact 
                    component={Dashboard} 
                />
                <AdminRoute 
                    path="/admin/dashboard" 
                    exact 
                    component={AdminDashboard} 
                />
                <AdminRoute 
                    path="/create/category"
                    exact
                    component={AddCategory}
                 /> 
                 <AdminRoute 
                    path="/create/product"
                    exact
                    component={AddProduct}
                 /> 
                 <Route path="/product/:productId" exact component={Product} /> 
                 <Route path="/cart" exact component={Cart} /> 
                <AdminRoute 
                    path="/admin/orders"
                    exact
                    component={Orders}
                 />  
                 <PrivateRoute 
                    path="/profile/:userId" 
                    exact 
                    component={Profile} 
                />
                <AdminRoute 
                    path="/admin/products"
                    exact
                    component={ManageProduct}
                 /> 
                 <AdminRoute 
                    path="/admin/product/update/:productId"
                    exact
                    component={UpdateProduct}
                 />
                 <AdminRoute 
                    path="/admin/cms"
                    exact
                    component={ManageCms}
                 />
                 
                 
            </Switch>

        </BrowserRouter>
    )
}

export default Routes;