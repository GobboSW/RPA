// Register the service worker for offline use
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// Function to save data to Local Storage
function saveDataToLocalStorage(address, description, hoursWorked, dollarAmount, receiptFiles) {
  let receiptNames = [];
  if (receiptFiles) {
    for (let i = 0; i < receiptFiles.length; i++) {
      receiptNames.push(receiptFiles[i].name);
    }
  }

  let timestamp = new Date().toISOString();
  let newEntry = {
    address,
    description,
    hoursWorked: parseFloat(hoursWorked),
    dollarAmount: parseFloat(dollarAmount),
    receiptNames,
    timestamp
  };

  let existingEntries = JSON.parse(localStorage.getItem('csvData')) || [];
  existingEntries.push(newEntry);
  localStorage.setItem('csvData', JSON.stringify(existingEntries));
}

function displayStoredData() {
  const dataListElement = document.getElementById('dataList');
  dataListElement.innerHTML = ''; // Clear any existing content
  const storedDataString = localStorage.getItem('csvData');
  let totalDollarsSpent = 0;
  let totalHoursWorked = 0;
  let propertySums = {};
  console.log('Total Hours in show log:', totalHoursWorked);
  console.log('Total Hours in show log:');

  if (storedDataString) {
    const dataEntries = JSON.parse(storedDataString);

    dataEntries.forEach(entry => {
      totalDollarsSpent += entry.dollarAmount;
      totalHoursWorked += entry.hoursWorked;
      if (!propertySums[entry.address]) {
        propertySums[entry.address] = { totalDollars: 0, totalHours: 0 };
      }
      propertySums[entry.address].totalDollars += entry.dollarAmount;
      propertySums[entry.address].totalHours += entry.hoursWorked;
      console.log('Total Hours in show log:', totalHoursWorked);
    });

    for (const [address, sums] of Object.entries(propertySums)) {
      const propertyItem = document.createElement('li');
      propertyItem.textContent = `Address: ${address}, Total Dollars Spent: ${sums.totalDollars.toFixed(2)}, Total Hours Worked: ${sums.totalHours.toFixed(2)}`;
      dataListElement.appendChild(propertyItem);
    }

    const totalItem = document.createElement('li');
    totalItem.textContent = `Total - Dollars Spent: ${totalDollarsSpent.toFixed(2)}, Hours Worked: ${totalHoursWorked.toFixed(2)}`;
    dataListElement.appendChild(totalItem);
    console.log('Total Hours in show log:', totalHours);
    updateProgressBar(totalHoursWorked);
  } else {
    console.log("No data found in Local Storage.");
    updateProgressBar(0); // Reset progress bar if no data is found
  }
}

function updateProgressBar(totalHours = null) {
  const progressBar = document.getElementById('progress-bar');
  const maxHours = 750; // Total hours for 100% completion

  if (totalHours === null) {
    // If totalHours is not provided, calculate from stored data
    const storedDataString = localStorage.getItem('csvData');
    if (storedDataString) {
      const dataEntries = JSON.parse(storedDataString);
      totalHours = dataEntries.reduce((sum, entry) => sum + (parseFloat(entry.hoursWorked) || 0), 0);
      console.log("Total hours.", totalHours);
    } else {
      totalHours = 0;
    }
  }

  // Log totalHours to the console
  console.log('Total Hours (updateProgressBar):', totalHours);

  progressBar.value = (totalHours / maxHours) * 100;
}



document.addEventListener('DOMContentLoaded', () => {
  const logTimeBtn = document.getElementById('log-time-btn');
  const showLogBtn = document.getElementById('show-log-btn');
  const editLogBtn = document.getElementById('edit-log-btn');

  //showLogBtn.addEventListener('click', displayStoredData);

 // Initialize progress bar on page load
 updateProgressBar();
});

function displayRawData() {
  console.log("Displaying raw data...");
  const rawDataContainer = document.getElementById('raw-data');
  rawDataContainer.innerHTML = ''; // Clear previous content

  console.log("Cleared old data.");

  try {
    const storedDataString = localStorage.getItem('csvData');
    console.log("Retrieved data from localStorage:", storedDataString);
    
    if (storedDataString) {
      const storedData = JSON.parse(storedDataString);
      console.log("Parsed data:", storedData);
      rawDataContainer.textContent = JSON.stringify(storedData, null, 2);
      editRawData();
      console.log("Displayed new data.");
    } else {
      rawDataContainer.textContent = "No data found.";
      console.log("No data found in localStorage.");
    }
  } catch (error) {
    console.error("Failed to display raw data:", error);
  }
}

function editRawData() {
  const rawDataContainer = document.getElementById('rawDataContainer');
  const editableRawDataArea = document.getElementById('editableRawData');
  const rawDataString = localStorage.getItem('csvData');
  if (rawDataString) {
    const formattedData = JSON.stringify(JSON.parse(rawDataString), null, 2);
    editableRawDataArea.value = formattedData;
    rawDataContainer.style.display = 'none'; // Hide the non-editable view
    editableRawDataArea.style.display = 'block'; // Show the editable area
    document.getElementById('save-raw-data').style.display = 'block'; // Show the save button
  } else {
    alert("No raw data found in Local Storage.");
  }
}

// Function to save the edited raw data back to Local Storage
function saveRawData() {
  const editableRawDataArea = document.getElementById('editableRawData');
  try {
    // Attempt to parse the text as JSON to ensure it's valid
    const editedData = JSON.parse(editableRawDataArea.value);
    localStorage.setItem('csvData', JSON.stringify(editedData));
    alert('Data saved successfully.');

    // Hide the editable area and save button, show the non-editable view
    editableRawDataArea.style.display = 'none';
    document.getElementById('save-raw-data').style.display = 'none';
    displayStoredData(); // Refresh the displayed data
  } catch (e) {
    alert('Failed to save data: Invalid JSON format.');
  }
}
