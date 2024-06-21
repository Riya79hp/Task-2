import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const Navbar = () => {
 

  


    return (
        <>
            <div className='navbardiv'>
               
                <Link to='/' className='navbar-written'>Post</Link>
            
                
                
                <Link to='/myacc' className='navbar-written'>My-account</Link>
            </div>

           </>
    );
};

export default Navbar;
