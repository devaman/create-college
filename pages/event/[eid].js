import React, { Component } from 'react';
import axios from 'axios'
import config from '../../config/database'
import { Card, Button, Label, Grid, Icon, Modal, Table} from 'semantic-ui-react';
import ErrorPage from '../_error'

import moment from 'moment';
import Head from 'next/head';
import Link from 'next/link';
import { Viewer } from '../../components/Editor';
class addProject extends Component {
    state = {
        data: null,
        projects: [],
        submiting: true,
        openModal: false,
        registeredUsers: null,
        err: false
    }
    static async getInitialProps(a) {
        try {
            if (!a.req) {
                let data = await axios.get(`${config.ROOT_URL}/event/${a.query.eid}`);
                return { user: data.data.user, college: data.data.college, event: data.data.event }
            }
            let { user, college, event } = a.req;
            return { ...a.query, user, college, event };
        }
        catch (err) {
            throw (err);
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0)
        if(window.twttr?true:false)
        twttr.widgets.load();
    }
    onRegisterClick = async () => {
        try {

            this.setState({
                submiting: false
            })

            await axios(`${config.ROOT_URL}/registerForEvent`, {
                method: "post",
                data: {
                    _id: this.props.event._id
                }
            })


            this.setState({
                submiting: "done",
            })
        } catch (err) {
            alert(err)
        }
    }
    getRegisteredUsers = async () => {
        this.setState({
            openModal: true,
            registeredUsers: "load"
        })
        try {
            let data = await axios.get(`${config.ROOT_URL}/getRegisteredUsers/${this.props.event._id}`)

            this.setState({
                registeredUsers: data.data.data
            })

        } catch (err) {
            this.props.alert.show(err.message, 'error')
        }
    }
    onClose = () => {
        this.setState({
            openModal: false
        })
    }
    render() {
        if (this.props.event)
            return (
                <main id="event-details-id">
                    <Grid columns="equal" stackable>
                        <Head>
                            <meta name="twitter:image" content={`https://img.devaman.dev/1/?title=${this.props.event.title}&website=https://ismy.institute&back=0056cc&textFill=fefefe`} />
                            <meta property="og:image" content={`https://img.devaman.dev/1/?title=${this.props.event.title}&website=https://ismy.institute&back=0056cc&textFill=fefefe`} />
                        </Head>
                        <Grid.Column width={12}>
                            <Card className="blog-details" style={{ width: "100%" }}>
                                <Card.Content>
                                    <Card.Header style={{ display: "flex", justifyContent: "space-between", fontSize: "3.25rem",padding:"10px" }}>{this.props.event.title}</Card.Header>
                                    <Viewer value={this.props.event.description} />
                                </Card.Content>

                            </Card>

                        </Grid.Column>
                        <Grid.Column>

                            <Card className="event-card-info" >
                                <Card.Content>
                                    {this.props.user ? <Button className="register-button" disabled={(this.props.event.registeredUsers.indexOf(this.props.user._id) !== -1) || this.state.submiting === "done" ? true : false} loading={!this.state.submiting} style={{ display: "block", height: "45px", textAlign: "center", marginTop: "20px", marginRight: "auto", marginLeft: "auto", marginBottom: "20px" }} onClick={this.onRegisterClick} color="blue">{(this.props.event.registeredUsers.indexOf(this.props.user._id) !== -1) || this.state.submiting === "done" ? "Registered" : "Register"}</Button> :
                                        <Button className="register-button" onClick={() => window.location = `/auth?redirect=${window.location.href}`} style={{ display: "block", height: "45px", textAlign: "center", marginTop: "20px", marginRight: "auto", marginLeft: "auto", marginBottom: "20px" }} color="blue">Login to register</Button>}
                                    Organizer<img src={this.props.event.organizer.avtarUrl} width="15" style={{ borderRadius: "50%", marginRight: "8px" }} /> <Link href="/[pid]" as={`/${this.props.event.organizer.username}`}><a>{this.props.event.organizer.username}</a></Link>
                                    <br /> At  :<Label color="teal"> {this.props.event.location} </Label>
                                    <br /> Timing: <Label>{moment(this.props.event.startDate).format('MMMM Do YYYY, h:mm a')} - {moment(this.props.event.endDate).format('MMMM Do YYYY, h:mm a')}</Label>
                                    <br /> <Icon name="user" /> {this.props.event.registeredUsers.length}
                                    <br />
                                    {this.props.user && this.props.user.username === this.props.event.organizer.username ?
                                        <Modal
                                            trigger={<Button onClick={this.getRegisteredUsers} style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }} color="twitter" circular>Registered Users</Button>}
                                            open={this.state.openModal}
                                            onClose={this.onClose}
                                        >
                                            <Modal.Header style={{display:"flex",justifyContent:"space-between"}}>Registered Users <Icon name="close" style={{cursor:"pointer"}} onClick={this.onClose}/></Modal.Header>
                                            <Modal.Content>
                                                <Modal.Description>


                                                    {this.state.registeredUsers ? this.state.registeredUsers === 'load' ?<div class="lds-ripple"><div></div><div></div></div> :
                                                        <Table singleLine>
                                                            <Table.Header>
                                                                <Table.Row>
                                                                    <Table.HeaderCell>Username</Table.HeaderCell>
                                                                    <Table.HeaderCell>College</Table.HeaderCell>
                                                                    <Table.HeaderCell>E-mail address</Table.HeaderCell>
                                                                    <Table.HeaderCell>Profile</Table.HeaderCell>
                                                                </Table.Row>
                                                            </Table.Header>
                                                            <Table.Body>

                                                                {this.state.registeredUsers.map((d, i) => (
                                                                    <Table.Row key={d.username}>
                                                                        <Table.Cell><img src={d.avtarUrl} width="15" style={{ borderRadius: "50%", marginRight: "8px" }} /> {d.username}</Table.Cell>
                                                                        <Table.Cell>{d.college}</Table.Cell>
                                                                        <Table.Cell>{d.email}</Table.Cell>
                                                                        <Table.Cell><Link href="/[pid]" as={`/${d.username}`}> Open Profile</Link></Table.Cell>
                                                                    </Table.Row>

                                                                ))
                                                                }
                                                            </Table.Body>
                                                        </Table>
                                                        : null}




                                                </Modal.Description>
                                            </Modal.Content>
                                        </Modal>
                                        : null}
                                </Card.Content>

                            </Card>
                        </Grid.Column>

                    </Grid>
                </main>

            );
        else {
            return <ErrorPage statusCode={404} message="Event not found" />

        }
    }
}
export default addProject;