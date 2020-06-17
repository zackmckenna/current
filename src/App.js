import React, { useState, useEffect } from 'react';
import logo from './mintbean.png';
import './styles/index.css';
import axios from 'axios'

import { Form, Button, Container, Col, Row } from 'react-bootstrap'

function App() {
  const [input, setInput] = useState(1)
  const [data, setData] = useState(null)
  const [width, setWidth] = useState(1)

  let listItems = []

  const handleInputChange = (event) => {
    event.preventDefault()
    setInput(event.target.value)
  }

  const handleWidthChange = (event) => {
    event.preventDefault()
    setWidth(event.target.value)
  }

  const logData = (event) => {
    event.preventDefault()

    console.log(data)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(input)
    axios.get('https://v6.exchangerate-api.com/v6/57b7f2436e214a76bc0127f5/latest/USD')
                          .then(res => {
                            const data = res.data
                            console.log(data)
                            setData(Object.entries(data.conversion_rates).map(item => item))
                          })

  }



  const currency = (index, rate, name) => {
    return (
      <Row key={index}>
        <Col>
          <div style={{ color: 'red',  width: rate }}>
            {name}
          </div>
        </Col>
    </Row>
    )
  }

  const checkData = () => {
    if(data) {
      Object.entries(data.conversion_rates).map((item, index) => {
        currency(index, item.rate, item.name)
      })
    }
  }

  const renderData = (data) => {
    if(data) {
      console.log('there is data')
      return data.map(item => {
        return (
          <>
            <li>{item[0]}</li>
            <div style={{ backgroundColor: 'red', height: '20px', width: item[1] * input * width }}>
                {item[1] * input}
            </div>
          </>
        )
      })
    } else {
      return <h2>no data</h2>
    }
  }

  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <h1>CURRENT</h1>
          </Col>
        </Row>
        <Button onClick={event => logData(event)}>
          Log data
        </Button>
        <Button onClick={event => checkData(event)}>
            Check data
        </Button>
        <Form onSubmit={e => handleSubmit(e)}>
          <Form.Group controlId="formBasicEmail">
            <Form.Control onChange={event => handleInputChange(event)} type="text" placeholder="enter target rate" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Comparison Width</Form.Label>
            <Form.Control onChange={event => handleWidthChange(event)} type="text" placeholder="comparison width" />
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <h2>The </h2>
          <ul>
            {renderData(data)}
          </ul>
      </Form>
      </Container>
    </div>
  );
}

export default App;
