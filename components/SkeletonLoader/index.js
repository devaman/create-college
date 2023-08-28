import React from 'react';
// import './style.css';
const SkeltonLoader = (props)=>{
    return(
        <div className="skeleton" style={{...props.style}}>
            <div>

            </div>
        </div>
    )
}
export default SkeltonLoader;