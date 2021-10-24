import './Sidebar.css';
import React  from 'react';
import { useAuth } from "../../contexts/AuthContext"
import { Button, Image } from 'react-bootstrap';
import { Link, useHistory } from "react-router-dom"
import Project from '../../assets/project.png';
import Vectoroverview from '../../assets/Vectoroverview.png';
import Vectorstats from '../../assets/Vectorstats.png';
import Groupsettings from '../../assets/Groupsettings.png';
import Groupchat from '../../assets/Groupchat.png';
import Groupcalendar from '../../assets/Groupcalendar.png';
import Grouplogout from '../../assets/Grouplogout.png';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    },
};

Modal.setAppElement('#root');

const Sidebar = () => {
    const { logout } = useAuth()
    const history = useHistory()
    async function handleLogout() {
        try {
            await logout()
            history.push("/login")
        } catch (err) {
            console.log(err);
        }
    }

    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div id="sidebar">
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div style={{ padding: 50, borderRadius: 50 }}>
                    <h5 >You sure you wanna leave? 😭</h5>
                    <div style={{ marginTop: 20 }}>
                        <Button onClick={closeModal} style={{ backgroundColor: '#fff', borderColor: "#329C89", marginRight: 10, color: "#329C89" }}>I'll stay</Button>
                        <Button onClick={handleLogout} style={{ backgroundColor: '#329C89', borderColor: "#329C89" }}>Yes, bie!</Button>
                    </div>
                </div>
            </Modal>
            <div className="sidebar__title">
                <div className="sidebar__img">
                    <h1>.taskez</h1>
                </div>
            </div>
            <div className="sidebar__menu">
                <div id="topElements">
                    <div className="sidebar__link">
                        <img src={Vectoroverview} className="tabIcon" />
                        <a href="#">Overview</a>
                    </div>
                    <div className="sidebar__link">
                        <img src={Vectorstats} className="tabIcon" />
                        <a href="#">Stats</a>
                    </div>
                    <div className="sidebar__link">
                        <img src={Project} className="tabIcon" />
                        <a href="#" id="activeTab">Projects</a>
                    </div>
                    <div className="sidebar__link">
                        <img src={Groupchat} className="tabIcon" />
                        <a href="#">Chat</a>
                    </div>
                    <div className="sidebar__link">
                        <img src={Groupcalendar} className="tabIcon" />
                        <a href="#">Calendar</a>
                    </div>
                </div>
                <div id="lastElements">
                    <div className="sidebar__link">
                        <img src={Groupsettings} className="tabIcon" />
                        <a href="#">Settings</a>
                    </div>
                    <div className="sidebar__link" style={{ display: 'flex' }}>
                        <div>
                            <img src={Grouplogout} className="tabIcon" />
                        </div>
                        <p style={{ display: 'flex', color: '#a5aaad', cursor: 'pointer' }} href="" onClick={openModal}>Log Out</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;