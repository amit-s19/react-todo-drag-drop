import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Image } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Group from '../assets/Group.png';
import './Form.css';
import axios from "axios";
import firebase from "firebase/app"
import { auth } from "../firebase"
import Modal from 'react-modal';
import loader from '../assets/loader.gif';

const loaderStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'transparent',
    border: 'none'
  },
};

export default function Signup() {
  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const checkboxRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const [validated, setValidated] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault()

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match!")
    }

    try {
      setError("")
      setLoading(true)
      if (!checkboxRef.current.checked)
        await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
      await signup(emailRef.current.value, passwordRef.current.value)
      let regResponse = await axios.post("https://limitless-beach-71421.herokuapp.com/api/users/signup", {
        fullName: nameRef.current.value,
        email: emailRef.current.value
      });
      localStorage.setItem("userName", nameRef.current.value);
      history.push("/")
    } catch (err) {
      if (err.message)
        setError(err.message)
      else
        setError("Unable to register!")
    }

    setLoading(false)
  }

  return (
    <>
      <div className="row">
        <Modal
          isOpen={loading}
          style={loaderStyle}
        >
          <div>
            <img src={loader} />
          </div>
        </Modal>
        <div className="col-md-7" style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 70 }}>
          <Image src={Group} />
        </div>
        <div className="col-md-5">
          <Card id="cardBody">
            <Card.Body>
              <div className="row" style={{ padding: 10 }}>
                <Link to="/login"><p className="h4" style={{ color: '#1A3B58', opacity: '33%', paddingRight: 20 }}>Log In</p></Link>
                <div>
                  <p className="h4" style={{ color: '#1A3B58' }}> Sign Up</p>
                  <div style={{ width: 20, backgroundColor: '#1A3B58', height: 3, borderRadius: 30 }}></div>
                </div>
              </div>
              <hr></hr>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group id="name">
                  <Form.Control ref={nameRef} required placeholder="Full Name" />
                  <Form.Control.Feedback type="invalid">
                    Name cannot be empty!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group id="email">
                  <Form.Control type="email" ref={emailRef} required placeholder="Email" />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group id="password">
                  <Form.Control type="password" ref={passwordRef} required placeholder="Password" />
                  <Form.Control.Feedback type="invalid">
                    Password cannot be empty!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group id="password-confirm">
                  <Form.Control type="password" ref={passwordConfirmRef} required placeholder="Confirm Password" />
                  <Form.Control.Feedback type="invalid">
                    Password cannot be empty
                  </Form.Control.Feedback>
                </Form.Group>
                <Button disabled={loading} className="w-100" type="submit" id="submitButton">
                  Sign Up
                </Button>
                <Form.Group id="rememberMe">
                  <Form.Check ref={checkboxRef} type="checkbox" label="Remember Me" style={{ color: '#1A3B58', fontSize: 12, paddingTop: 30 }} />
                </Form.Group>
              </Form>
              <p className="w-100 text-center mt-3" style={{fontSize: 10, color: 'rgba(0,0,0,0.7)'}}>Note: It may take some time for the intial requests as the server is idle when not receiving requests.</p>

            </Card.Body>
          </Card>

        </div>
      </div>
    </>
  )
}
