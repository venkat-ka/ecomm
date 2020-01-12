import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom';

import {getProducts, getBrainTreeClientToken,processPayment,createOrder} from './apiCore'

import {isAuthenticated} from '../auth'
import DropIn from 'braintree-web-drop-in-react'
import {emptyCart} from './cartHelpers'

const Checkout = ({
    products,
    setRun = f => f, 
    run = undefined }) => {
    const [data, setData] = useState({
        loading:false,
        success:false,
        clientToken:null,
        error:'',
        instance: {},
        address:''
    })
    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated().token
    
    const getToken = (userId,token)=>{
        getBrainTreeClientToken(userId,token).then(res=>{
            console.log(res);
             if(res.error){
                 setData({...data, error:res.error})
             }
             else{
                 setData({clientToken:res.clientToken})
             }
        })
    };
    useEffect (()=>{
        getToken(userId,token)
    },[])
    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    };
    const showCheckout = () => {
        return isAuthenticated() ? (
        <div >{showDropIn()}</div>
        ):(
            <Link to="/signin">
                Sign In to Checkout
            </Link>
        )
    }
    let deliveryAddress = data.address;
    const buy = () => {
        setData({loading:true})
        // send the nonce to your sever
        //nonce data.instace requestPaymentMethod()
        
        let nonce;
        let getnonce = data.instance
            .requestPaymentMethod()
            .then(data=>{
                
                nonce = data.nonce
                //once you have nonce (card payment card number) send nonce to paymethodnonce
                // and also total to be charged
               const paymentData = {
                   paymentMethodNonce:nonce,
                   amount:getTotal(products)
               }
               
               processPayment(userId,token,paymentData)
               .then(response=>{
                   // createOrder
                   
                    const createOrderData = {
                        products:products,
                        transaction_id:response.transaction.id,
                        amount:response.transaction.amount,
                        address:deliveryAddress
                    }
                    createOrder(userId, token, createOrderData)

                    setData({...data, success:response.success})
                    
                            emptyCart(()=>{
                                setRun(!run); // run useEffect in parent Cart
                                setData({loading:false})
                                    console.log("Payment  vvvv Success and Cart is empty")
                                    })
                })
               .catch(error=>{
                setData({loading:false});
                console.log(error)})

            }).catch(error=>{
                //console.log("dropin error",error);
                setData({ ...data,error:error.message });
            })
    }
    const showError = (error) => (
        <div className="alert alert-danger" style={{display:error?'':'none'}}>
                {error}
        </div>
    )
    const showSuccess = (success) => (
        <div className="alert alert-info" style={{display:success?'':'none'}}>
                Thanks ! your payment was successfull
        </div>
    )
    const handleAddress = event =>{
        setData({...data,address:event.target.value})
    }
    const showDropIn = () => (
        <div onBlur={()=>setData({...data,error:""})} className="btn-block">
            {console.log(products.length)}
            {data.clientToken !== null && products.length>0?(
                <div>
                    <div className="gorm-group mb-3">
                        <label className="text-muted">Delivery address:</label>
                        <textarea
                            onChange={handleAddress}
                            className="form-control"
                            value={data.address}
                            placeholder="Type your delivery address here..."
                        />
                    </div>
                    <DropIn options={{
                        authorization: data.clientToken
                    }} onInstance={instance=>(data.instance=instance)} />
                    <button onClick={buy} className="btn btn-success btn-block">Pay</button>
                </div>
            ):null}
        </div>
    )
    const showLoading = loading => loading && <h2>Loading...</h2>
    
return <div>
   
<h2>Total Value: ${getTotal()}</h2>
        {showLoading(data.loading)}            
        {showSuccess(data.success)}
        {showError(data.error)}
        {showCheckout()}
        
</div>
}
export default Checkout