import {useState, useEffect} from 'react'
//import React from 'react';
//import logo from './logo.svg';
import './App.css';

interface dataObject {
  timestamp: string,
  price: number,
  deliveryArea: string,
  unit: string  
}

function App() {

  const [data, setData] = useState<dataObject[]>([])

  useEffect(() => {
    fetch('http://localhost:3001/spot-data')
    .then(response => response.json())
    .then(res => setData(res as dataObject[]))
  }, [])

  return (
    <div>
      <h1>Akamon - spothinta ohjelmointitehtävä</h1>
        {data.map(d =>
          <p key={d.timestamp}>{d.price}</p>
        )}
    </div>
  );
}

export default App;
