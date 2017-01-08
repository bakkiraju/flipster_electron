'use strict';

function prepareTab(tab, val) {
   console.log(val);
}

function showTabContent(id) {
  activeTab = document.querySelector('.tab-item active');
  icon = activeTab.querySelector('icon*');
  icon.css('background-color', '#ffffff');
}

var activetab = document.querySelectorAll('.tab-group');

console.log(activetab);

prepareTab(activetab, activetab.querySelector('.icon*'));
