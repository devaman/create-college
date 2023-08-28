import React, { Component } from 'react';
import AlertComp from '../../components/Alert/Alert'
import Head from 'next/head';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar';
import NProgress from 'nprogress'
import Router from 'next/router'
import ReactGA from 'react-ga';
ReactGA.initialize('UA-99907893-5');
Router.events.on('routeChangeStart', url => {
  NProgress.start()
  NProgress.set(0.2)
})
Router.events.on('routeChangeComplete', (url) => {
  NProgress.done()
  ReactGA.pageview(window.location.href);
})
Router.events.on('routeChangeError', () => NProgress.done())


class Layout extends Component {
  state = {
    alerts: [],
    dark: false,
    visible: false
  }
  toggleCheck = () => {

    this.setState(prev => ({ dark: !prev.dark }), () => {

      localStorage.setItem('theme-dark', this.state.dark);
    })
  }
  componentDidMount() {
    if (this.props.user) {
      ReactGA.set({ userId: this.props.user.username })
    }
    this.setState({
      dark: localStorage.getItem('theme-dark') === 'true',
      visible: true
    })
  }
  render() {
    let classess = 'theme-light';
    if (this.state.dark) {
      classess = 'theme-dark';
    }
    const alert = {
      show: (message, type) => {
        if (type === 'error') {
          ReactGA.exception({
            description: 'An error ocurred' + message,
            fatal: true
          });
        }
        let key = Math.floor(Math.random() * 100000)
        this.setState({ alerts: [<AlertComp message={message} key={key} type={type || 'info'} />, ...alerts] }, () => {
          setTimeout(() => {

            if (this.state.alerts.length > 0) {
              let a = [...this.state.alerts];
              a.splice(-1, 1)
              this.setState({ alerts: a });
            }
          }, 5000);

        })
      }
    }
    const alerts = this.state.alerts;
    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        alert: alert
      });
    });
    if (!this.props.college) {
      return <div className={classess} style={!this.state.visible ? { visibility: "hidden" } : { visibility: "visible" }}>
        <Head>
          <title>College Page Not found</title>
          <meta name="description" content={`Create your College page today`} />
          <meta itemProp="name" content={`Create your College page today`} />
          <meta itemProp="description" content={`Create your College page today`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`Create your College page today`} />
          <meta name="twitter:description" content={`Create your College page today`} />
          <meta name="og:title" content={`Create your College page today`} />
          <meta name="og:description" content={`Create your College page today`} />
          <meta name="og:url" content={`https://ismy.institute`} />
          <meta name="og:site_name" content={`Create your College page today`} />
          <meta name="og:type" content="website" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>

        <Navbar toggle={this.toggleCheck} toggleState={this.state.dark} {...this.props} />
        <div className="alert-message-box">{alerts}</div>
        {children}
        <Footer />
      </div>

    }
    if (this.props.blog) {
      return (
        <div className={classess} style={!this.state.visible?{visibility:"hidden"}:{visibility:"visible"}}>
          <Head>
            <title>{this.props.blog.title}</title>
            <meta name="description" content={`by ${this.props.blog.author.username} See ${this.props.college.name} college page`} />
            <meta itemProp="name" content={`${this.props.blog.title} `} />
            <meta itemProp="description" content={`by ${this.props.blog.author.username} See ${this.props.college.name} college page`} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${this.props.blog.title}`} />
            <meta name="twitter:description" content={`by ${this.props.blog.author.username} See ${this.props.college.name} college page`} />
            <meta name="og:title" content={`${this.props.blog.title}`} />
            <meta name="og:description" content={`by ${this.props.blog.author.username} See ${this.props.college.name} college page`} />
            <meta name="og:url" content={`https://${this.props.college.name}.ismy.institute`} />
            <meta name="og:site_name" content={`${this.props.college.name}.ismy.institute`} />
            <meta name="og:type" content="website" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
          </Head>

          <Navbar toggle={this.toggleCheck} toggleState={this.state.dark} {...this.props} />
          <div className="alert-message-box">{alerts}</div>
          {children}
          <Footer />
        </div>
      )
    }
    if (this.props.event) {
      return (
        <div className={classess} style={!this.state.visible?{visibility:"hidden"}:{visibility:"visible"}}>
          <Head>
            <title>{this.props.event.title}</title>
            <meta name="description" content={`by ${this.props.event.organizer.username} See ${this.props.college.name} college page`} />
            <meta itemProp="name" content={`${this.props.event.title} `} />
            <meta itemProp="description" content={`by ${this.props.event.organizer.username} See ${this.props.college.name} college page`} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${this.props.event.title}`} />
            <meta name="twitter:description" content={`by ${this.props.event.organizer.username} See ${this.props.college.name} college page`} />
            <meta name="og:title" content={`${this.props.event.title}`} />
            <meta name="og:description" content={`by ${this.props.event.organizer.username} See ${this.props.college.name} college page`} />
            <meta name="og:url" content={`https://${this.props.college.name}.ismy.institute`} />
            <meta name="og:site_name" content={`${this.props.college.name}.ismy.institute`} />
            <meta name="og:type" content="website" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
          </Head>

          <Navbar toggle={this.toggleCheck} toggleState={this.state.dark} {...this.props} />
          <div className="alert-message-box">{alerts}</div>
          {children}
          <Footer />
        </div>
      )
    }
    return (
      <div className={classess} style={!this.state.visible?{visibility:"hidden"}:{visibility:"visible"}}>
        <Head>
          <title>{this.props.college.name}.ismy.institute</title>
          <meta name="description" content={`See ${this.props.college.name} college page`} />
          <meta itemProp="name" content={`${this.props.college.name}.ismy.institute`} />
          <meta itemProp="description" content={`See ${this.props.college.name} college page`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={`https://img.devaman.dev/2/?title=Welcome%20To%20ismy.institute%20&website=${this.props.college.name}.ismy.institute&back=fff&textFill=ff0263`} />
          <meta property="og:image" content={`https://img.devaman.dev/2/?title=Welcome%20To%20ismy.institute%20&website=${this.props.college.name}.ismy.institute&back=fff&textFill=ff0263`} />
          <meta name="twitter:title" content={`${this.props.college.name}.ismy.institute`} />
          <meta name="twitter:description" content={`See ${this.props.college.name} college page`} />
          <meta name="og:title" content={`${this.props.college.name}.ismy.institute`} />
          <meta name="og:description" content={`See ${this.props.college.name} college page`} />
          <meta name="og:url" content={`https://${this.props.college.name}.ismy.institute`} />
          <meta name="og:site_name" content={`${this.props.college.name}.ismy.institute`} />
          <meta name="og:type" content="website" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>

        <Navbar toggle={this.toggleCheck} toggleState={this.state.dark} {...this.props} />
        <div className="alert-message-box">{alerts}</div>
        {children}
        <Footer />
      </div>
    )
  }
}
export default Layout;