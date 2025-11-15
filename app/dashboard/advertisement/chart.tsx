'use client';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect } from 'react';

declare global {
  interface Window {
    myLine: Chart;
  }
}
export default function CardLineChart() {
  Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend
  );

  useEffect(() => {
    var config = {
      type: 'line',
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
        ],
        datasets: [
          {
            label: new Date().getFullYear(),
            backgroundColor: '#3182ce',
            borderColor: '#3182ce',
            data: [
              65, 5, 10, 25, 200, 150, 78, 66, 44, 56, 67, 100, 65, 5, 10, 25,
              200, 150, 78, 66, 44, 56, 67, 100,
            ],
            fill: false,
          },
          {
            label: new Date().getFullYear() - 1,
            fill: false,
            backgroundColor: '#edf2f7',
            borderColor: '#edf2f7',
            data: [
              40, 68, 86, 5, 10, 25, 200, 150, 74, 56, 60, 87, 40, 68, 86, 5,
              10, 25, 200, 150, 74, 56, 60, 87,
            ],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          title: {
            display: false,
            text: 'Sales Charts',
            color: 'white',
          },
          legend: {
            labels: {
              color: 'white',
            },
            align: 'end',
            position: 'bottom',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        hover: {
          mode: 'nearest',
          intersect: true,
        },
        scales: {
          x: {
            ticks: {
              color: 'rgba(255,255,255,.7)',
            },
            display: true,
            title: {
              display: false,
              text: 'Month',
              color: 'white',
            },
            grid: {
              display: false,
              borderDash: [2],
              borderDashOffset: 2,
              color: 'rgba(33, 37, 41, 0.3)',
            },
          },
          y: {
            ticks: {
              color: 'rgba(255,255,255,.7)',
            },
            display: true,
            title: {
              display: false,
              text: 'Value',
              color: 'white',
            },
            grid: {
              borderDash: [3],
              borderDashOffset: 3,
              drawBorder: false,
              color: 'rgba(255, 255, 255, 0.15)',
            },
          },
        },
      },
    };
    const canvas = document.getElementById('line-chart') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      const newChart = new Chart(ctx, config as any);
      window.myLine = newChart;

      return () => {
        newChart.destroy();
      };
    }
  }, []);
  return (
    <>
      <div className="relative flex flex-col min-w-0 wrap-break-word w-full mb-6 shadow-lg rounded bg-blueGray-700">
        <div className="py-5 flex-auto">
          <div className="relative min-h-100">
            <canvas id="line-chart"></canvas>
          </div>
        </div>
      </div>
    </>
  );
}
