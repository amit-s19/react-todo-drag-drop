import React, { useState } from "react"
import { Image } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import './Dashboard.css';
import project from '../assets/project.png';
import Navbar from './navbar/Navbar';
import Sidebar from "./sidebar/Sidebar";

export default function Dashboard() {
  return (
    <>
      <div className="container">
        <Navbar  />
        <Sidebar  />
      </div>
    </>
  )
}
