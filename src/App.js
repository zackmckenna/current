import React, { useState, useEffect } from 'react';
import logo from './mintbean.png';
import './styles/index.css';
import axios from 'axios'

import { Navbar, Nav, NavDropdown, FormControl, ListGroup, Form, Button, Container, Col, Row, FormLabel, ListGroupItem } from 'react-bootstrap'

function App() {
  const [input, setInput] = useState(1)
  const [data, setData] = useState(null)
  const [width, setWidth] = useState(1)
  const [filter, setFilter] = useState('')
  const [baseCurrency, setBaseCurrency] = useState('USD')
  const [baseRate, setBaseRate] = useState(1)

  useEffect(() =>{
    axios.get('https://v6.exchangerate-api.com/v6/57b7f2436e214a76bc0127f5/latest/USD')
                          .then(res => {
                            const data = res.data
                            console.log(data)
                            setData(Object.entries(data.conversion_rates).map(item => item))
                          })
  }, [])

  const handleInputChange = (event) => {
    event.preventDefault()
    if(event.target.value <= 1) {
      setInput(1)
    } else {
      setInput(event.target.value)
    }
  }

  const handleWidthChange = (event) => {
    if (event.target.value <=1) {
      setWidth(1)
    } else {
      event.preventDefault()
      setWidth(event.target.value)
    }
  }

  const handleFilterChange = (event) => {
    event.preventDefault()
    setFilter(event.target.value)
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
          <div style={{ color: 'red',  width: rate  }}>
            {name}
          </div>
        </Col>
    </Row>
    )
  }

  const checkData = () => {
    if(data) {
      Object.entries(data.conversion_rates).filter(item => item[0].includes(filter)).map((item, index) => {
        currency(index, item.rate, item.name)
      })
    }
  }

  const handleBaseCurrencyChange = (base, baseRate) => {
    setBaseCurrency(base)
    setBaseRate(baseRate)
  }

  const currencyComponent = (item) => {
    return (
      <>
      <ListGroup.Item className='currencyComponent' style={{ cursor: 'pointer' }} onClick={() => handleBaseCurrencyChange(item[0], item[1])}>
        <Row >
          <Col>
          {item[0]}
          </Col>
          <Col>
            {input / baseRate * item[1] }
          </Col>
        </Row>
      </ListGroup.Item>
      </>
    )
  }

  const renderData = (data, baseRate) => {
    if(data) {
      if(filter != ''){
        return data.filter(item => item[0].toLowerCase().includes(filter.toLowerCase())).map(item => {
          // return (
          //   <>
          //     <ListGroup.Item>{item[0]}</ListGroup.Item>
          //     <div style={{ backgroundColor: 'red', height: '20px', width: item[1] * input * width }}>
          //         {input / item[1] * baseRate}
          //         {baseRate}
          //     </div>
          //   </>
          // )
          return currencyComponent(item)
        })
      }
      console.log('there is data')
      return data.map(item => {
        return currencyComponent(item)
      })
    } else {
      return <h2>no data</h2>
    }
  }

  return (
    <>
      <Navbar sticky='top' bg="light" expand="lg">
        <Navbar.Brand href="#home">{input} {baseCurrency} </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <NavDropdown title="Conversion Settings" id="basic-nav-dropdown">
            <Form onSubmit={e => handleSubmit(e)}>
              <Form.Group style={{ padding: '0 20px' }} controlId="formBasicEmail">
                <Form.Control onChange={event => handleInputChange(event)} type="text" placeholder="amount" />
              </Form.Group>
              <Form.Group style={{ padding: '0 20px' }} controlId="formBasicPassword">
                <Form.Control onChange={event => handleFilterChange(event)} type="text" placeholder="filter results" />
              </Form.Group>
            </Form>
            </NavDropdown>
            <Nav.Link target="_blank" href="https://zackmckenna.com">made by zackmckenna</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="App">
        <Container style={{ maxWidth: '800px' }}>
          <Row>
            <Col style={{ color: 'white', backgroundColor: '#009FB7', borderRadius: '3px', padding: '15px'}}>
              <h1>currensea</h1>
              <p>a quick, dynamic currency converter</p>
            </Col>
          </Row>
          <Row style={{ marginTop: '2em' }}>
            <Col style={{ padding: '1em', backgroundColor: '#696773', borderRadius: '3px' }}>
              <Form onSubmit={e => handleSubmit(e)}>
                <Form.Group scontrolId="formBasicEmail">
                  <Form.Control onChange={event => handleInputChange(event)} type="text" placeholder="enter amount" />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Control onChange={event => handleFilterChange(event)} type="text" placeholder="filter results" />
                </Form.Group>
              </Form>
            </Col>
          </Row>
            {/* <Button variant="primary" type="submit">
              Submit
            </Button> */}
          <ListGroup style={{ marginTop: '1em'}}>
              <ListGroupItem style={{ backgroundColor: '#FED766'}}>Base currency</ListGroupItem>
              {currencyComponent([baseCurrency, baseRate])}
          </ListGroup>
          <Row style={{ marginBottom: '2em'}}>
            <Col>
            </Col>
          </Row>
            <ListGroup>
              <ListGroupItem style={{ backgroundColor: '#F49F0A' }}>Click to set as base currency</ListGroupItem>
              {renderData(data, baseRate)}
            </ListGroup>
        </Container>
      </div>
    </>
  );
}

export default App;
