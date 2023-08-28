import React, { Component } from 'react';
import config from '../../config/database'
import axios from 'axios'
import collegeOptions from '../../config/collegeOptions'
import { Segment, Form, Button } from 'semantic-ui-react';
import Router from 'next/router';
class addProject extends Component {
    state = {
        sub: this.props.user.college,
        name: collegeOptions.keys[this.props.user.college]?collegeOptions.keys[this.props.user.college].text:"",
        description: "",
        logo: "",
        submiting: false,
        err: false
    }
    static async getInitialProps(a) {
        if (!a.req) {
            let data = await axios.get(`${config.ROOT_URL}/createPage`, { withCredentials: true });
            return { user: data.data.user, college: data.data.college }
        }
        let { user, college } = a.req;
        return { ...a.query, user, college };

    }
    onSubmit = async () => {
        if (this.state.sub === "" ||
            this.state.name === "" ||
            this.state.description === "" ||
            this.state.logo === "") {
            return;
        }
        this.setState({
            submiting: true
        })
        try {
            let data = await axios.post(`${config.ROOT_URL}/createCollege`, { collegeName: this.state.sub, collegeDetails: this.state.description, collegeFullname: this.state.name, logo: this.state.logo })
            data = data.data;
            if (process.env.NODE_ENV === 'production'){
                this.props.alert.show('Added Successfully','success')
                Router.push(`/`)}
            else {
                this.props.alert.show('Added Successfully','success')
                Router.push(`/`)
            }
            this.setState({
                submiting: false,
                err: !data.success ? data.error : false
            })
        } catch (err) {


            this.setState({
                submiting: false,
                err: err.message
            })
        }
        this.setState({
            submiting: false
        })

    }
    nulltheError = () => {
        setTimeout(() => {
            this.setState({
                err: false
            })
        }, 4000)
    }

    componentDidMount() {
        window.scrollTo(0, 0);

    }
    render() {
        
        return (
            <main style={{ margin: "10px 10%" }}>
                <Segment raised>
                    <Form>
                        <Form.Field>
                            <label>subdomain</label>
                            <input disabled={this.props.user.username!=="devaman"} readOnly={this.props.user.username!=="devaman"} required placeholder='nith' value={this.state.sub} onChange={(e) => this.setState({ [e.target.name]: e.target.value })} name="sub" />
                        </Form.Field>
                        <Form.Field>
                            <label>College Full Name</label>
                            <input required placeholder='National Institute of Technology Hamirpur' value={this.state.name} name="name" onChange={(e) => this.setState({ [e.target.name]: e.target.value })} />
                        </Form.Field>
                        <Form.Field>
                            <label>Logo</label>
                            <input required placeholder='https://....' value={this.state.logo} name="logo" onChange={(e) => this.setState({ [e.target.name]: e.target.value })} />
                        </Form.Field>
                        <Form.TextArea label='Description' placeholder='Tell us more about you...' value={this.state.description} name="description" onChange={(e) => this.setState({ [e.target.name]: e.target.value })} />
                        <Button type='submit' loading={this.state.submiting} disabled={(this.state.sub === "" ||
                            this.state.name === "" ||
                            this.state.description === "" ||
                            this.state.logo === "")} onClick={this.onSubmit}>Submit</Button>
                    </Form>

                </Segment>
            </main>

        );
    }
}
export default addProject;