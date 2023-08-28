import React from 'react'
import App from 'next/app'
import Layout from '../components/Layout/Layout'
import "react-datepicker/dist/react-datepicker.css";
import 'semantic-ui-css/components/dropdown.min.css'
import 'semantic-ui-css/components/button.min.css'
import 'semantic-ui-css/components/tab.min.css'
import 'semantic-ui-css/components/menu.min.css'
import 'semantic-ui-css/components/divider.min.css'
import 'semantic-ui-css/components/statistic.min.css'
import 'semantic-ui-css/components/segment.min.css'
import 'semantic-ui-css/components/container.min.css'
import 'semantic-ui-css/components/card.min.css'
import 'semantic-ui-css/components/site.min.css'
import 'semantic-ui-css/components/label.min.css'
import 'semantic-ui-css/components/loader.min.css'
import 'semantic-ui-css/components/image.min.css'
import 'semantic-ui-css/components/checkbox.min.css'
import 'semantic-ui-css/components/grid.min.css'
import 'semantic-ui-css/components/icon.min.css'
import 'semantic-ui-css/components/form.min.css'
import 'semantic-ui-css/components/transition.min.css'
import 'semantic-ui-css/components/table.min.css'
import 'semantic-ui-css/components/modal.min.css'
import 'semantic-ui-css/components/dimmer.min.css'
import 'semantic-ui-css/components/message.min.css'
import './style.scss'
class MyApp extends App {
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    document.body.appendChild(script);
    // if (!window.resizeIframe)
    //   window.resizeIframe = function (iframe) {

    //     console.log("resized");
    //     var body = iframe.contentWindow.document.body,
    //       html = iframe.contentWindow.document.documentElement;

    //     var height = Math.max(body.scrollHeight, body.offsetHeight,
    //       html.clientHeight, html.scrollHeight, html.offsetHeight);
    //     console.log(height);
    //     iframe.height = height + "px";
    //   }
  }
  render() {
    const { Component, pageProps, router } = this.props

    const getLayout =
      Component.getLayout || (page => <Layout children={page} {...pageProps}{...router} />)

    return getLayout(<Component {...pageProps} />)
  }
}

export default MyApp
