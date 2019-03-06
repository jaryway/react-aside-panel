/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import ReactDOM, { findDOMNode } from "react-dom";
// import PropTypes from 'prop-types';
import { Button, Icon } from "antd";
import classNames from "classnames";
import ContainerRender from "rc-util/lib/ContainerRender";
import Portal from "rc-util/lib/Portal";
import styles from "./style";

const IS_REACT_16 = "createPortal" in ReactDOM;

// 判断 parent 中是否包含 node 对象
// const contains = document.documentElement.contains
//     ? (parent, node) => (parent !== node && parent.contains(node))
//     : (parent, node) => {
//         while (node && (node = node.parentNode))
//             if (node === parent) return true
//         return false
//     }

const getZIndex = element => {
  let zIndex = 0;
  if (window.getComputedStyle) {
    zIndex = window.getComputedStyle(element, null).getPropertyValue("z-index");
  }
  if (element && element.currentStyle)
    zIndex = element.currentStyle.getAttribute("zIndex");

  return zIndex ? (zIndex === "auto" ? 0 : zIndex) : 0;
};

class AsidePanel extends React.PureComponent {
  // duration = 300;// 动画时间，单位ms

  state = {
    show: false
  };

  componentWillMount() {
    const { visible = true, duration = 300 } = this.props;
    // console.log("componentWillMount");
    const { show } = this.state;
    visible !== show && this._onVisibleChange(visible, duration);
  }

  componentWillReceiveProps(nextProps) {
    const { visible = true, duration = 300 } = nextProps;
    const { visible: _visible = true } = this.props;
    // console.log('componentWillReceiveProps');
    visible !== _visible && this._onVisibleChange(visible, duration);
  }
  componentWillUnmount() {
    document.removeEventListener("click", this.autoCloseHandler);
  }

  _onVisibleChange = (visible, duration = 300) => {
    // 可见的时候才监听事件
    visible
      ? document.addEventListener("click", this.autoCloseHandler)
      : document.removeEventListener("click", this.autoCloseHandler);

    setTimeout(
      () => {
        this.setState({ show: visible });
      },
      visible ? 0 : duration
    );
  };

  // 点击外部自动关闭事件句柄
  autoCloseHandler = ({ clientX, clientY, target }) => {
    const { onClose } = this.props;
    if (!findDOMNode(this)) {
      onClose && onClose();
      return;
    }
    // const $this = findDOMNode(this);
    const $content = findDOMNode(this).querySelector(".asidepanel-ct");
    const {
      left: minX,
      top: minY,
      width,
      height
    } = $content.getBoundingClientRect();
    const maxX = minX + width;
    const maxY = minY + height;
    // 通过点击的坐标位置判断是否是在面板外点击。在某些情况下clientX和clientY会为0，需要判断clientX && clientY排除这种情况
    const click_is_outside_panel =
      clientX &&
      clientY &&
      (clientX < minX || clientX > maxX || clientY < minY || clientY > maxY);

    // 检查target元素是否在antd的modal组件里
    const isAntdModal = Array.from(
      document.querySelectorAll(".ant-modal-wrap")
    ).some(item => item.contains(target));

    // 判断是否是modal元素
    const is_modal_element = getZIndex(target) > 0 || isAntdModal;

    // console.log('autoCloseHandler', e, target, is_modal_element, click_is_outside_panel)
    /*
        通过 contains 这种方式，当面板中有modal窗时将失效；
        判断是否是在面板外点击，
        这里有个问题，如果 click 的时候，元素刚好被移除了，此时无论在哪里点击，contains($this, e.target) 都会返回 false
        所以要先判断 target 是不是还在 document 中。
        */
    // const click_is_outside_panel = ($this !== e.target && contains(document, e.target) && !contains($this, e.target));
    // 在面板外点击，不是 modal 弹窗
    click_is_outside_panel && !is_modal_element && onClose && onClose();
    // console.log(clientX , clientY,is_modal_element);
  };

  getComponent = (extra = {}) => {
    return (
      <div
        // ref={this.saveDialog}
        {...this.props}
        // {...extra}
        // key="dialog"
      >
        {" "}
        看得开三个 的发光时代{" "}
      </div>
    );
  };

