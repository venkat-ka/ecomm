import React,{useState,useEffect} from 'react'
import Layout from './Layout';
import {Card} from './Card';
import {getCategories,getFilterProducts} from './apiCore'
import Checkbox from './Checkbox'
import RadioBox from './RadioBox'
import {prices} from './FixedPrice'

const Shop = () => {
    const [myFilters, setMyFilters] = useState({
        filters:{category:[],price:[]}
    })
    const [categories,setCategories] = useState([]);
    const [error,setError] = useState(false)
    const [limit,setLimit] = useState(6)
    const [skip,setSkip] = useState(0)
    const [size,setSize] = useState(0)
    const [filteredResults, setFilteredResults] = useState([]);
    
    // load categories and send form data
    const init = () => {
        getCategories().then(data=>{
            if(data.error){
                setError(data.error)
            }else{
                setCategories(data)
            }
        })
    }
    const loadMore = () =>{
        let toSkip = skip + limit
        console.log(toSkip);
        getFilterProducts(toSkip, limit,myFilters.filters).then(data=>{
            console.log(data);
            if(data.error){
                setError(data.error)
            }else{
                 setFilteredResults([...filteredResults, ...data.data])
                 setSize(data.size)
                 setSkip(toSkip)
            }
        })
    }
    const loadMoreButton = () => {
        return (
            size > 0 && size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5">
                    LoadMore
                </button>
            )
        )
    }
    const loadFilterResult = (newFilters) =>{
        getFilterProducts(skip, limit,newFilters).then(data=>{
            if(data.error){
                setError(data.error)
            }else{
                setFilteredResults(data.data);
                setSize(data.size)
                setSkip(0)
            }
        })
    }

    useEffect(()=>{
        init();
        loadFilterResult(skip,limit,myFilters.filters);
    }, [])
    const handleFilters = (filters,filterBy) => {
        
        //console.log('SHOP ',filters,filterBy)
        const newFilters = {...myFilters} 
        newFilters.filters[filterBy] = filters
        if(filterBy == "price"){
            
            let priceValues = handlePrice(filters);
            newFilters.filters[filterBy] = priceValues;
        }

        loadFilterResult(myFilters.filters)
        setMyFilters(newFilters);
    }
   
    const handlePrice = value =>{
        const data  = prices
        let array = []
        for(let key in data){
            console.log(data);
            if(data[key]._id === parseInt(value)){
                
                array = data[key].array
            }
            
        }
        return array

    }
    return (
        <Layout title="Shop Page" description="Search and find books of your choice" className="container-fluid" >                               
                <div className="row">
                    <div className="col-4">
                        
                        <h4>Filter By Categories</h4>
                        <ul>
                            <Checkbox 
                                categories={categories} 
                                handleFilters={filters=>handleFilters(filters,"category")} 
                             />
                        </ul>
                        <h4>Filter By PriceRange</h4>
                        <div>
                            <RadioBox 
                                prices={prices} 
                                handleFilters={filters=>handleFilters(filters,"price")} 
                             />
                        </div>
                    </div>
                    <div className="col-8">
                        
                        <h2 className="mb-4">Products</h2>
                        <div className="row">
                            
                           
                           {filteredResults.map((product, i)=>( 
                                   <div key={i} className="col-4 mb-3">
                                        <Card key={i} product={product}  />
                                     </div>
                                   
                                )) }
                                <hr />
                             {(loadMoreButton())}   
                        </div>
                    </div>
                </div>
        </Layout>
    )
}
export default Shop