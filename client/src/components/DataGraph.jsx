import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);
// TODO: JSDoc here.
export default React.forwardRef(function DataGraph(props, ref) {
  const [options] = React.useState({
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: props.title,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    animations: {
      y: {duration: 0},
    },
    scales: {
      y: {
        ticks: {
          callback: (label) =>
            `${nFormatter(label, 2)}${
                props.yTickAdornment?
                props.yTickAdornment:''}`,
        },
      },
    },
  });

  const [data, setData] = React.useState({
    labels: [],
    datasets: [
      {
        label: 'Dataset 1',
        data: [],
        borderColor: '#49eacb',
        backgroundColor: 'rgba(73, 234, 203, 0.5)',
        lineTension: 0.3,
      },
    ],
  });
  React.useImperativeHandle(ref, () => ({
    addData,
  }));
  const addData = (value) => {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    setData((prevData) => {
      const newLabels = [...prevData.labels, formattedTime];
      const newData = [
        {
          ...prevData.datasets[0],
          data: [...prevData.datasets[0].data, value],
        },
      ];
      return {labels: newLabels, datasets: newData};
    });
  };

  return (
    <div>
      <Line options={options} data={data} />
    </div>
  );
});
// https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
function nFormatter(num, digits) {
  const lookup = [
    {value: 1, symbol: ''},
    {value: 1e3, symbol: ' k'},
    {value: 1e6, symbol: ' M'},
    {value: 1e9, symbol: ' G'},
    {value: 1e12, symbol: ' T'},
    {value: 1e15, symbol: ' P'},
    {value: 1e18, symbol: ' E'},
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup.slice().reverse().find(function(item) {
    return num >= item.value;
  });
  return item ? (num / item.value)
      .toFixed(digits)
      .replace(rx, '$1') + item.symbol : '0';
}
