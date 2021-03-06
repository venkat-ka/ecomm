import React,{useState,useEffect} from 'react'
import Layout from './Layout';
import {getProducts} from './apiCore'
import {Card} from './Card';
import Search from './Search'
const Home = () => {
     const [productsBySell,setProductsBySell] = useState([]);
     const [productByArrival, setProductsByArrival] = useState([]);
     const [error, setError] = useState(false);
     const loadProductBySell = () => {
         getProducts('sold').then(data=>{
             if(data.error){
                 setError(data.error)
             }else{
                 setProductsBySell(data)
             }

         });
     } 
     const loadProductByArrival = () => {
        getProducts('createdAt').then(data=>{
            if(data.error){
                setError(data.error)
            }else{
                setProductsByArrival(data)
            }

        });
    }   
    useEffect(()=>{
        loadProductByArrival()
        loadProductBySell()
    },[])
    return(
        
        <Layout title="Home Page" description="Node React E-Commerce Fullstack" className="container-fluid" >
            <Search />
            <h2 className="mb-4">Product New Arrival</h2>            
                <div className="row">
                {productByArrival.map((product, i)=>(
                <div key={i} className="col-4 mb-3">
                    <Card key={i} product={product}  />
                </div>))}
                </div>
                
            <h2 className="mb-4">Best Seller</h2>
            <div className="row">
                {productsBySell.map((product,i)=>(
                <div key={i} className="col-4 mb-3">
                    <Card key={i} product={product}  />
                </div>
                ))}
                </div>                        
        </Layout>
        )
}
export default Home;
