import React, { Component } from "react";
// import { findDOMNode } from "react-dom";
import logo from "./logo.svg";
import AsidePanel from "./AsidePanel";
// import Dialog from "rc-dialog";
// import RcDrawer from "rc-drawer";
import { Button, Modal } from "antd";
// import { withConfigConsumer } from "antd/es/config-provider";

import "./App.css";

const getColor = () => Math.floor(Math.random() * 256).toString("16");

class App extends Component {
  state = { modalVisible: false, panelVisible: false, canAutoClose: true };
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
  _onShowModal = () => {
    this.setState(prev => ({ modalVisible: !prev.modalVisible }));
  };
  _onClick = () => {
    this.setState(prev => ({ canAutoClose: !prev.canAutoClose }));
  };

  render() {
    const {
      panelVisible,
      panelVisible1,
      modalVisible,
      canAutoClose
    } = this.state;

    return (
      <div style={{ padding: 16 }}>
        <Button
          style={{ marginRight: 16 }}
          type="primary"
          onClick={this._onClick}
        >
          点击这里，Drawer 不会关闭
        </Button>
        <Button type="primary" onClick={this._onShowPanel}>
          Open Drawer1
        </Button>

        {/* {gggg()(<Button />)} */}

        <AsidePanel
          visible={panelVisible}
          autoClose={true}
          onClose={this._onShowPanel}
          canAutoClose={canAutoClose}
          toggleAutoClose={this._onClick}
          width="60%"
        >
          <Button
            type="primary"
            style={{ marginRight: 16 }}
            onClick={this._onShowModal}
          >
            Show Modal
          </Button>
          <Button type="primary" onClick={this._onShowPanel1}>
            Open Drawer2
          </Button>

          <AsidePanel visible={panelVisible1} onClose={this._onShowPanel1} />
        </AsidePanel>

        <Modal
          title={"title"}
          onCancel={this._onShowModal}
          visible={modalVisible}
        >
          <p>first dialog</p>
        </Modal>
      </div>
    );
  }
}

export default App;
