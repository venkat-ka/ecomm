import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import Layout from '../core/Layout';
import {signup} from '../auth' 
const Signup = () => {

    const [values,setValues] = useState({
        name:'',
        email:'',
        password:'',
        error:'',
        success:false
    });
    const {name,email,password,success,error} = values;
    
    const handleChange = name => event=>{
        console.log('sssschecking value ',name);
        setValues({...values, error:false, [name]:event.target.value })
    }
    const clickSubmit = event => {
        event.preventDefault();
        setValues({...values,error:false})
        signup({name,email,password}).then(data=>{
            if(data.error){
                setValues({...values,error:data.error,success:false})
            }else{
                setValues({
                    ...values,
                    name:'',
                    email:'',
                    password:'',
                    error:'',
                    success:true
                })
            }
        });
    }

  
    const signUpform = () => (
        <form> 
            <div className="form-group">
                <label htmlFor="" className="text-muted">Name</label>
                <input onChange={handleChange('name')} type="text" value={name} className="form-control"/>
            </div>
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

    const showSuccess = () => (
        <div 
            className="alert alert-info" 
            style={{display: success ? '' :'none'}}>
                New Account Created. Please <Link to="/signin">Sign in</Link>
        </div>
        )

    return(<Layout title="Signup" className="container col-md-8 col-md-offset-2" description="Signup to Node React E-Commerce App " >
        {showSuccess()}
        {showError()}
        {signUpform()}
        
    </Layout>)
}
export default Signup
 