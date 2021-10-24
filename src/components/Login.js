import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Image, Container } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { auth } from "../firebase"
import { Link, useHistory } from "react-router-dom"
import Group from '../assets/Group.png';
import './Form.css';
import firebase from "firebase/app"
import axios from "axios"
export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const checkboxRef = useRef()
  const { login } = useAuth()
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
    try {
      setError("")
      setLoading(true)
      if (!checkboxRef.current.checked)
        await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
      await login(emailRef.current.value, passwordRef.current.value)
      let dbResponse = await axios.post("https://limitless-beach-71421.herokuapp.com/api/users/getUserName", {
        email: emailRef.current.value
      });
      localStorage.setItem("userName", dbResponse.data.fullName);
      history.push("/")
    } catch (err) {
      if (err.message)
        setError(err.message)
      else
        setError("Unable to login!");
    }

    setLoading(false)
  }

  return (
    <>
      <div className="row">
        <div className="col-md-7" style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 70 }}>
          <Image src={Group} />
        </div>
        <div className="col-md-5">
          <Card id="cardBody">
            <Card.Body>
              <div className="row" style={{ padding: 10 }}>
                <div>
                  <p className="h4" style={{ color: '#1A3B58', paddingRight: 20 }}>Log In</p>
                  <div style={{ width: 20, backgroundColor: '#1A3B58', height: 3, borderRadius: 30 }}></div>
                </div>
                <Link to="/signup"><p className="h4" style={{ color: '#1A3B58', opacity: '33%' }}> Sign Up</p></Link>
              </div>

              <hr></hr>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Control type="email" ref={emailRef} required placeholder="Email" />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group id="password">
                  <Form.Control type="password" ref={passwordRef} required placeholder="Password" />
                  <Form.Control.Feedback type="invalid">
                    Password cannot be empty!
                  </Form.Control.Feedback>
                </Form.Group>
                <Button disabled={loading} className="w-100" type="submit" id="submitButton">
                  Log In
                </Button>
                <Form.Group id="rememberMe">
                  <Form.Check ref={checkboxRef} type="checkbox" label="Remember Me" style={{ color: '#1A3B58', fontSize: 12, paddingTop: 30 }} />
                </Form.Group>
              </Form>
              <div className="w-100 text-center mt-3">
                <Link to="/forgot-password"><p id="forgotPassword">Forgot Password?</p></Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  )
}
