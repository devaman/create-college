import React, { Component } from 'react';
import config from '../../config/database'
import axios from 'axios'
// import "../createEvent/style.scss"
import { Segment, Form, Button } from 'semantic-ui-react';
import Router from 'next/router';
import {Editor} from '../../components/Editor';

class WriteBlog extends Component {
    constructor() {
        super()
        this.state = {
            submiting: false,
            err: false,
            value: "",
            title: ""
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    async componentDidMount() {
        window.scrollTo(0, 0);
        
        if (this.props.blogId) {
            let data = await axios.get(`/getblog/${this.props.blogId}`)
            this.setState({
                title: data.data.blog.title,
                value: data.data.blog.body
            })
        }
    }
    static async getInitialProps(a) {
        if (!a.req) {
            
            let data = await axios.get(`${config.ROOT_URL}/writeBlog`, { withCredentials: true });
            return { user: data.data.user, college: data.data.college,blogId:a.query.blogId }
        }
        let { user, college,blogId } = a.req;
        return { ...a.query, user, college,blogId };

    }
    onSubmit = async () => {
        if (this.state.value === "" ||
            this.state.title === "") {
            return;
        }
        this.setState({
            submiting: true
        })
        try {
            if (this.props.blogId) {
                let data = await axios.post(`${config.ROOT_URL}/modifyBlog/${this.props.blogId}`, { title: this.state.title, body: this.state.value })
                data = data.data;
                this.props.alert.show('Added Successfully','success')
                Router.push('/?tab=blogs')
                this.setState({
                    submiting: false,
                    err: !data.success ? data.error : false
                })
            } else {
                let data = await axios.post(`${config.ROOT_URL}/saveBlog`, { title: this.state.title, body: this.state.value })
                data = data.data;
                this.props.alert.show('Added Successfully','success')
                // Router.push('/?tab=blogs')
                this.setState({
                    submiting: false,
                    err: !data.success ? data.error : false
                })
            }
        } catch (err) {
            this.props.alert.show(err.message,'error')

            this.setState({
                submiting: false,
            })
        }
        this.setState({
            submiting: false
        })

    }
    onMDEChange = (val) => {
        this.setState({
            value: val
        })
    }
    render() {
        return (
            <>
                <main className="write-create">
                    <Segment raised>
                        <Form>
                            <Form.Field>
                                <label>Title</label>
                                <input name="title" value={this.state.title} onChange={this.handleChange} placeholder='Title of Blog' />
                            </Form.Field>
                            <Form.Field>
                                <label>Body</label>
                            </Form.Field>
                        </Form>
                       
                        <Editor value={this.state.value} name="value" onChange={this.handleChange}/>
                        <Button disabled={(this.state.value === "" ||
                            this.state.title === "")} onClick={this.onSubmit} type='submit' loading={this.state.submiting} >Submit</Button>

                    </Segment>
                </main>

            </>
        );
    }
}
export default WriteBlog;