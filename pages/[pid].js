import React, { Component } from 'react';
import config from '../config/database'
import axios from 'axios';
import SkeletonLoader from '../components/SkeletonLoader/index'
import Head from 'next/head';
import dynamic from "next/dynamic";
import { Image, Segment, Tab, Button } from 'semantic-ui-react';
const Project = dynamic(import("../components/Projects/Project/Project"), {
    loading: () => <SkeletonLoader style={{ height: "100px", width: "80%" }} />

});
const Blog = dynamic(import("../components/Blog/Blog"), {
    loading: () => <SkeletonLoader style={{ height: "100px", width: "80%" }} />
});
const Events = dynamic(import("../components/Events/Events"), {
    loading: () => <SkeletonLoader style={{ height: "100px", width: "80%" }} />
});
const loadingSkel = () => {
    let a = []
    for (let i = 0; i < 10; i++) {
        a.push(<SkeletonLoader style={{ height: "100px", width: "80%" }} />)
    }
    return a;
}
const panes = (projects, blogs, events, fetchNext10, hasMore) => ([
    {
        menuItem: 'Projects',
        render: () => {
            return (
                <div className="college-projects">

                    {projects ? <>{projects}{hasMore !== 0 ? <Button onClick={fetchNext10} loading={hasMore === 1}>Load More</Button> : null}</> : loadingSkel()}
                </div>
            )
        },
    },

    {
        menuItem: 'Blogs',
        render: () => {
            return (
                <div className="college-projects">

                    {blogs ? <>{blogs}{hasMore !== 0 ? <Button onClick={fetchNext10} loading={hasMore === 1}>Load More</Button> : null}</> : loadingSkel()}
                </div>
            )
        }
    },
    {
        menuItem: 'Events',
        render: () => {
            return (
                <div className="college-projects">

                    {events ? <>{events}{hasMore !== 0 ? <Button onClick={fetchNext10} loading={hasMore === 1}>Load More</Button> : null}</> : loadingSkel()}
                </div>
            )
        }
    },
])
class addProject extends Component {
    state = {
        data: null,
        projects: null,
        blogs: null,
        events: null,
        submiting: false,
        err: false,
        limit: 0,
        activeIndex: 0,
        hasMore: 0
    }
    static async getInitialProps(a) {
        try {
            if (!a.req) {
                let data = await axios.get(`${config.ROOT_URL}/${a.query.pid}`);
                return { user: data.data.user, profile: data.data.profile, college: data.data.college }
            }
            let { user, profile, college } = a.req;
            return { ...a.query, user, profile, college };
        }
        catch (err) {
            throw (err);
        }
    }


    render() {

        let projects = null;
        let blogs = null;
        let events = null;

        projects = this.props.profile.projects.map((d, i) => {

            return <Project key={i} _id={d._id} {...d.project} options={this.props.user ? this.props.profile.username === this.props.user.username : false} notRequiredCheck style={{ width: "80%" }} />
        })
        blogs = this.props.profile.blogEntries.map((d, i) => {

            return <Blog key={i} {...d} author={{ avtarUrl: this.props.profile.avtarUrl, username: this.props.profile.username }} options={this.props.user ? this.props.profile.username === this.props.user.username : false} style={{ width: "80%" }} />
        })
        events = this.props.profile.events.map((d, i) => {

            return <Events key={i} {...d} user = {this.props.profile.username} options={this.props.user ? d.organizer.username === this.props.user.username : false} style={{ width: "80%" }} />
        })
        return (
            <>
                <Head>
                    <meta name="description" content={`by ${this.props.profile.username} See ${this.props.profile.college} college page`} />
                    <meta itemProp="name" content={`${this.props.profile.username}@ ismy.institute `} />
                    <meta itemProp="description" content={`by ${this.props.profile.username} See ${this.props.profile.college} college page`} />
                    <meta name="twitter:title" content={`${this.props.profile.username}@ ismy.institute`} />
                    <meta name="twitter:description" content={`by ${this.props.profile.username} See ${this.props.profile.college} college page`} />
                    <meta name="og:title" content={`${this.props.profile.username}@ ismy.institute`} />
                    <meta name="og:description" content={`by ${this.props.profile.username} See ${this.props.profile.college} college page`} />
                    <title>{this.props.profile.username}@ismy.institute</title>
                </Head>
                <main >
                        <Image centered style={{ backgroundColor: "2px solid #fff !important", padding: "3px", boxShadow: "rgb(127, 127, 127) 1px 1px 4px" }} src={this.props.profile.avtarUrl} size='medium' circular />
                        <div style={{ display: "flex", flexFlow: "column", alignItems: "center" }}>
                            <Segment className="college-project-card" raised>
                                <div><b>Name</b>: {this.props.profile.username}</div>
                                <div>
                                    <b>College</b>: <a href={`https://${this.props.profile.college}.ismy.institute`} target="__blank">{this.props.profile.college}</a><b />
                                </div>
                                <div>
                                    <b>Email</b>: {this.props.profile.email}<b />
                                </div>
                                <div>
                                    <b>Github Profile</b>: <a href={this.props.profile.gitUrl} target="__blank">{this.props.profile.gitUrl}</a><b />
                                </div>

                            </Segment>

                        </div>
                        <div className="tabs">
                            <Tab menu={{ secondary: true }} defaultActiveIndex={this.state.activeIndex} onTabChange={this.handleTabChange} panes={panes(projects, blogs, events, this.fetchNext10, this.state.hasMore)} style={{ width: "100%" }} />
                        </div>
                    </main>

            </ >
        );
    }
}
export default addProject;