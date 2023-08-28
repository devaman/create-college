import React, { Component } from 'react';
import config from '../../config/database'
import axios from 'axios'
import { Image, Segment } from 'semantic-ui-react';
class addProject extends Component {
    state = {
        data: null,
        projects: [],
        submiting: false,
        err: false
    }
    static async getInitialProps(a) {
        if (!a.req) {
            let data = await axios.get(`${config.ROOT_URL}/profile`, { withCredentials: true });
            return { user: data.data.user, college: data.data.college }
        }
        let { user, college } = a.req;
        return { ...a.query, user, college };

    }
    
    render() {
        return (
                <main style={{ margin: "10px 10%" }}>
                    <Image centered style={{ backgroundColor: "2px solid #fff !important", padding: "3px", boxShadow: "rgb(127, 127, 127) 1px 1px 4px" }} src={this.props.user.avtarUrl} size='medium' circular />
                    <Segment raised>
                        <div><b>Name</b>: {this.props.user.username}</div>
                        <div>
                            <b>College</b>: {this.props.user.college}<b />
                        </div>
                        <div>
                            <b>Email</b>: {this.props.user.email}<b />
                        </div>
                        <div>
                            <b>GithubProfile</b>: {this.props.user.gitUrl}<b />
                        </div>

                    </Segment>
                </main>

        );
    }
}
export default addProject;