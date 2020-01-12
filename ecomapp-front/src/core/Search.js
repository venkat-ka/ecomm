import React,{useState,useEffect} from 'react'
import {Card} from './Card';
import {getCategories,list} from './apiCore'

const Search = () =>{
    const [data, setData] = useState({
        categories : [],
        category :'',
        search:'',
        results:[],
        searched:false
    });
    const {categories, category,search, results,searched} = data;
    const LoadCategories = () => {
        getCategories().then(data => {
            if(data.error){
                console.log(data.error)
            }else{
                setData({...data,categories:data})
            }
        })
    }
    useEffect(()=>{
        LoadCategories();
    },[])
    const searchData = () => {
        if(search){
            list({search:search|| undefined,category:category })
            .then(response=>{
                if(response.error){
                    console.log(response.error);
                }
                else{
                    setData({...data,results:response,searched:true});
                }
            })
        }
    }
    const searchSubmit = (e) => {
        e.preventDefault();
        searchData();
    }
    const handleChange = name => event => {
        setData({...data,[name]:event.target.value, searched:false})
    }
    const searchMessage = (searched, results) => {
        if(searched && results.length > 0){
            return `Found ${results.length} Products`
        }
        if(searched && results.length<1){
            return `No Product Found`
        }

    }
    const searchedProducts = (results = []) => {
        
        return(
            <div>
            <h2 className="mt-4 mb-4">
                   {searchMessage(searched, results)} 
                </h2> 
            <div className="row">
                 
                    {results.map((product,i)=><Card  key={i} product={product} />)}
            </div>
            </div>
        )
    } 
    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <span className="input-group-text">
                <div className="input-group input-group-lg">
                        <div className="input-group-prepend">
                            <select name="" id="" className="btn mr-2" onChange={handleChange("category")}>
                                <option value="All">Price Category</option>
                                     {categories.map((c,i)=>(
                                     <option key={i} value={c._id}>{c.name}</option>
                                     ))}
                            </select>
                        </div>
                        <input 
                            type="search" 
                            onChange={handleChange("search")} 
                            className="form-control"
                            placeholder="Search By Name"
                        />
                        
                </div>
                <div className="btn input-group-append">
                    <button className="input-group-text">Search</button>
                </div>
            </span>
        </form>)
    
    return (
            <div className="row">
                <div className="container mb-3">
                    {searchForm()}
                
                </div>                       
                <div className="container mb-3">
                    
                    {searchedProducts(results)}
                
                </div>
            </div>
            )
}
export default Search