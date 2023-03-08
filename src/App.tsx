import React from 'react';
import {useState, useEffect} from 'react'
import './App.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


/**
 * Register imported components for chart.js
 */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)


/**
 * Interface for fetched data
 */
interface DataObject {
  timestamp: string,
  price: number,
  deliveryArea: string,
  unit: string  
}


/**
 * Interface for props
 */
interface DataObjectProps {
  data: DataObject[]
}


/**
 * Converts e/MWh to snt/kWh
 * @param eMWh number in e/MWh
 * @returns number in snt/kWh
 */
function eMWhTosntkWh(eMWh: number): number {
  let sntkWh: number = eMWh * 0.1

  return sntkWh
}


/**
 * Adds 10% to a number of its own value
 * @param n1 number
 * @returns number but 10% bigger
 * TODO: This could be normally 24% but temporarily with an if sentence changed to 10%?
 */
function arvonlisavero10(n1: number): number {
  let n2: number = n1 + (n1 * 0.1)

  return n2
}


/**
 * Changes number to string that shows 2 decimals
 * @param n1 number
 * @returns string of a number with 2 decimals
 */
function NumberTo2Decimals(n1: number): string {
  let n2: string = (Math.round(n1 * 100) / 100).toFixed(2)

  return n2
}


/**
 * Creates an element that shows average of the prices from the data
 * @param dataProps props as type: DataObjectProps
 * @returns JSX.Element
 */
const Average = (dataProps: DataObjectProps) => {
  let sumOfPrices: number = 0
  dataProps.data.map(d => sumOfPrices = sumOfPrices + d.price)
  let averagekWh: number = arvonlisavero10(eMWhTosntkWh(sumOfPrices / dataProps.data.length))
  let average2decimals: string = NumberTo2Decimals(averagekWh) 

  return (
    <div className='Box'>
      <p className='BoxText'>Keskiarvo</p>
      <p>{average2decimals} snt/kWh</p>
    </div>
  )
}


/**
 * Creates an element that shows maximum price from the data (and the hour)
 * @param dataProps props as type: DataObjectProps
 * @returns JSX.Element
 * TODO: Max and min very similar. Change them to only one function?
 */
const Max = (dataProps: DataObjectProps) => {
  let price: string = "error"
  let hour: string = "error"
  let max: number = Math.max(...dataProps.data.map(d => d.price))
  let maxO: DataObject | undefined = dataProps.data.find(d => d.price === max)
  if (maxO !== undefined) {
    price = NumberTo2Decimals(arvonlisavero10(eMWhTosntkWh(maxO.price)))
    hour = maxO.timestamp.substring(11, 16)
  }

  return (
    <div className='Box'>
      <p className='BoxText'>Kallein tunti {hour}</p>
      <p>{price} snt/kWh</p>
    </div>
  )
}


/**
 * Creates an element that shows minimum price from the data (and the hour)
 * @param dataProps props as type: DataObjectProps
 * @returns JSX.Element
 * TODO: Max and min very similar. Change them to only one function?
 */
const Min = (dataProps: DataObjectProps) => {
  let price: string = "error"
  let hour: string = "error"
  let min: number = Math.min(...dataProps.data.map(d => d.price))
  let minO: DataObject | undefined = dataProps.data.find(d => d.price === min)
  if (minO !== undefined) {
    price = NumberTo2Decimals(arvonlisavero10(eMWhTosntkWh(minO.price)))
    hour = minO.timestamp.substring(11, 16)
  }

  return (
    <div className='Box'>
      <p className='BoxText'>Halvin tunti {hour}</p>
      <p>{price} snt/kWh</p>
    </div>
  )
}


function App() {
  /**
   * State for fetched data
   */
  const [data, setData] = useState<DataObject[]>([])
  
  /**
   * Fetch data from json-server
   * TODO: error handling?
   */
  useEffect(() => {
    fetch('http://localhost:3001/spot-data')
    .then(response => response.json())
    .then(res => setData(res as DataObject[]))
  }, [])

  /**
   * Labels for chart data
   */
  const labels: string[] = data.map(d => d.timestamp.substring(11, 16))

  /**
   * Options for chart
   */
  const optionsForChart = {
    scales: {
      y: {
        suggestedMin: 0,
      }
    }
  }

  /**
   * Data for chart
   */
  const dataForChart = {
    labels,
    datasets: [
      {
        label: 'snt/kWh',
        data: data.map(d => arvonlisavero10(eMWhTosntkWh(d.price))),
        backgroundColor: '#ffdee5',
        borderWidth: 1.5,
        borderColor: '#fa193f',
      }
    ],
  }

  return (
    <div>
      <h1>Akamon - spothinta ohjelmointitehtävä</h1>
      <div className='DataBoxes'>
        <Min data={data} />
        <Max data={data} />
        <Average data={data} />
      </div>
      <div className='BarChart'>
        <Bar data={dataForChart} options={optionsForChart} />
      </div>
    </div>
  )
}


export default App