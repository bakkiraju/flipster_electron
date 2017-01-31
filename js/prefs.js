'use strict';
'use babel';

var React = require('react');
var ReactDom = require('react-dom');
var {ipcRenderer, remote} = require('electron');
const root = document.getElementById('scaffold');

let RenderOpts = [];

function TabWidget(props) {

  const tabStyle = {
       "fontSize": '50' + 'px',
      "paddingTop": '20' + 'px'
  };

  console.log('Tab widget props', props.tabOpts);

  const tabOpts = props.tabOpts;

    return (
        <div className="tab-item">
          <div className={tabOpts.optSymbolType + " " + tabOpts.optSymbolValue}
               style={tabStyle}>
          </div>
          <div id="ValueContainer">
          </div>
        </div>
    );
}

function SingleScreen(props) {

  const tabStyle = {
       "fontSize": '50' + 'px',
      "paddingTop": '20' + 'px'
  };

  console.log('Single Screen widget props', props.tabOpts);

  const tabOpts = props.tabOpts;

    return (
        <div>
          <div className={tabOpts.optSymbolType + " " + tabOpts.optSymbolValue}
               style={tabStyle}>
          </div>
          <div id="ValueContainer">
            10
          </div>
        </div>
    );
}

class MultiTabWidget extends React.Component {
    constructor(props) {
        super(props);
        console.log("MTW props",props);
    };

    render() {
        const divStyle = {
            'height': '100' + 'px'
        };
        var tabs = [];

        if (this.props.opts.ToolOptions) {
          //bakkiraju: index shouldnt be used, this is for PoC only
            this.props.opts.ToolOptions.map((tabOpts,index) => {
                tabs.push(<TabWidget key={index} tabOpts={tabOpts}/>);
            });
        }

        return (
          <div>
            <div className="tab-group" style={divStyle}>
                {tabs}
            </div>
          </div>
        );
    }
}

class MultiScreenWidget extends React.Component {
    constructor(props) {
        super(props);
        console.log("MSW props",props);
    };

    render() {
        var tabs = [];

        if (this.props.opts.ToolOptions) {
          //bakkiraju: index shouldnt be used, this is for PoC only
          this.props.opts.ToolOptions.map((tabOpts,index) => {
              tabs.push(<SingleScreen key={index} tabOpts={tabOpts}/>);
          });
        }

        return (
          <div className="flipster">
              <ul>
                {tabs}
              </ul>
          </div>
        );
    }
}

class CircularWidget extends React.Component {
    constructor(props) {
        super(props);
        console.log("CW props",props);
    };

    render() {
        return (
          <div>
            <div id="ValueContainer">
                15
            </div>
          </div>
        );
    }
}


ipcRenderer.on('fade-out',(event, arg) =>{
  console.log("changing to fade-out css class");
  $("body").attr('class','app1');
  $("#scaffold").removeClass();
  var x = document.querySelector(".app1");
  x.addEventListener("animationend", (e)=>{
    remote.getCurrentWindow().hide();
  }, false);
});

ipcRenderer.on('update-scaffold', (event, arg) => {
    const widgetStyle = remote.getCurrentWindow().renderopts.RenderStyle;
    if ( widgetStyle === "Circular") {
      $("body").removeClass('app');
      console.log(new Date().toUTCString(),"Setting to circular class");
      $("#scaffold").attr('class','circle');
      ReactDom.render(
          <CircularWidget opts={remote.getCurrentWindow().renderopts}/>,
          root);
    } else if (widgetStyle === "MultiScreen") {
      console.log(new Date().toUTCString(),"Setting to Multi Screen class");
      // $("body").attr('class','app');
      // ReactDom.render(
      //     <MultiScreenWidget opts={remote.getCurrentWindow().renderopts}/>,
      //     root);
      //
      // $('.flipster').flipster({
      //           style: 'carousel'
      //  });
    } else {
      console.log(new Date().toUTCString(),"Setting to normal class");
      $("body").attr('class','app');
      $("#scaffold").removeClass();
      ReactDom.render(
          <MultiTabWidget opts={remote.getCurrentWindow().renderopts}/>,
          root);
    }
})


ipcRenderer.on('trava-tap', (event, args)=> {
   console.log("trava-tap", args);
   var flipper = $("#scaffold").flipster('init');
   flipper.flipster('next');
})

ipcRenderer.on('update-overlay-value', (event, args)=> {
   console.log("update-overlay-value", args);
   var elem = $(".flipster__item--current").find("#val");
   elem.html(args.Value);
})

ipcRenderer.on('tapped', (event, arg) => {
    const widgetStyle = remote.getCurrentWindow().renderopts.RenderStyle;
    if (widgetStyle === "Circular") {
      $("body").removeClass('app');
      console.log(new Date().toUTCString(),"Setting to circular class");
      $("#scaffold").attr('class','circle');
      ReactDom.render(
          <CircularWidget opts={remote.getCurrentWindow().renderopts}/>,
          root);
    } else if (widgetStyle === "Multiscreen")
    {
      $("body").attr('class','app');
      ReactDom.render(
          <MultiScreenWidget opts={remote.getCurrentWindow().renderopts}/>,
          root);
    } else {
      console.log(new Date().toUTCString(),"Setting to normal class");
      $("body").attr('class','app');
      $("#scaffold").removeClass();
      ReactDom.render(
          <MultiTabWidget opts={remote.getCurrentWindow().renderopts}/>,
          root);
    }
})
