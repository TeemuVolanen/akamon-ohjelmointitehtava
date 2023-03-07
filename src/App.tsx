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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DataObject {
  timestamp: string,
  price: number,
  deliveryArea: string,
  unit: string  
}

interface DataObjectProps {
  data: DataObject[]
}

function eMWhTosntkWh(MWh: number): number {
  let kWh = MWh * 0.1
  return kWh
}

function arvonlisavero10(n1: number): number {
  let n2: number = n1 + (n1 * 0.1)
  return n2
}

function NumberTo2Decimals(n1: number): string {
  let n2: string = (Math.round(n1 * 100) / 100).toFixed(2)
  return n2
}

const Average = (stuff: DataObjectProps) => {
  let sumOfPrices: number = 0
  stuff.data.map(d => sumOfPrices = sumOfPrices + d.price)
  let averagekWh: number = arvonlisavero10(eMWhTosntkWh(sumOfPrices / stuff.data.length))
  let average2decimals: string = NumberTo2Decimals(averagekWh) 
  return (
    <div className='Box'>
      <p>Keskiarvo</p>
      <p>{average2decimals} snt/kWh</p>
    </div>
  )
}

const Max = (stuff: DataObjectProps) => {
  let price: string = "error"
  let hour: string = "error"
  let max: number = Math.max(...stuff.data.map(d => d.price))
  const maxO: DataObject | undefined = stuff.data.find(d => d.price === max)
  if (maxO !== undefined) {
    price = NumberTo2Decimals(arvonlisavero10(eMWhTosntkWh(maxO.price)))
    hour = maxO.timestamp.substring(11, 16)
  }
  return (
    <div className='Box'>
      <p>Kallein tunti {hour}</p>
      <p>{price} snt/kWh</p>
    </div>
  )
}

const Min = (stuff: DataObjectProps) => {
  let price: string = "error"
  let hour: string = "error"
  let min: number = Math.min(...stuff.data.map(d => d.price))
  const minO: DataObject | undefined = stuff.data.find(d => d.price === min)
  if (minO !== undefined) {
    price = NumberTo2Decimals(arvonlisavero10(eMWhTosntkWh(minO.price)))
    hour = minO.timestamp.substring(11, 16)
  }
  return (
    <div className='Box'>
      <p>Halvin tunti {hour}</p>
      <p>{price} snt/kWh</p>
    </div>
  )
}

function App() {

  const [data, setData] = useState<DataObject[]>([])
  
  useEffect(() => {
    fetch('http://localhost:3001/spot-data')
    .then(response => response.json())
    .then(res => setData(res as DataObject[]))
  }, [])

  const labels = data.map(d => d.timestamp.substring(11, 16))

  const dataForChart = {
    labels,
    datasets: [
      {
        label: 'snt/kWh',
        data: data.map(d => NumberTo2Decimals(arvonlisavero10(eMWhTosntkWh(d.price)))),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };
    
  return (
    <div>
      <h1>Akamon - spothinta ohjelmointitehtävä</h1>
      <div className='DataBoxes'>
        <Min data={data} />
        <Max data={data} />
        <Average data={data} />
      </div>
      <div className='BarChart'>
        <Bar data={dataForChart} />
      </div>
    </div>
  );
}

export default App;
