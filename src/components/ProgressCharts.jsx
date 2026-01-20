import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getAuthService, getDataService } from '../services/serviceProvider';
import moment from 'moment'; // For date formatting

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ProgressCharts() {
  const [chartData, setChartData] = useState(null); // Set initial state to null

  // Helper function to get the next 6 months starting from the current month
  const getNextSixMonths = () => {
    return Array.from({ length: 6 }, (_, i) =>
      moment().add(i, 'months').format('MMM')
    );
  };

  const groupDataByMonth = (weights) => {
    const monthData = {};
    const nextSixMonths = getNextSixMonths();
    //console.log(nextSixMonths)

    // Initialize all months with 0
    nextSixMonths.forEach((month) => {
      monthData[month] = 0;
    });
    // console.log(nextSixMonths)

    // Loop through weights data and group by month
    weights.forEach((entry) => {
      const month = moment(entry.$createdAt).format('MMM'); // Get the month from the data
      if (nextSixMonths.includes(month)) {
        // Only consider months in the next 6 months
        if (!monthData[month]) {
          monthData[month] = [];
        }
        monthData[month].push(entry.weight);
      }
    });

    // Calculate average weight per month
    const data = nextSixMonths.map((month) => {
      const weights = monthData[month];
      return weights.length > 0 ? weights.reduce((sum, weight) => sum + weight, 0) / weights.length : 0;
    });

    return { labels: nextSixMonths, data };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authService = getAuthService();
        const dataService = getDataService();
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          const userInfo = await dataService.getAllWeights(currentUser.$id);
          if (userInfo && userInfo.documents && userInfo.documents.length > 0) {
            const groupedData = groupDataByMonth(userInfo.documents);
            setChartData({
              labels: groupedData.labels,
              datasets: [
                {
                  label: 'Weight',
                  data: groupedData.data,
                  backgroundColor: '#4f46e5',
                },
              ],
            });
          } else {
            setChartData(null); // No data available
          }
        }
      } catch (error) {
        console.error('Error fetching weight data:', error);
        setChartData(null);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-md transition-colors">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Weight Progress</h2>
      <div className="h-64 w-full">
        {chartData ? (
          <Bar
            data={chartData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  labels: {
                    color: '#9ca3af' // gray-400
                  }
                },
                title: {
                  display: false
                }
              },
              scales: {
                y: {
                  ticks: { color: '#9ca3af' },
                  grid: { color: '#374151' } // dark-700
                },
                x: {
                  ticks: { color: '#9ca3af' },
                  grid: { display: false }
                }
              }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-40">
            <p className="text-2xl font-bold text-gray-400 text-center">No Weight data available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
