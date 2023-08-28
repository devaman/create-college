import React, { Component } from 'react';
import { Card, Label, Icon, Transition } from 'semantic-ui-react';
// import './Events.css'
import moment from 'moment'
import axios from 'axios';
import config from '../../config/database'
import Link from 'next/link'
class Events extends Component {
    state = {
        visible: true
    }
    onTrashClick = async () => {
        try {
            await axios.post(`${config.ROOT_URL}/deleteEvent`, { _id: this.props._id })
            this.setState({visible:false})
        } catch (err) {
            console.log(err);

        }
    }
    render() {
        const { visible } = this.state
        return (
            <Transition visible={visible} animation='fade right' duration={500}>
                <Card className="college-project-card">
                    <Card.Content>
                        <Card.Header className="blog-body" style={{ display: "flex", justifyContent: "space-between" }}><Link href='/event/[eid]' as={`/event/${this.props.slug}`}><a style={{ cursor: "pointer" }} >{this.props.title}</a></Link><div><Label>{moment(this.props.startDate).format('MMMM Do YYYY, h:mm a')}</Label>{this.props.options ?<div><Link href={`/createEvent?eventId=${this.props._id}`}><Icon  style={{cursor:"pointer",color:"rgb(0, 135, 255)"}} name='edit outline' /></Link> <Icon onClick={this.onTrashClick} style={{ cursor: "pointer", color: "#db1414" }} name='trash' /></div> : null}{this.props.category==="shared"?<Label>{this.props.category}</Label>:null}</div></Card.Header>
                        <Card.Meta className="blog-body" style={{ display: 'flex', alignItems: "center" }}>By <img src={this.props.organizer.avtarUrl} width="15" style={{ borderRadius: "50%", marginRight: "8px" }}  /><Link href="/[pid]" as={`/${this.props.organizer.username}`}><a>{this.props.organizer.username}</a></Link></Card.Meta>
                        

                    </Card.Content>
                    <Card.Content extra>
                        {this.props.user?this.props.user !== this.props.organizer.username?<Label>Registered to this event</Label>:<Label>Organizer</Label>:null}
                    </Card.Content>
                </Card>
            </Transition>

        )
    }

}
export default Events;