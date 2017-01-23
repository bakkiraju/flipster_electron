'use strict';
'use babel';

var React = require('react');
var ReactDom = require('react-dom');

var {ipcRenderer, remote} = require('electron');

 const root = document.getElementById('scaffold');

var MultiTabWidget =  React.createClass({

    getInitialState: function() {
        return {
            opts: {}
        };
    },

    componentDidMount: function(){
      console.log("Multitab widget mounted")
    },

    render: function() {
        return <div>Hello</div>
    }
});

ReactDom.render(<MultiTabWidget/>, root);

function prepareTab(tab, val) {
   console.log(val);
}

ipcRenderer.on('update-scaffold',(event, arg) => {
    console.log(arg);
});

// function showTabContent(id) {
//   //activeTab = document.getElementsByClassName('.tab-item active');
//    console.log(id);
// }
//
// function updateValue(arg) {
//
//   var elem = document.getElementById('active_tab_content')
//
//   var val = parseInt(elem.innerHTML);
//
//   if (arg === "Up") {
//     console.log("Increasing value");
//     val = val + 1
//   } else if (arg === "Down") {
//     console.log("Decreasing value")
//     val = val - 1
//   } else {
//     val = arg;
//     console.log("Updated via external message:",val)
//   }
//
//   elem.innerHTML = val.toString();
//
//   ipcRenderer.send("update-done",arg,val)
// }
//
// ipcRenderer.on('update-value',(event, arg) => {
//     console.log(arg);
//     updateValue(arg);
// });
