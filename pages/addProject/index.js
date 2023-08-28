import React, { Component } from 'react';
import config from '../../config/database'
import axios from 'axios'
import dynamic from "next/dynamic";
import { Message, Loader } from 'semantic-ui-react';
const Projects = dynamic(import("../../components/Projects/Projects"), {
    loading: () => <Loader active inline='centered'>Getting Events</Loader>
});
class addProject extends Component {
    state = {
        data: null,
        projects: [],
        submiting: false,
        err: false
    }
    static async getInitialProps(a) {
        if (!a.req) {
            let data = await axios.get(`${config.ROOT_URL}/addProject`, { withCredentials: true });
            return { user: data.data.user, college: data.data.college }
        }
        let { user, college } = a.req;
        return { ...a.query, user, college };

    }
    onCheckBoxChecked = (id) => {
        this.setState({
            projects: {
                ...this.state.projects,

            }
        })
    }
    async componentDidMount() {
        window.scrollTo(0, 0);
        try {
            let data = await axios.get(`${config.ROOT_URL}/getAllUserProjects`, { withCredentials: true })
            data = data.data.projectDetails;
            data = data.map(d => {
                return {
                    ...d,
                    selected: false
                }
            })
            this.setState({
                data: data
            })
        }
        catch (err) {
            alert(err);
        }

    }
    toggleCheckbox = (index) => {
        let data = this.state.data
        data[index].selected = !data[index].selected;
        this.setState({
            data
        })

    }
    addProjects = async () => {
        this.setState({
            submiting: true
        })
        let projects = [];
        this.state.data.forEach(data => {
            if (data.selected)
                projects.push(data)
        });
        try {
            let data = await axios.post(`${config.ROOT_URL}/addProjecttoCollege`, { projects })
            data = data.data;

            if (data.success) {this.props.alert.show('Added Successfully','success')
        }else{
            this.props.alert.show(data.error,'error')
        }

            this.setState({
                submiting: false,
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
    render() {
        return (
                <main>
                    {this.state.err ? <Message negative>
                        <Message.Header style={{ display: "fixed" }}>Error</Message.Header>
                        <p>{this.state.err}</p>
                    </Message> : null}

                    <Projects submiting={this.state.submiting} data={this.state.data} onSubmit={this.addProjects} toggleCheckbox={this.toggleCheckbox} />

                </main>
        );
    }
}
export default addProject;