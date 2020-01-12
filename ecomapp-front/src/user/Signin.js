import React, {useState} from 'react';
import {Redirect} from 'react-router-dom';
import Layout from '../core/Layout';
import {signin,authenticate,isAuthenticated} from '../auth' 
const Signin = () => {

    const [values,setValues] = useState({        
        email:'venkat3d2dd3@gmail.com',
        password:'ddd2ddd',
        error:'',
        loading:false,
        redirectToReferer:false
    });
    const {email,password,loading,error,redirectToReferer} = values;
    const {user} = isAuthenticated();
    const handleChange = name => event=>{
        setValues({...values, error:false, [name]:event.target.value })
    }
    const clickSubmit = event => {
        event.preventDefault();
        setValues({...values,error:false,loading:true})
        signin({email,password}).then(data=>{
            if(data.error){
                setValues({...values,error:data.error,loading:false})
            }else{
                authenticate(data,()=>{
                    setValues({
                        ...values,                                        
                        redirectToReferer:true
                    })
                })
                
            }
        });
    }

  
    const signInform = () => (
        <form> 
           
            <div className="form-group">
                <label htmlFor="" className="text-muted">Email</label>
                <input type="email" onChange={handleChange('email')} value={email} className="form-control"/>
            </div>
            <div className="form-group">
                <label htmlFor="" className="text-muted">Password</label>
                <input type="password" onChange={handleChange('password')} value={password} className="form-control"/>
            </div>
            <button onClick={clickSubmit}>Submit</button>
        </form>
    )
    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' :'none'}}>{error}</div>
        )

    const showLoading = () => (
       loading && (<div className="alert alert-info">
                        <h2>Loading</h2>
                    </div>)
        )
     const redirectUser = () => {
         if(redirectToReferer){
             if(user && user.role === 1){
                return <Redirect to="/admin/dashboard" />
             }else{             
             return <Redirect to="/user/dashboard" />
            }           
         }
         if(isAuthenticated()){
            return <Redirect to="/" />
        }
     }   

    return(<Layout title="Signin" className="container col-md-8 col-md-offset-2" description="SignIn to Node React E-Commerce App " >
        {showLoading()}
        {showError()}
        {signInform()}
        {redirectUser()}
    </Layout>)
}
export default Signin
 