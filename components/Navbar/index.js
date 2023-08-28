import React, { Component } from 'react';
import { Menu, Icon, Dropdown, Checkbox } from 'semantic-ui-react'
// import './style.scss'
import Router from 'next/router'
let route = {
  "Add Project": '/addProject',
  "home": '/',
  'profile': '/profile',
  'create': '/createPage',
  'admin': '/admin'
}
let paths = {
  '/addProject': 'Add Project',
  '/': 'home',
  '/profile': "profile",
  '/createPage': "create",
  '/admin': 'admin'
}
class Navbar extends Component {
  state = { activeItem: paths[this.props.pathname], open: false }

  handleItemClick = (e, { name }) => {
    if (name === 'profile') {
      Router.push('/[pid]', `/${this.props.user.username}`)
    } else
      Router.push({
        pathname: route[name]
      })
    this.setState({ activeItem: name })
  }
  handleBarsClick = (e) => this.setState(prevState => ({ open: !prevState.open }))
  onLogout = () => {
    window.location = '/logout'
  }
  onLogin = () => {
    window.location = `/auth?redirect=${window.location.href}`
  }
  render() {
    const { activeItem } = this.state
    let respNav;
    if (this.state.open) {
      respNav = "nav-open"
    }
    else {
      respNav = "nav-close"
    }
    return (
      <nav>
        <Menu pointing className={respNav} stackable secondary style={{ padding: "10px" }}>
          <div style={{ display: 'flex', flexShrink: '0', justifyContent: 'space-between' }}>
            <h1 onClick={() => Router.push('/')} className="logo">ismy.institute</h1>
            <Icon name="bars" className="nav-bars" onClick={this.handleBarsClick} />

          </div>
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={this.handleItemClick}
          />
          {this.props.user ? <>
            <Menu.Item
              name='Add Project'
              active={activeItem === 'Add Project'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='profile'
              active={activeItem === 'profile'}
              onClick={this.handleItemClick}
            />
            <Dropdown style={{ position: "relative" }} icon="add" pointing className='link item'>
              <Dropdown.Menu style={{ position: "absolute", zIndex: "10" }}>
                <Dropdown.Header>Create</Dropdown.Header>
                <Dropdown.Item onClick={() => Router.push({ pathname: "/createPage" })}>Page</Dropdown.Item>
                <Dropdown.Item onClick={() => Router.push({ pathname: "/createEvent" })}>Event</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Write</Dropdown.Header>
                <Dropdown.Item onClick={() => Router.push({ pathname: "/writeBlog" })}>Blog</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {this.props.user.isAdmin === 1 ?
              <Menu.Item
                name='admin'
                active={activeItem === 'admin'}
                onClick={this.handleItemClick}
              /> : null}
          </> : null}
          <Menu.Menu position='right'>
            <div style={{ display: 'flex', alignItems: 'center' }} >
              <Icon name="moon" style={{ height: '18px' }} />
              <Checkbox toggle checked={this.props.toggleState ? 'checked' : ''} onChange={this.props.toggle} />
            </div>
            {this.props.user ?
              <Menu.Item
                name='logout'
                active={activeItem === 'logout'}
                onClick={this.onLogout}
              /> : <Menu.Item
                name='Login'
                active={activeItem === 'logout'}
                onClick={this.onLogin}
              />}
          </Menu.Menu>
        </Menu>

      </nav>
    );
  }
}
export default Navbar;