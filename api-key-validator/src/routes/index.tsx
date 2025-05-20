import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import logo from '../logo.svg'
import '../App.css'

export const Route = createFileRoute('/')({
  component: App,
})

// List of HERE services to validate
const services = [
  {
    name: 'Geocoding and Search API v7',
    endpoint:
      'https://discover.search.hereapi.com/v1/discover?at=52.5228,13.4124&q=petrol+station&limit=5&apiKey=',
  },
  {
    name: 'weather',
    endpoint:
      'https://weather.hereapi.com/v3/report?products=observation&q=Riga,Latvia&apiKey=',
  },
  {
    name: 'weather PREMIUM',
    endpoint: 'https://weather.hereapi.com/v3/tile/9/456/196/radar?apiKey=',
  },
]

function App() {
  const [APIKeyvalue, setAPIKeyValue] = useState('')

  const fetchServiceStatus = async (endpoint) => {
    const response = await fetch(`${endpoint}${APIKeyvalue}`)
    console.log(response)

    return response.ok ? 'valid' : 'invalid'
  }

  const queries = services.map((service) => ({
    queryKey: ['serviceStatus', service.name],
    queryFn: () => fetchServiceStatus(service.endpoint),
    enabled: !!APIKeyvalue, // Only run the query if APIKeyvalue is not empty
  }))

  const results = useQueries({ queries })
  console.log('res------', results)
  const ValiditeAPIKey = () => {
    results.forEach((result) => result.refetch())
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>HERE API Key Validator</h2>
      </header>
      <div className="App-body">
        <input
          placeholder="Insert the API key"
          value={APIKeyvalue}
          onChange={(e) => setAPIKeyValue(e.target.value)}
        />
        <button type="button" onClick={ValiditeAPIKey}>
          Validate
        </button>
        <div>
          {services.map((service, index) => (
            <div key={service.name} className="service">
              <span>{service.name}</span>
              <div
                className={`bubble ${results[index].data === 'valid' ? 'green' : results[index].data === 'invalid' ? 'red' : ''}`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
