import React from'react'
const Crudreducer = (state=[], action) => {
    switch(action.type){
        case "CREATE":
            return state.concat(action.data)
        case 'Edit':           
                return state.map((cmsdata)=>{
           
                    if(cmsdata.id===action.id){
                        console.log("data")
                      return(  {...cmsdata,data:action.data, edit:true} )
                    }else{
                        return cmsdata
                    }
                });    
         case "UPDATE":
             return state.map(cmsdata=>{
                 if(cmsdata.id === action.id){
                     return (
                         {
                           ...cmsdata,
                           cmsdata:action.cmsdata,
                           edit:false  
                         }
                     )
                 }
             })
         case "Delete":
            return state.filter((cmsdata)=>cmsdata.id === action.id);
         default:
            return state;          
    }
}
export default Crudreducer