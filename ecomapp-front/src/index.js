import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import Crudreducer from './reducer/reducer'
const store = createStore(Crudreducer)

ReactDOM.render(
<Provider store={store}> 
    <Routes /> 
</Provider>, document.getElementById('root'));
