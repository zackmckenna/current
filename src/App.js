import React, { useState, useEffect } from 'react';
import logo from './mintbean.png';
import './styles/index.css';
import axios from 'axios'

import { ListGroup, Form, Button, Container, Col, Row } from 'react-bootstrap'

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
    setInput(event.target.value)
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

  const renderData = (data, baseRate) => {
    if(data) {
      if(filter != ''){
        return data.filter(item => item[0].toLowerCase().includes(filter.toLowerCase())).map(item => {
          return (
            <>
              <ListGroup.Item>{item[0]}</ListGroup.Item>
              <div style={{ backgroundColor: 'red', height: '20px', width: item[1] * input * width }}>
                  {input / item[1] * baseRate}
                  {baseRate}
              </div>
            </>
          )
        })
      }
      console.log('there is data')
      return data.map(item => {
        return (
          <>
            <ListGroup.Item>{input} {baseCurrency} = {input/baseRate * item[1]} {item[0]}</ListGroup.Item>
            <Button onClick={() => handleBaseCurrencyChange(item[0], item[1])}>Set as Base Currency</Button>
            <div style={{ backgroundColor: 'red', height: '20px', width: item[1] * input * width }}>
                {input / baseRate * item[1] }
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
            <Form.Label>Amount</Form.Label>
            <Form.Control onChange={event => handleInputChange(event)} type="text" placeholder="enter target rate" />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Comparison Scale</Form.Label>
            <Form.Control onChange={event => handleWidthChange(event)} type="text" placeholder="comparison width" />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Filter results</Form.Label>
            <Form.Control onChange={event => handleFilterChange(event)} type="text" placeholder="filter results" />
          </Form.Group>
          {/* <Button variant="primary" type="submit">
            Submit
          </Button> */}
          <h2>comparison scale is set at {width} pixels</h2>

          <ListGroup>
            {renderData(data, baseRate)}
          </ListGroup>
      </Form>
      </Container>
    </div>
  );
}

export default App;
