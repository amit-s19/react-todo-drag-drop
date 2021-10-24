import './Navbar.css';
import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Vectorsearch from '../../assets/Vectorsearch.png';
import saundarya from '../../assets/saundarya.png';
import grppic from '../../assets/grppic.png';
import filter from '../../assets/filter.png';
import Main from '../main/Main';

const Navbar = () => {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        async function setUser() {
            let name = await localStorage.getItem("userName");
            setUserName(name);
        }
        setUser();
    })

    return (
        <>
            <div className="navbar">
                <div className="navbar__left">
                    <p><img src={Vectorsearch} className="tabIcon" />Search</p>
                </div>
                <div>
                    <img src={grppic} className="tabIcon" />
                </div>
                <div className="navbar__right">
                    <p>Hi {userName} <img src={saundarya} id="saundarya" /></p>
                </div>
            </div>
            <div className="navbar2">
                <div className="navbar__left">
                    <h3>Projects</h3>
                </div>
                <div className="navbar__right">
                    <p><img src={filter} id="filter" />Filter</p>
                </div>
            </div>
            <div className="todoContent">
                <Main />
            </div>

        </>
    )
}

export default Navbar;