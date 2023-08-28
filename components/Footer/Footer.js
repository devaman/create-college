import React from 'react';
const Footer = (props) => {
    return (
        <footer>
            <div style={{ display: 'flex',padding:"10px",marginTop:"10px",justifyContent:"space-around", alignItems: "center" }}>
                <h1 className="logo">ismy.institute</h1>
                <label style={{color:"#999"}}>Copyright @ {new Date().getFullYear()}</label>
            </div>
        </footer>
    )
}
export default Footer;