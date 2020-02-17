import React, {Component} from 'react'
import Layout from '../core/Layout'
import {isAuthenticated} from '../auth'

import {connect} from 'react-redux';
import {getCMS} from './apiAdmin'
import HOC from './HOC'

const ManageCMS = () => {
    
    return ("create")
}
class ListCMS extends Component {
    constructor(props){
        super(props)
        const {user,token} = isAuthenticated();
        this.user = user;
        this.token = token;
        this.state = {
            cmslist:'',
            reList:false
        }

        
    }
    loadCMS = () => {
        //const {user,token} = isAuthenticated();
        getCMS(this.user._id, this.token).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                this.setState({
                    cmslist:data
                    })
            }
        })
    }

    componentDidMount(){        
        this.loadCMS();        
    }
    shouldComponentUpdate(nextProps, nextState) {
       
        if(nextProps.reList !== nextState.reList){
            
            this.loadCMS();

            this.setState({
                reList: nextProps.reList
            })
        }
        return true
    }

    handleEdit = (id, data) => {
        this.props.dispatch({type:"Edit",id:id, data:data, edit:true})
    }
    destroyRow = (id) => {
        this.props.dispatch({type:"Delete",id:id, edit:false})
        this.loadCMS();
    }
    render(){
        let ListData = this.state.cmslist;
        if(this.props.List){
        let ListData = this.state.cmslist.concat(this.props.List)
        }
        return (<div>
            <div className="row brd d-flex justify-content-center align-item-center  mrgt15 pdt15">
            {
                
                Object.keys(ListData).map((k)=>
                    
                    <div className='row col-md-10 mrgb15 pdb5 brd-dn' key={k}>    
                                            
                            <div className="col-sm-5  col-md-5 d-flex justify-content-between " >
                                        <label >
                                            Key:
                                        <h4 className="align-item-center">{ListData[k].key} </h4>
                                        </label>
                                        <br />
                                        <p>
                                            <label >
                                                Value: <br />
                                                <strong>{ListData[k].value} </strong>
                                            </label>
                                        </p>
                            </div>
                            
                            <div className="col-sm- col-md-5 offset-md-2 text-break">
                                <span className="badge-warning badge-pill col-2" onClick={()=>this.props.onEdit(ListData[k].key, ListData[k])}>
                                    Update
                                </span>
                                <br />
                                <span className="badge-danger badge-pill col-2" onClick={()=>this.props.onDestroy(ListData[k]._id, ListData[k].key)}>Delete</span>
                            </div>
                            <br />
                    </div>
                ) 
            } 
        </div>
        </div>)
    }
}

const ShowListCMS = HOC(ListCMS);
const ShowAddCMS = HOC(ManageCMS);

const mapStateToProps = (state) => {
    
    return {
        data : state
    }
}
export default connect(mapStateToProps)(ShowListCMS,ShowAddCMS,HOC)