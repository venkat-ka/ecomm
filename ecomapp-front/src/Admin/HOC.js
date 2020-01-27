import React,{Component} from 'react'
import Layout from '../core/Layout'
import {isAuthenticated} from '../auth'
import {createCMS,updateCMS,deleteCms} from './apiAdmin'


const HOC = (CMSDatas) => {
    
    return class  extends Component{
        constructor(props){
            super(props)
            let {user,token} = isAuthenticated()
            this.user = user;
            this.token = token;
            this.reList = false
            this.state = {
                key:'',
                value:'',
                loading:false,
                success:false,
                error:false,
                edit:false,
                listing:false,
                successdelet:false

            }
        }

        handleChange = name => e => {
            let inputvalue = e.target.value;
            
            this.setState({[name]:inputvalue, success:false, error:false})
            
        }
        errormsg = () => {
            return(
                <div className="alert alert-danger" style={{display:this.state.error ? '' : 'none'}} >
                {this.state.error}
             </div>
            )
        }
        successmsg = () => {
            let msg = this.state.edit?'update successfully':'created Successfully'
            msg = this.state.success  ? msg : ''
            msg = this.state.successdelet? "Deleted Successfully":msg
          return(
            <div className="alert alert-success" style={{display:this.state.success ? '' : 'none'}}>
                <h2>{`${this.state.key} is ${msg}`}</h2>  
            </div>
          )  
        }
        genralForm = ()=>{
           let newKey =  <input  type="text" className="form-control" 
            onChange={this.handleChange("key")} 
            value={this.state.successdelet?'':this.state.key} autoFocus 
            name="key"
            required
            />

            let editKey = <input  type="text" className="form-control" 
            onChange={this.handleChange("key")} 
            value={this.state.successdelet?'':this.state.key} autoFocus 
            name="key"
            required
            readOnly
            /> 
            
            return(<form onSubmit={this.clickSubmit}>                                
                <div className="form-group">
                    <label htmlFor="" className="text-muted">Key</label>
                    {this.state.edit?editKey:newKey}
                    <div className="notes">* Allowed only text minmum 1 Charachter</div><div className="notes">*Only Underscore allowed </div>
                     <br />
                    <label htmlFor="" className="text-muted">Value</label>
                    
                    <input 
                        type="text" 
                        className="form-control" 
                        name={this.state.value}
                        onChange={this.handleChange("value")} 
                        value={this.state.value} autoFocus 
                        required
                    />
                    
                </div>
                <button className="btn btn-outline-primary">{this.state.edit?"Update":"Create"} Web Data</button>
            </form>)
            
        }
        // List out the CMS
        handleEdit = (id, data) => {
           
           this.setState({
               id:id,
               key:data.key,
               value:data.value,
               edit:true,
               success:false,
               error:false,
               successdelet:false
           })
            this.props.dispatch({type:"Edit",id:this.state.id, data:data, edit:true})
            
        }
        

        clickSubmit = (event) => {
            event.preventDefault();
            let servdata = {key:this.state.key,value:this.state.value};
            
            this.setState({loading:true})
            
            if(this.state.edit){

                // Edit Form
                updateCMS(this.user._id,this.token,servdata).then(data=>{
                    
                    if(data.error){
                         this.setState({                    
                            error:data.error,
                            loading:false,
                            success:false,
                            listing:false,
                            successdelet:false
                        })
                    }else{
                        this.props.dispatch({type:"UPDATE", id:this.state.id,data:servdata})
                        this.reList = !this.reList
                        this.setState({                    
                            error:false,
                            loading:false,
                            success:true,
                            listing:true,
                            successdelet:false
                            
                                    })
                                   
                                }
                        })


                }else{
                    
                     // Here send to server and return back 
             createCMS(this.user._id,this.token,servdata).then(data=>{
                
                if(data.error){
                     this.setState({                    
                        error:data.error,
                        loading:false,
                        success:false,
                        listing:true,
                        successdelet:false
                    })
                }else{
                    this.reList = !this.reList
                    this.props.dispatch({type:"CREATE", id:this.state.id,data:servdata})
                    this.setState({                    
                        error:false,
                        loading:false,
                        success:true,
                        listing:true,
                        successdelet:false
                                })
                            }
                    })

                }
                
            
        }
        destroyRow = (id, lky) => {
           
           this.reList = !this.reList
            deleteCms(id,this.user._id,this.token).then(data=>{
                if(data.error){
                    this.setState({
                        error:data.error,
                        loading:false,
                        success:false,
                        listing:false,
                        successdelet:false
                    })
                }else{
                    this.setState({
                        error:false,
                        loading:false,                        
                        success:true,
                        listing:true,
                        edit:false,
                        value:'',
                        key:lky,
                        successdelet:true
                    })
                    
                }
            } )
        }
         List = () => {
            return this.state.data;
        }
      
            render(){
                
            return (<Layout 
                title="Add a new Website Content" 
                className="container col-md-8 col-md-offset-2" 
                description={`G'day ${this.user.name}, you can manage all the Website Data here`} >
                        {this.state.error?this.errormsg():this.successmsg()}                              
                        {this.state.loading?<h2>...Loading</h2>:''}
                        {this.genralForm()}
                        <CMSDatas List={this.List} onDestroy={this.destroyRow} reList={this.reList} onEdit={this.handleEdit}/>
                        </Layout> )    
            }
        }

}



export default HOC