import React, { useState, useEffect } from 'react';
import axios from 'axios';
const categoryToApiMapping = {
    'Default': {
        function: 'TOP_GAINERS_LOSERS',
        // ... other necessary parameters
    },
    'Core Stock Info': {
      function: 'TIME_SERIES_DAILY_ADJUSTED',
      symbol: 'MSFT', // Example, adjust as necessary
    },
    'Forex': {
      function: 'CURRENCY_EXCHANGE_RATE',
      from_currency: 'USD',
      to_currency: 'JPY', // Example, adjust as necessary
    },
    'Crypto': {
      function: 'DIGITAL_CURRENCY_DAILY',
      symbol: 'BTC',
      market: 'USD', 
    },
    'Commodities': {
      function: 'COMMODITY_SEARCH',
      keywords: 'Gold', // Example, adjust as necessary
    },
    'Economic Indicators': {
      // You may need a different AlphaVantage endpoint or API for economic indicators.
      // Example placeholder:
      function: 'ECONOMIC_INDICATOR_FUNCTION',
    },
    'Technical Indicators': {
      function: 'RSI', // RSI is just an example of a technical indicator
      symbol: 'MSFT',
      interval: 'daily',
      time_period: '14',
      series_type: 'close',
    },
  };
  function StockInfoComponent({ category }) {
    const [alphaVantageData, setAlphaVantageData] = useState(null);
  
    useEffect(() => {
      async function fetchData() {
        const selectedCategory = category || 'Default';
  
        if (categoryToApiMapping[selectedCategory]) {
          const params = categoryToApiMapping[selectedCategory];
          const baseUrl = `https://www.alphavantage.co/query?apikey=YOUR_API_KEY`;
  
          const url = `${baseUrl}&${new URLSearchParams(params).toString()}`;
  
          try {
            const response = await axios.get(url);
            setAlphaVantageData(response.data);
          } catch (error) {
            console.error("Error fetching data from AlphaVantage:", error);
          }
        }
      }
  
      fetchData();
    }, [category]);
  
    const renderDefault = () => {
        // Making a guess on the response structure here.
        if (!alphaVantageData || !alphaVantageData['Rank A: Real-Time Performance']) return null;
    
        // Assuming that the 'Rank A: Real-Time Performance' object has sectors as keys and percentages as values.
        // Sorting the entries based on percentages.
        const sortedData = Object.entries(alphaVantageData['Rank A: Real-Time Performance'])
            .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));  // sort by descending percentages
        
        const topGainers = sortedData.slice(0, 5);  // Get top 5
        const topLosers = sortedData.slice(-5);     // Get bottom 5
    
        return (
            <>
                <h4>Top Gainers:</h4>
                <ul>
                    {topGainers.map(([sector, percentage]) => (
                        <li key={sector} style={{ color: 'green' }}>
                            {sector}: {percentage}%
                        </li>
                    ))}
                </ul>
                <h4>Top Losers:</h4>
                <ul>
                    {topLosers.map(([sector, percentage]) => (
                        <li key={sector} style={{ color: 'red' }}>
                            {sector}: {percentage}%
                        </li>
                    ))}
                </ul>
            </>
        );
    };
    
  
    if (!alphaVantageData) return null;
  
    return (
      <div className="stock-info-container">
        {category === 'Default' ? renderDefault() : <div>{JSON.stringify(alphaVantageData)}</div>}
      </div>
    );
  }
  
  export default StockInfoComponent;