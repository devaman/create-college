import React, { Component } from 'react';
import config from '../../config/database'
import axios from 'axios'
import DatePicker from 'react-datepicker'
// import './style.scss'
import moment from 'moment'
import { Segment, Form, Button } from 'semantic-ui-react';
import Router from 'next/router';
import { Editor } from '../../components/Editor';
class addProject extends Component {
    state = {
        dateTimeS: '',
        dateTimeE: '',
        location: "",
        description: "",
        title: "",
        submiting: false,
        err: false
    }
    async componentDidMount() {
        window.scrollTo(0, 0);
        if (this.props.eventId) {
            let data = await axios.get(`/getEvent/${this.props.eventId}`)

            this.setState({
                dateTimeS: moment(data.data.event.startDate).toDate(),
                dateTimeE: moment(data.data.event.endDate).toDate(),
                location: data.data.event.location,
                description: data.data.event.description,
                title: data.data.event.title
            })
        }
    }
    static async getInitialProps(a) {
        if (!a.req) {
            let data = await axios.get(`${config.ROOT_URL}/createEvent`, { withCredentials: true });
            return { user: data.data.user, college: data.data.college, eventId: a.query.eventId }
        }
        let { user, college, eventId } = a.req;
        return { ...a.query, user, college, eventId };

    }
    onSubmit = async () => {
        if (this.state.dateTimeS === '' ||
            this.state.dateTimeE === '' ||
            this.state.location === "" ||
            this.state.description === "" ||
            this.state.title === "") {
            return;
        }
        this.setState({
            submiting: true
        })
        try {
            if (this.props.eventId) {
                let data = await axios.post(`${config.ROOT_URL}/modifyEvent/${this.props.eventId}`, { startDate: moment(this.state.dateTimeS, 'MMMM Do YYYY, h:mm:ss a').toLocaleString(), endDate: moment(this.state.dateTimeE, 'MMMM Do YYYY, h:mm:ss a').toLocaleString(), title: this.state.title, location: this.state.location, description: this.state.description })
                data = data.data;
                this.props.alert.show('Added Successfully', 'success')
                Router.push('/?tab=events')
                this.setState({
                    submiting: false,
                    err: !data.success ? data.error : false
                })
            } else {
                let data = await axios.post(`${config.ROOT_URL}/addEvent`, { startDate: moment(this.state.dateTimeS, 'MMMM Do YYYY, h:mm:ss a').toLocaleString(), endDate: moment(this.state.dateTimeE, 'MMMM Do YYYY, h:mm:ss a').toLocaleString(), title: this.state.title, location: this.state.location, description: this.state.description })
                data = data.data;
                Router.push('/?tab=events')

                this.setState({
                    submiting: false,
                    err: !data.success ? data.error : false
                })
            }
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
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    handleChangeT = (event, { name, value }) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
        }
    }
    nulltheError = () => {
        setTimeout(() => {
            this.setState({
                err: false
            })
        }, 4000)
    }
    onMDEChange = (val) => {
        this.setState({
            description: val
        })
    }
    render() {
        
        return (
            <main className="write-create" >
                <Segment raised>
                    <Form>
                        <Form.Field>
                            <label>Start DATE</label>
                             <DatePicker
                                selected={this.state.dateTimeS}
                                onChange={(date)=>this.setState({dateTimeS:date})}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                            /> 
                        </Form.Field>
                        <Form.Field>
                            <label>End DATE</label>
                             <DatePicker
                                selected={this.state.dateTimeE}
                                onChange={(date)=>this.setState({dateTimeE:date})}
                                showTimeSelect
                                minDate={this.state.dateTimeS}
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                            /> 
                        </Form.Field>
                        <Form.Field>
                            <label>Location</label>
                            <input placeholder='Seminar hall 2 NIT Hamirpur https://gmap/link' value={this.state.location} name="location" onChange={this.handleChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>Title</label>
                            <input placeholder='Java Workshop' value={this.state.title} name="title" onChange={this.handleChange} />
                        </Form.Field>
                        <Form.Field>
                            <label>Description</label>
                        </Form.Field>
                    </Form>
                     <Editor value={this.state.description} name="description" onChange={this.handleChange}/>
                    <Button disabled={(this.state.dateTimeS === '' ||
                        this.state.dateTimeE === '' ||
                        this.state.location === "" ||
                        this.state.description === "" ||
                        this.state.title === "")} type='submit' loading={this.state.submiting} onClick={this.onSubmit}>Submit</Button>
                </Segment>
            </main>

        );
    }
}
export default addProject;