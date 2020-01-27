import React, {useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import Layout from './Layout';
import {getCart, removeItem} from './cartHelpers'
import Checkout from './Checkout';

import {Card} from './Card';

const Cart = () => {
    const [items, setItems] = useState([]);
    const [run, setRun] = useState(false);
    useEffect(()=>{
        setItems(getCart())
    }, [run])
const noItemMessage = () => (
    <h2>Your Cart Empty <br /> <Link to="/shop" >Continue Shopping </Link> </h2>
    )
 
const showItems = items => {
    return (
        <div>
            <h2>Your Cart has {`${items.length}`} items</h2>
            <hr />
            
            {items.map((pr,i)=>(
            <Card 
                key={i} 
                product={pr} 
                setRun={setRun}
                showAddtoCartBtn={false}
                cartUpdate={true}
                showRemoveProductBtn={true}
                
                run={run}
             />
                
              ))}
        </div>
    )
}
    return (<Layout 
                title="Home Page" 
                description="Mange your cart items. Add remove checkout or continue shopping." 
                className="container-fluid" >
                            <div className="row">
                                <div className="col-6">
                                    {items.length > 0 ? showItems(items) : noItemMessage() }
                                </div>
                                <div className="col-6">
                                    <h2 className="mb-4">Your Cart Summary</h2>
                                    <hr />
                                    <Checkout products={items} setRun={setRun} run={run} />
                                </div>
                            </div>
            </Layout>
           )
}

export default Cart