  getContainer = () => {
    const container = document.createElement('div');
    if (this.props.getContainer) {
      this.props.getContainer().appendChild(container);
    } else {
      document.body.appendChild(container);
    }
    return container;
  }

  render() {
    const { visible, forceRender } = this.props;

    let portal: any = null;

    if (!IS_REACT_16) {
      return (
        <ContainerRender
          parent={this}
          visible={visible}
          autoDestroy={false}
          getComponent={this.getComponent}
          getContainer={this.getContainer}
          forceRender={forceRender}
        >
          {({
            renderComponent,
            removeContainer
          }: {
            renderComponent: any,
            removeContainer: any
          }) => {
            this.renderComponent = renderComponent;
            this.removeContainer = removeContainer;
            return null;
          }}
        </ContainerRender>
      );
    }

    if (visible || forceRender || this._component) {
      portal = (
        <Portal getContainer={this.getContainer}>{this.getComponent()}</Portal>
      );
    }

    return portal;
  }

  // render() {
  //   const {
  //     onOk,
  //     onClose,
  //     onCancel,

  //     title,
  //     visible = true,
  //     showMask = true, // 是否显示Mask背景层
  //     maskOpacity = null,
  //     maskClosable = false, // 点击背景层是否关闭

  //     okText = "确定",
  //     cancelText = "取消",

  //     footer = null,
  //     className,
  //     children,

  //     ...other
  //   } = this.props;

  //   const { show = false } = this.state;

  //   if (!show) return null;

  //   const bodyClassName = classNames(styles["asidepanel-ct"], "asidepanel-ct", styles.fixed, className, {
  //     hide: !visible
  //   });
  //   const innerClassName = classNames(styles["asidepanel-bd"], "bg-white", { [styles["no-footer"]]: !footer });
  //   const maskStyle = maskOpacity !== null ? { backgroundColor: "rgba(0, 0, 0, " + maskOpacity + ")" } : {};

  //   return (
  //     <div className={classNames(styles["asidepanel-wrap"])}>
  //       {showMask ? (
  //         <div className={styles["asidepanel-mask"]} style={maskStyle} onClick={maskClosable ? onClose : undefined} />
  //       ) : null}
  //       <div className={bodyClassName} {...other}>
  //         <div className={styles["asidepanel-hd"]}>
  //           <span className={styles["text"]}>{title}</span>
  //           <a href="javascript:;" className={styles.close} onClick={onClose}>
  //             <Icon type="close" style={{ fontSize: 24 }} />
  //           </a>
  //         </div>
  //         <div className={innerClassName}>{children}</div>
  //         <div className={styles["asidepanel-ft"]}>
  //           {footer
  //             ? footer
  //             : [
  //                 <Button key="k1" type="primary" onClick={onOk}>
  //                   {okText}
  //                 </Button>,
  //                 <Button key="k2" type="default" onClick={onCancel}>
  //                   {cancelText}
  //                 </Button>
  //               ]}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
}

export default AsidePanel;

/*
export default function AsidePanel({
    // title = '',
    // showMask = true, // 是否显示Mask背景层
    // maskClosable = false, // 点击背景层是否关闭



    ...props
}) {
    let _footer = (
        <div className={styles["asidepanel-ft"]}>
            <Button type="primary" onClick={onOk}>{okText}</Button>
            <Button type="default" onClick={onCancel}>{cancelText}</Button>
        </div>
    );

    if (footer && footer.length >= 0) {
        if (footer.length == 0) {
            _footer = null;
        } else {
            _footer = (
                <div className={styles["asidepanel-ft"]}>
                    {footer}
                </div>
            );
        }
    }



    return (
        <div className={classNames(styles["asidepanel-wrap"])} >
            {showMask ? <div className={styles["asidepanel-mask"]} style={maskStyle} onClick={maskClosable ? onClose : undefined}></div> : null}
            <div className={bodyClassName} {...other}>
                <div className={styles["asidepanel-hd"]}>
                    <span className={styles["text"]}>{title}</span>
                    <a href="javascript:;" className={styles.close} onClick={onClose}><Icon type="close" style={{ fontSize: 24 }} /></a>
                </div>
                <div className={innerClassName}>
                    {props.children}
                </div>
                {_footer}
            </div>
        </div>
    );
}
*/
