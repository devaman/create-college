import React, { Component } from 'react';
import { Card, Icon, Transition, Label } from 'semantic-ui-react';
import Link from 'next/link'
// import './Blog.css'
import axios from 'axios';
import config from '../../config/database'
class Blog extends Component {
    state = {
        visible: true
    }
    onTrashClick = async () => {
        try {
            await axios.post(`${config.ROOT_URL}/deleteBlog`, { _id: this.props._id })
            this.setState({ visible: false })
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
                        <Card.Header className="blog-body" style={{ display: "flex", color: "#1e70bf", justifyContent: "space-between" }}><Link href="/blog/[bid]" as={`/blog/${this.props.slug}`}><a style={{ cursor: "pointer" }} >{this.props.title}</a></Link>{this.props.options ? <div><Link href={`/writeBlog?blogId=${this.props._id}`}><Icon onClick={this.onEditClick} style={{ cursor: "pointer", color: "rgb(0, 135, 255)" }} name='edit outline' /></Link><Icon onClick={this.onTrashClick} style={{ cursor: "pointer", color: "#db1414" }} name='trash' /></div> : null}{this.props.category === "shared" ? <Label>{this.props.category}</Label> : null}</Card.Header>
                        <Card.Meta className="blog-body" style={{ display: 'flex', alignItems: "center" }}>By <img src={this.props.author.avtarUrl} width="15" style={{ borderRadius: "50%", marginRight: "8px" }} /><Link href="/[pid]" as={`/${this.props.author.username}`}><a >{this.props.author.username}</a></Link></Card.Meta>
                    </Card.Content>
                    <Card.Content extra>
                    </Card.Content>
                </Card>
            </Transition>

        )
    }

}
export default Blog;