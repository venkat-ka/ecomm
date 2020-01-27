import React from 'react';
import Menu from './Menu'
import '../styles.css';
import Footer from './Footer'
const Layout = ({title='Titile',description = "Description", className, children}) =>(
    <div>
        <Menu />
        <div className="jumbotron">
            <h2>{title}</h2>
            <p className="lead">{description }</p>
        </div>
        <div className={className}>{children}</div>
        <Footer />
    </div> 
)

export default Layout