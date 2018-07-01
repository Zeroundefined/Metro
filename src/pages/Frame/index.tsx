import * as React from 'react';
import { browserHistory, RouteComponentProps } from 'react-router';
import { Menu, Icon, Avatar, Popover } from 'antd';
import { env } from '../../utils/isLogin';
import './Frame.scss';
const MenuItemGroup = Menu.ItemGroup;

export default class Frame extends React.Component<RouteComponentProps<any, any>> {
  state = {
    types: {
      "/metaCenter": {title: '元数据中心', icon_type: 'database', title_icon: '../../img/icons-11.png'},
      "/reports": {title: '报表管理', icon_type: 'area-chart', title_icon: '../../img/icons-12.png'},
      "/logs": {title: '日志管理', icon_type: 'profile', title_icon: '../../img/icons-13.png'}
    }
  }

  componentWillMount() {
    if (!env.logStatus) {
      // browserHistory.push('/login');
    }
  }
  handleRouting = item => {
    // this.setState()
    browserHistory.push(item.key);
  }

  handleLogout = () => {
    browserHistory.push('/login');
  }

  renderAvatar = () => {
    return <div style={{width: 55, cursor: 'pointer'}} onClick={this.handleLogout}>
      <Icon type="logout"/>注销
    </div>
  }

  renderMenu = () => {
    let { types } = this.state;
    let typeList = Object.entries(types);
    let menus = [];
      typeList.map(type => {
        menus.push(<Menu.Item key={type[0]}><Icon type={types && type[1].icon_type} />{types && type[1].title}</Menu.Item>)
      })
    return menus;
  }

  render() {
    const {location:{pathname}} = this.props;
    const { types } = this.state;
    return <div className="frame">
      <Menu onClick={this.handleRouting} className="left-menu" selectedKeys={[pathname]}>
        <MenuItemGroup title={<><div className="frame-menu-icon"/>数据管理平台</>}>
          {this.renderMenu()}
        </MenuItemGroup>
      </Menu>
      <div className="content">
        <div className="header">
          <Popover placement="bottomRight" content={this.renderAvatar()}>
            <Avatar icon="user" style={{marginLeft: 'auto', marginRight: 20, float: 'right'}}/>
          </Popover>
        </div>
        <div className="container">
          <div className="container-title">
            {/* <div style={{background: !types[pathname] ? '' : `url(${types[pathname]['title_icon']})`}}></div> */}
            <img src={types[pathname].title_icon} alt=""/>
            <span className="container-title">{this.state.types[pathname] && this.state.types[pathname].title}</span>
          </div>
          {this.props.children}
        </div>
      </div>
    </div>
  }
}