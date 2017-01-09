'use strict';

var {ipcRenderer, remote} = require('electron');

function prepareTab(tab, val) {
   console.log(val);
}

function showTabContent(id) {
  //activeTab = document.getElementsByClassName('.tab-item active');
   console.log(id);
}

function updateValue(arg) {
  if (arg === "Up") {
    console.log("Increasing value");
  } else

  if (arg === "Down") {
    console.log("Decreasing value")
  } else
  console.log(arg)

  ipcRenderer.send("update-done","done")     
}

ipcRenderer.on('update-value',(event, arg) => {
    console.log(arg);
    updateValue(arg);
});
