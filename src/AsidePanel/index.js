/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import ReactDOM, { findDOMNode } from "react-dom";
import classNames from "classnames";
import RcDrawer from "rc-drawer";
import { Icon } from "antd";
import { withConfigConsumer } from "antd/es/config-provider";

const DrawerContext = React.createContext(null);

class AsidePanel extends React.Component {
  static defaultProps = {
    width: 256,
    height: 256,
    closable: true,
    placement: "right",
    maskClosable: true,
    mask: true,
    level: null
  };

  state = {
    push: false
  };

  parentDrawer;
  destroyClose;

  componentDidUpdate(preProps) {
    if (preProps.visible !== this.props.visible && this.parentDrawer) {
      if (this.props.visible) {
        this.parentDrawer.push();
      } else {
        this.parentDrawer.pull();
      }
    }
  }

  close = e => {
    if (this.props.visible !== undefined) {
      if (this.props.onClose) {
        this.props.onClose(e);
      }
      return;
    }
  };

  onMaskClick = e => {
    if (!this.props.maskClosable) {
      return;
    }
    this.close(e);
  };

  push = () => {
    this.setState({
      push: true
    });
  };

  pull = () => {
    this.setState({
      push: false
    });
  };

  onDestroyTransitionEnd = () => {
    const isDestroyOnClose = this.getDestroyOnClose();
    if (!isDestroyOnClose) {
      return;
    }
    if (!this.props.visible) {
      this.destroyClose = true;
      this.forceUpdate();
    }
  };

  getDestroyOnClose = () => this.props.destroyOnClose && !this.props.visible;

  // get drawar push width or height
  getPushTransform = placement => {
    if (placement === "left" || placement === "right") {
      return `translateX(${placement === "left" ? 180 : -180}px)`;
    }
    if (placement === "top" || placement === "bottom") {
      return `translateY(${placement === "top" ? 180 : -180}px)`;
    }
  };

  getRcDrawerStyle = () => {
    const { zIndex, placement, style } = this.props;
    const { push } = this.state;
    return {
      zIndex,
      transform: push ? this.getPushTransform(placement) : undefined,
      ...style
    };
  };

  renderHeader() {
    const { title, prefixCls, closable } = this.props;
    if (!title && !closable) {
      return null;
    }

    const headerClassName = title
      ? `${prefixCls}-header`
      : `${prefixCls}-header-no-title`;
    return (
      <div className={headerClassName}>
        {title && <div className={`${prefixCls}-title`}>{title}</div>}
        {closable && this.renderCloseIcon()}
      </div>
    );
  }

  renderCloseIcon() {
    const { closable, prefixCls } = this.props;
    return (
      closable && (
        <button
          onClick={this.close}
          aria-label="Close"
          className={`${prefixCls}-close`}
        >
          <Icon type="close" />
        </button>
      )
    );
  }

  // render drawer body dom
  renderBody = () => {
    const { bodyStyle, placement, prefixCls, visible } = this.props;
    if (this.destroyClose && !visible) {
      return null;
    }
    this.destroyClose = false;

    const containerStyle =
      placement === "left" || placement === "right"
        ? {
            overflow: "auto",
            height: "100%"
          }
        : {};

    const isDestroyOnClose = this.getDestroyOnClose();

    if (isDestroyOnClose) {
      // Increase the opacity transition, delete children after closing.
      containerStyle.opacity = 0;
      containerStyle.transition = "opacity .3s";
    }

    return (
      <div
        className={`${prefixCls}-wrapper-body`}
        style={containerStyle}
        onTransitionEnd={this.onDestroyTransitionEnd}
      >
        {this.renderHeader()}
        <div className={`${prefixCls}-body`} style={bodyStyle}>
          {this.props.children}
        </div>
      </div>
    );
  };

  autoCloseHandler = e => {
    const { canAutoClose, onClose, toggleAutoClose } = this.props;
    // console.log("kthis", kthis.state);
    if (!canAutoClose) {
      toggleAutoClose && setTimeout(toggleAutoClose, 0);
      return false;
    }

    const is_ant_modal_or_ant_drawer = Array.from(
      document.querySelectorAll(".ant-drawer")
    ).some(item => item.contains(e.target));

    if (is_ant_modal_or_ant_drawer) return;

    onClose && onClose();

    console.log(
      "autoCloseHandler",
      e.target,
      this.contentWrapper,
      canAutoClose
    );
  };
  // render Provider for Multi-level drawe
  renderProvider = value => {
    const {
      prefixCls,
      zIndex,
      style,
      placement,
      className,
      wrapClassName,
      width,
      height,
      autoClose,
      ...rest
    } = this.props;
    // warning(
    //   wrapClassName === undefined,
    //   'Drawer',
    //   'wrapClassName is deprecated, please use className instead.',
    // );

    // console.log("visible", autoClose, this.props.visible);
    //
    autoClose &&
      (this.props.visible
        ? document.addEventListener("click", this.autoCloseHandler)
        : document.removeEventListener("click", this.autoCloseHandler));

    // !rest.mask && rest.visible
    //   ? document.addEventListener("click", this.autoCloseHandler, true)
    //   : document.removeEventListener("click", this.autoCloseHandler);

    const showMask = autoClose ? false : rest.mask;

    const haveMask = showMask ? "" : "no-mask";
    this.parentDrawer = value;
    const offsetStyle = {};
    if (placement === "left" || placement === "right") {
      offsetStyle.width = width;
    } else {
      offsetStyle.height = height;
    }
    return (
      <DrawerContext.Provider value={this}>
        <RcDrawer
          handler={false}
          ref={el => {
            // console.log("elelelel", el.contentWrapper);
            el &&
              el.contentWrapper &&
              (this.contentWrapper = el.contentWrapper);
          }}
          {...rest}
          {...offsetStyle}
          prefixCls={prefixCls}
          open={this.props.visible}
          onMaskClick={this.onMaskClick}
          showMask={showMask}
          placement={placement}
          style={this.getRcDrawerStyle()}
          className={classNames(wrapClassName, className, haveMask)}
        >
          {this.renderBody()}
        </RcDrawer>
      </DrawerContext.Provider>
    );
  };

  render() {
    return (
      <DrawerContext.Consumer>{this.renderProvider}</DrawerContext.Consumer>
    );
  }
}

// export default AsidePanel;

export default withConfigConsumer({
  prefixCls: "drawer"
})(AsidePanel);
