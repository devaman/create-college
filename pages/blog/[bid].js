import React, { Component } from 'react';
import axios from 'axios'
import config from '../../config/database'
import { Card } from 'semantic-ui-react';
import  moment from 'moment'
import Head from 'next/head';
import Link from 'next/link';
import { Viewer } from '../../components/Editor';
const calcRT = ev => {
    const wordsPerMinute = 200; // Average case.
    let result;
    
    let textLength = ev.split(" ").length; // Split by words
    if(textLength > 0){
      let value = Math.ceil(textLength / wordsPerMinute);
      result = `${value} min read`;
    }
    return result;
}
class addProject extends Component {
    state = {
        data: null,
        projects: [],
        submiting: false,
        err: false
    }
    static async getInitialProps(a) {
        try {



            if (!a.req) {


                let data = await axios.get(`${config.ROOT_URL}/blog/${a.query.bid}`);
                return { user: data.data.user, college: data.data.college, blog: data.data.blog }
            }

            let { user, college, blog } = a.req;
            return { ...a.query, user, college, blog };
        }
        catch (err) {
            throw (err);
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        if(window.twttr?true:false)
        twttr.widgets.load();
    }
    render() {
        return (
            <main id="blog-details-id">
                {this.props.blog ?
                    <Card className="blog-details" style={{ width: "100%" }}>
                        <Card.Content>
                            <Head>
                                <meta name="twitter:image" content={`https://img.devaman.dev/1/?title=${this.props.blog.title}&website=https://ismy.institute&back=0056cc&textFill=fefefe`} />
                                <meta property="og:image" content={`https://img.devaman.dev/1/?title=${this.props.blog.title}&website=https://ismy.institute&back=0056cc&textFill=fefefe`} />
                            </Head>
                            <Card.Header style={{ display: "flex", justifyContent: "space-between", fontSize: "3.25rem",padding:"10px" }}>{this.props.blog.title}</Card.Header>
                            <Card.Meta style={{ display: 'flex', alignItems: "center",padding:"10px",color:"#222" }}>
                                <img src={this.props.blog.author.avtarUrl} width="15" style={{ borderRadius: "50%", marginRight: "8px" }} /> <Link href="/[pid]" as={`/${this.props.blog.author.username}`}><a style={{marginRight:"5px",color:"#222"}} >{this.props.blog.author.username}</a></Link> / {moment(this.props.blog.createdOn).format('MMMM D, Y')} <p style={{color:"#666",margin:"0px 5px"}}>( {calcRT(this.props.blog.body)} )</p>
                                
                            </Card.Meta>
                            <Card.Description >
                                <Viewer  value={this.props.blog.body} />
                            </Card.Description>

                        </Card.Content>

                    </Card> : null}


            </main>

        );
    }
}
export default addProject;