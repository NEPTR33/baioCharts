"use strict";
///////////////////////////////
//Variables
let currentSearch;
let input = document.getElementById("input");
const defaultFieldText = "Enter stock symbol...";
const btn1 = document.getElementById("btn1");
const stockTicker = document.getElementsByClassName("stock-ticker");
const graphContainer = document.getElementsByClassName("phppot-container");
const hidden = document.getElementsByClassName("hidden");
const updateInputField = function () {
  input.value = defaultFieldText;
  let el = document.querySelector(":focus");
  if (el) el.blur();
};
//////////////////////////////
//Functions

// update ticker
const displayTicker = function () {
  (async function () {
    //fetch data
    fetchStock(input.value);
    currentSearch = input.value.toUpperCase();
    const resStock = await fetch(
      `https://financialmodelingprep.com/api/v3/quote/${input.value.toUpperCase()}?apikey=227839811b8142d28d844e99db7d19c0`
    );
    const dataStock = await resStock.json();

    if (dataStock.length === 0 || currentSearch === "") {
      input.value = "Ticker not found...";
      throw new Error("symbol not recognized!");
    }
    //set text content for ticker
    stockTicker[0].textContent = `${currentSearch.toUpperCase()} / ${
      dataStock[0].name
    }`;
    //remove hidden
    hidden[0] !== undefined ? hidden[0].classList.remove("hidden") : null;
  })();
};
// create chart
let chart;
const createChart = function (data, dates) {
  if (!chart) {
    chart = new Chart(document.getElementById("line-chart"), {
      type: "line",
      data: {
        labels: dates,
        datasets: data,
      },
      options: {
        scales: {
          y: {
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, index, ticks) {
                return "$" + value.toLocaleString();
              },
            },
          },
        },
        elements: {
          point: {
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        },
      },
    });
  } else {
    chart.data.datasets = data;
    chart.update();
  }
};

//Fetch/store stock data
const fetchStock = async function (stockTicker) {
  try {
    let cashFlowArr = [];
    let stockCompArr = [];
    let dates = [];

    //Fetch stock data
    const resStock = await fetch(
      `https://financialmodelingprep.com/api/v3/cash-flow-statement/${stockTicker}?apikey=227839811b8142d28d844e99db7d19c0`
    );
    const dataStock = await resStock.json();

    //Push data into empty arrays
    for (let i = 9; i > -1; i--) {
      cashFlowArr.push(dataStock[i].freeCashFlow);
    }
    for (let i = 9; i > -1; i--) {
      stockCompArr.push(dataStock[i].stockBasedCompensation);
    }
    for (let i = 9; i > -1; i--) {
      dates.push(dataStock[i].date.slice(0, 4));
    }

    console.log(dates);

    const data = [
      {
        data: cashFlowArr,
        label: "Free Cash Flow",
        borderColor: "#3cba9f",
        fill: false,
      },
      {
        data: stockCompArr,
        label: "Stock Based Compensation",
        borderColor: "#e43202",
        fill: false,
      },
    ];
    createChart(data, dates);
  } catch {
    console.log("error");
  }
};
//////////////////////////
//Invoke/Event Listeners
btn1.addEventListener("click", function (e) {
  if (input.value.length > 0);
  displayTicker();
  updateInputField();
});

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    displayTicker();
    updateInputField();
  }
});

// document.addEventListener("click", function (e) {
//   e.target !== input ? updateInputField() : null;
// });

input.addEventListener("input", function (e) {
  e.data === " " ? updateInputField() : input.value === e.data;
});

//////////////////////////
//Fetch testing
const testFetch = async function () {
  const resStock = await fetch(
    `https://financialmodelingprep.com/api/v4/institutional-ownership/institutional-holders/symbol-ownership?date=2021-09-30&symbol=AAPL&page=0&apikey=227839811b8142d28d844e99db7d19c0`
  );
  const dataStock = await resStock.json();
};

testFetch();
