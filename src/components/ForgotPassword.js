import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Image } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import Group from '../assets/Group.png';
import './Form.css';

export default function ForgotPassword() {
  const emailRef = useRef()
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
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
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Check your inbox for further instructions")
    } catch (err) {
      setError(err.message)
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
              <div>
                <p className="h4" style={{ color: '#1A3B58', paddingRight: 20 }}>Password Reset</p>
                <div style={{ width: 20, backgroundColor: '#1A3B58', height: 3, borderRadius: 30 }}></div>
              </div>
              <hr></hr>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group id="email">
                  <Form.Control type="email" ref={emailRef} required placeholder="Email" />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email!
                  </Form.Control.Feedback>
                </Form.Group>
                <Button disabled={loading} className="w-100" type="submit" id="submitButton">
                  Reset Password
                </Button>
              </Form>
              <div className="w-100 text-center mt-3">
                <Link to="/login"><p id="resetPassword">Cancel</p></Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  )
}
