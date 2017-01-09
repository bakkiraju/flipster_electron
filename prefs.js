'use strict';

var {ipcRenderer, remote} = require('electron');

function prepareTab(tab, val) {
   console.log(val);
}

function showTabContent(id) {
  activeTab = document.getElementsByClassName('.tab-item active');

}

ipcRenderer.on('update-value',(event, arg) => {
    // Print 5
    console.log(arg);
});

var activetab = document.querySelectorAll('.tab-group');

console.log(activetab);

prepareTab(activetab, activetab.querySelector('.icon*'));
