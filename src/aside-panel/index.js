/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import RcDrawer from "rc-drawer";
import { Icon } from "antd";
import { withConfigConsumer } from "antd/es/config-provider";
import warning from "antd/es/_util/warning";
import "antd/es/drawer/style";

const DrawerContext = React.createContext(null);

class AsidePanel extends React.Component {
  static propTypes = {
    // 是否显示右上角的关闭按钮
    closable: PropTypes.bool,
    // 关闭时销毁 Drawer 里的子元素
    destroyOnClose: PropTypes.bool,
    // 指定 Drawer 挂载的 HTML 节点
    getContainer: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.func,
      PropTypes.bool
    ]),
    // 点击蒙层是否允许关闭
    maskClosable: PropTypes.bool,
    // 是否展示遮罩
    mask: PropTypes.bool,
    // 遮罩样式
    maskStyle: PropTypes.object,
    // 可用于设置 Drawer 最外层容器的样式
    style: PropTypes.object,
    // 标题
    title: PropTypes.node,
    // Drawer 是否可见
    visible: PropTypes.bool,
    // 宽度
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // 高度, 在 placement 为 top 或 bottom 时使用
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // 设置 Drawer 的 z-index
    zIndex: PropTypes.number,
    // prefixCls: PropTypes.string,
    // 抽屉的方向	'top' | 'right' | 'bottom' | 'left'
    placement: PropTypes.oneOf(["top", "right", "bottom", "left"]),
    // 点击遮罩层或右上角叉或取消按钮的回调
    onClose: PropTypes.func,
    // 对话框外层容器的类名
    className: PropTypes.string,
    level: PropTypes.any
  };

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
      // return;
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

  autoCloseHandler = ({ clientX, clientY, target }) => {
    const { canAutoClose, onClose, toggleAutoClose } = this.props;
    // console.log("autoCloseHandler",canAutoClose, onClose, toggleAutoClose);
    // console.time(1);
    // 如果 canAutoClose 为 false 记得切换回来
    if (!canAutoClose) {
      toggleAutoClose && setTimeout(toggleAutoClose, 0);
      // console.timeEnd(1);
      return false;
    }

    // 点击后有可能 点击的元素不在了，此时 是返回false
    const target_is_modal_or_drawer = Array.from(
      document.querySelectorAll(".ant-modal-wrap,.ant-drawer")
    ).some(item => item.contains(target));
    // console.timeEnd(1);
    // 如果点击的目标是 modal 或是 drawer 不关闭 drawer
    if (target_is_modal_or_drawer) return false;

    let click_is_outside_panel = true;

    const $contentWrapper = findDOMNode(this.contentWrapper);
    if ($contentWrapper) {
      // const $content = $container.querySelector(".ant-drawer-content-wrapper");
      const { left: minX, top: minY, width, height } = $contentWrapper.getBoundingClientRect();
      const maxX = minX + width;
      const maxY = minY + height;
      // 通过点击的坐标位置判断是否是在面板外点击。在某些情况下clientX和clientY会为0，需要判断clientX && clientY排除这种情况
      click_is_outside_panel =
        clientX &&
        clientY &&
        (clientX < minX || clientX > maxX || clientY < minY || clientY > maxY);
    }
    // console.timeEnd(1);
    click_is_outside_panel && onClose && onClose();
  };

  renderHeader() {
    const { title, prefixCls, closable } = this.props;
    if (!title && !closable) {
      return null;
    }

    const headerClassName = title ? `${prefixCls}-header` : `${prefixCls}-header-no-title`;
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
          type="button"
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
    warning(
      wrapClassName === undefined,
      "Drawer",
      "wrapClassName is deprecated, please use className instead."
    );

    //
    autoClose &&
      (this.props.visible
        ? document.addEventListener("click", this.autoCloseHandler)
        : document.removeEventListener("click", this.autoCloseHandler));

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
            if (el && el.container) {
              this.container = el.container;
              this.contentWrapper = el.contentWrapper;
            }
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
    // 这样 parentDrawer 在二级 drawer 中才能获取到值
    return <DrawerContext.Consumer>{this.renderProvider}</DrawerContext.Consumer>;
  }
}

export default withConfigConsumer({
  prefixCls: "drawer"
})(AsidePanel);
