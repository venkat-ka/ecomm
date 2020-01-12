import React,{Fragment} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {signout,isAuthenticated} from '../auth'
import {itemTotal} from './cartHelpers'
const isActive = (history,path) =>{
    if(history.location.pathname===path){
        return {color:'#ff9900'}
    }else{
        return {color:'#fff'}
    }
}
const Menu = ({history}) => (<div> 
<ul className="nav nav-tabs bg-primary">
    <li className="nav-item">
        <Link className="nav-link" style={isActive(history, '/')} to="/">Home</Link>
    </li>
    <li className="nav-item">
        <Link className="nav-link" style={isActive(history, '/shop')} to="/shop">Shop</Link>
    </li>
    {isAuthenticated() && isAuthenticated().user.role === 0 && (
        <li className="nav-item">
        <Link className="nav-link" to="/user/dashboard" style={isActive(history, "/user/dashboard")} >
            Dash Board
        </Link>    
    </li>
    )}
    {isAuthenticated() && isAuthenticated().user.role === 1 && (
        <li className="nav-item">
        <Link className="nav-link" to="/admin/dashboard" style={isActive(history, "/admin/dashboard")} >
            Dash Board
        </Link>    
    </li>
    )}
    {!isAuthenticated() && (
        <Fragment>
            <li className="nav-item">
                <Link className="nav-link" to="/signin" style={isActive(history, '/signin')} >Sign In</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/signup" style={isActive(history, '/signup')} >Sign Up</Link>
            </li>            
        </Fragment>
    )}
    {isAuthenticated() && (
        
        <li className="nav-item">
        <span className="nav-link"  style={{cursor:'pointer',color:'#fff'}} onClick={()=>signout(()=>{
            history.push('/');
        })} >Sign Out</span> 
    </li> 
   
    )}
    <li className="nav-item">
        <Link className="nav-link" style={isActive(history, '/cart')} to="/cart">
            Cart <sup><small className="cart-badge">{itemTotal()}</small></sup>
        </Link>
    </li>
           
</ul>
</div>)
export default  withRouter(Menu)