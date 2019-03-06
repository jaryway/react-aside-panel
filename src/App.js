import React, { Component, createContext } from "react";
import { findDOMNode } from "react-dom";
import logo from "./logo.svg";
import AsidePanel from "./AsidePanel";
// import Dialog from "rc-dialog";
import RcDrawer from "rc-drawer";
import { Button, Drawer, Modal, ConfigProvider } from "antd";
import { withConfigConsumer } from "antd/es/config-provider";
// import "rc-dialog/assets/index.css";
// import "rc-drawer/assets/index.css";

import "antd/dist/antd.css";
import "./App.css";
// console.log("ConfigProvider",ConfigProvider.withConfigConsumer)
// const { withConfigConsumer } = ConfigProvider;

// console.log("Dialog", Dialog);
const getColor = () => Math.floor(Math.random() * 256).toString("16");

const defaultTheme = {
  background: "white",
  color: "black"
};
const fooTheme = {
  background: "red",
  color: `#${getColor()}${getColor()}${getColor()}`
};
const ThemeContext = React.createContext(defaultTheme);
const DrawerContext = React.createContext(null);

const Banner = ({ theme }) => {
  return (
    <div
    // style={{
    //   // background: "red",
    //   ...theme,
    //   position: "fixed",
    //   left: "50%",
    //   top: "50%",
    //   // bottom: 0,
    //   width: "800px",
    //   height: "800px",
    //   transform: "translateX(-50%) translateY(-50%)",
    //   borderRadius: "50%",
    //   zIndex: 90,
    //   fontSize: Math.random() * 64 + 12,
    //   textAlign: "center",
    //   lineHeight: "800px",
    //   verticalAlign: "middle"
    // }}
    >
      Hello Context
    </div>
  );
};

class Test extends React.PureComponent {
  render() {
    return (
      <DrawerContext.Consumer>
        {context => {
          // console.log(context);
          this.parentD = context;
          return (
            <DrawerContext.Provider value={this}>
              <button
                onClick={this.props.onClick}
                // onClick={() => {
                //   // console.log(this.parent);
                //   // console.log(this.state.theme);
                //   this.setState(state => ({
                //     theme: {
                //       ...defaultTheme,
                //       background: `#${getColor()}${getColor()}${getColor()}`
                //     }
                //   }));
                // }}
              >
                Toggle Theme
              </button>
              {this.props.children}
            </DrawerContext.Provider>
          );
        }}
      </DrawerContext.Consumer>
    );
  }
}
const TestWrap = withConfigConsumer({})(Test);

class App extends Component {
  state = { panelVisible: false, canAutoClose: true };
  elements = [];
  callback1 = () => {
    console.log("callback1");
  };

  _onShowPanel = () => {
    this.setState(prev => ({
      panelVisible: !prev.panelVisible,
      canAutoClose: true
    }));
  };

  _onShowPanel1 = () => {
    this.setState(prev => ({ panelVisible1: !prev.panelVisible1 }));
  };

  _onClick = () => {
    // e.preventDefault();
    // e.stopPropagation()
    console.log("_onClick ");
    this.setState(prev => ({ canAutoClose: !prev.canAutoClose }));
  };

  render() {
    const { panelVisible, panelVisible1, canAutoClose = true } = this.state;
    return (
      <div style={{ padding: 16 }}>
        <Button style={{ margin: 16 }} type="primary" onClick={this._onClick}>
          点击这里，Drawer 不会关闭
        </Button>
        {/* <Test onClick={this._onClick}>
          <Test>
            <Test />
          </Test>
        </Test> */}
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
        {/* <AsidePanel visible={true}/> */}
        {/* <RcDrawer
          prefixCls={"ant-drawer"}
          open={panelVisible}
          onMaskClick={this._onShowPanel}
        >
          老是卡死的开发了深刻拉下的课副科级啊看见道具卡法艰苦拉萨的发哈
        </RcDrawer> */}

        <AsidePanel
          visible={panelVisible}
          autoClose={true}
          onClose={this._onShowPanel}
          canAutoClose={canAutoClose}
          toggleAutoClose={this._onClick}

          // mask={false}
        >
          <AsidePanel
            unCloseElements={this}
            // prefixCls="ant-drawer"
            // ref={el => console.log("ref1111111111", el)}
            visible={panelVisible1}
            onClose={this._onShowPanel1}
          >
            fasd 显示2显示2显示2显示2
          </AsidePanel>
          <Button type="primary" onClick={this._onShowPanel1}>
            显示2
          </Button>
        </AsidePanel>

        {/* <Dialog
          title={"title"}
          prefixCls={"aside-panel"}
          onClose={this._onShowPanel}
          role="aside-panel"
          visible={panelVisible}
        >
          <p>first dialog</p>
        </Dialog> */}
        <Button type="primary" onClick={this._onShowPanel}>
          显示
        </Button>
        {/* <Modal
          title={"title"}
          // zIndex={10000}
          // prefixCls={"aside-panel"}
          onClose={this._onShowPanel}
          // role="aside-panel"
          visible={panelVisible}
        >
          <p>first dialog</p>
        </Modal> */}
      </div>
    );
  }
}

export default App;
