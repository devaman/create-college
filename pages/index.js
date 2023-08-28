import React, { Component } from 'react';
import collegeOptions from '../config/collegeOptions'
import config from '../config/database'
import axios from 'axios'
import ErrorPage from './_error'
import { Divider, Statistic, Segment, Tab, Modal, Button, Form, Loader, Input, Select } from 'semantic-ui-react';
import dynamic from "next/dynamic";
import SkeletonLoader from '../components/SkeletonLoader/index'
import Router from 'next/router'
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
const tabVal = (str) => {
  if (str === "blogs") {
    return 1;
  } else if (str === "events") {
    return 2;
  } else return 0;
}
class Home extends Component {
  // static async getInitialProps({ query }) {
  //   return {query};
  // }
  state = {
    modal: false,
    submit: false,
    email: "",
    college: "",
    projects: null,
    blogs: null,
    activeIndex: this.props.tab,
    events: null,
    limit: 0
  }
  static async getInitialProps(a) {
    if (a.req) {

      let { user, college, count } = a.req;
      let tab = tabVal(a.req.query.tab);
      return { ...a.query, user, college, tab, count };

    }
    let data = await axios.get(`${config.ROOT_URL}/?tab=${a.query.tab}`);
    return { user: data.data.user, college: data.data.college, count: data.data.count, tab: tabVal(data.data.tab) }


  }
  componentDidMount() {
    if (this.props.user)
      if (this.props.user.college == null || this.props.user.email.match(/github.com/) !== null) {
        this.setState({
          modal: true
        })
      }
    if(this.props.college)
      this.fetchData()
  }
  fetchNext10 = () => {
    this.setState({
      hasMore: 1
    })
    if (this.state.activeIndex === 0) {
      this.getAllProjects()
    } else if (this.state.activeIndex === 1) {
      this.getAllBlogs()

    } else {
      this.getAllEvents()
    }
  }
  fetchData = () => {
    this.setState({
      limit: 0,
      events: null,
      projects: null,
      blogs: null,
      hasMore: 2
    }, () => {
      if (this.state.activeIndex === 0) {
        Router.push('/', '/', { shallow: true })
        this.getAllProjects()
      } else if (this.state.activeIndex === 1) {
        Router.push('/?tab=blogs', '/?tab=blogs', { shallow: true })
        this.getAllBlogs()

      } else {
        Router.push('/?tab=events', '/?tab=events', { shallow: true })
        this.getAllEvents()
      }
    })

  }
  handleTabChange = (e, { activeIndex }) => {

    this.setState({ activeIndex }, () => {

      this.fetchData()
    })
  }
  getAllProjects = async () => {
    try {

      let data = await axios.get(`${config.ROOT_URL}/getAllcollegeProjects?index=${this.state.limit}`)

      data = data.data.projects;
      if (data.length === 0) {
        this.setState({
          hasMore: 0,
          projects: this.state.projects === null ? [] : this.state.projects
        });
        return;
      }
      if (this.state.projects)
        this.setState({
          projects: [...this.state.projects, ...data],
          limit: this.state.limit + 1,
          hasMore: data.length < 9 ? 0 : 2
        })
      else {
        this.setState({
          projects: data,
          limit: this.state.limit + 1,
          hasMore: data.length < 10 ? 0 : 2

        })
      }
    } catch (err) {
      this.props.alert.show(err.message,'error')
      this.setState({
        projects: []
      })
    }
  }
  getAllBlogs = async () => {
    try {
      let data = await axios.get(`${config.ROOT_URL}/getCollegeBlogs?index=${this.state.limit}`)

      data = data.data.blogs;
      if (data.length === 0) {
        this.setState({
          hasMore: 0,
          blogs: this.state.blogs === null ? [] : this.state.blogs
        });
        return;
      }
      if (this.state.blogs)
        this.setState({
          blogs: [...this.state.blogs, ...data],
          limit: this.state.limit + 1,
          hasMore: data.length < 9 ? 0 : 2
        })
      else {
        this.setState({
          blogs: data,
          limit: this.state.limit + 1,
          hasMore: data.length < 10 ? 0 : 2

        })
      }
    } catch (err) {
      this.props.alert.show(err.message,'error')
      this.setState({
        blogs: []
      })
    }
    // this.setState({
    //   blogs: data,
    //   limit:this.state.limit + 1
    // })

  }
  getAllEvents = async () => {
    try{

    
    let data = await axios.get(`${config.ROOT_URL}/getAllEvents?index=${this.state.limit}`)

    data = data.data.events;
    if (data.length === 0) {
      this.setState({
        hasMore: 0,
        events: this.state.events === null ? [] : this.state.events
      });
      return;
    }
    if (this.state.events)
      this.setState({
        events: [...this.state.events, ...data],
        limit: this.state.limit + 1,
        hasMore: data.length < 9 ? 0 : 2
      })
    else {
      this.setState({
        events: data,
        limit: this.state.limit + 1,
        hasMore: data.length < 10 ? 0 : 2

      })
    }
  } catch (err) {
    this.props.alert.show(err.message,'error')
    this.setState({
      events:[]
    })
  }
    // this.setState({
    //   events: data,
    //   limit:this.state.limit + 1
    // })

  }
  onFormSubmit = async () => {
    try {

      this.setState({
        submit: true
      })

      let data = await axios(`${config.ROOT_URL}/updateDetails`, {
        method: "post",
        data: {
          email: this.state.email === "" ? null : this.state.email,
          college: this.state.college === "" ? null : this.state.college
        },
        withCredentials: true
      })


      this.setState({
        submit: false,
        modal: false
      })
    } catch (err) {
      alert(err)
    }

  }
  onChangeValue = (e, a) => {
    if (a) {
      if (a.value === "") {
        this.props.alert.show("Select College");
        return;
      }
      this.setState({
        [a.name]: a.value
      })
    } else {
      if (e.target.value === "") {
        this.props.alert.show("Enter email");
        return;
      }
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  }
  render() {
    let projects = this.state.projects;
    let blogs = this.state.blogs;
    let events = this.state.events;

    if (this.state.projects) {
      projects = this.state.projects.map((d, i) => {

        return <Project key={i} _id={d._id} {...d.project} college ={d.college} options={this.props.user ? (this.props.user.isAdmin === 1 ? true : false) : false} notRequiredCheck style={{ width: "80%" }} />
      })
    }
    if (this.state.blogs) {
      blogs = this.state.blogs.map((d, i) => {

        return <Blog key={i} {...d} options={this.props.user ? ((this.props.user.isAdmin === 1 ? true : false)) : false} style={{ width: "80%" }} />
      })
    }
    if (this.state.events) {
      events = this.state.events.map((d, i) => {

        return <Events key={i} {...d} options={this.props.user ? (this.props.user.isAdmin === 1 ? true : false) : false} style={{ width: "80%" }} />
      })
    }


    return (
      <>
        {this.props.user ?
          <Modal
            open={this.state.modal}
          >
            <Modal.Header>More Details Required</Modal.Header>
            <Modal.Content>
              <Form onSubmit={this.onFormSubmit}>
                {this.props.user.email.match(/github.com/) !== null ?
                  <Form.Field>
                    <Form.Input style={{ width: "100%" }} onChange={this.onChangeValue} value={this.state.email} name="email" type="email" label='Email' placeholder='Email' required />
                  </Form.Field> : null}
                <Form.Field>
                  <Form.Field
                    control={Select}
                    options={collegeOptions.options}
                    label={{ children: 'College', htmlFor: 'form-select-control-college' }}
                    placeholder='College'
                    search
                    required
                    name="college"
                    searchInput={{ id: 'form-select-control-college' }}
                    onChange={this.onChangeValue}
                  />
                </Form.Field>

                <Button type='submit'>Submit</Button>
              </Form>
              <Form.Field>
                <a href="https://www.notion.so/9896811d6a5244929fae4d62c0d7f015?v=b24af3f8200b413589a52b3913451227">If you can't see your college in list please raise a ticket to add your college to the platform</a>
              </Form.Field>
            </Modal.Content>

          </Modal>
          : null}
        {this.props.college ?
          <main >
            <div className="college-image">
              <img src={this.props.college.logo} height="100px" />
            </div>
            <div className="college-info">
              <Divider horizontal>
                <h1 className="college-name">{this.props.college.fullName}</h1>
              </Divider>
              <Segment raised style={{ padding: "10px", width: "auto" }}>
                <Statistic.Group style={{ margin: "0px", marginRight: "1.5em", padding: "0px" }}>
                  <Statistic>
                    <Statistic.Label>Projects</Statistic.Label>
                    <Statistic.Value>{this.props.count.projects}</Statistic.Value>
                  </Statistic><Statistic>
                    <Statistic.Label>Blogs</Statistic.Label>
                    <Statistic.Value>{this.props.count.blogs}</Statistic.Value>
                  </Statistic><Statistic>
                    <Statistic.Label>Events</Statistic.Label>
                    <Statistic.Value>{this.props.count.events}</Statistic.Value>
                  </Statistic>
                </Statistic.Group>
              </Segment>
            </div>
            <div className="tabs">
              <Tab menu={{ secondary: true }} defaultActiveIndex={this.state.activeIndex} onTabChange={this.handleTabChange} panes={panes(projects, blogs, events, this.fetchNext10, this.state.hasMore)} style={{ width: "100%" }} />
            </div>
          </main> :<ErrorPage statusCode={404} message="College Page Does not exist"/> }
      </>

    );
  }
}
// Home.getLayout = page => (
//   <Layout>
//   {page}
//   </Layout>
// )
export default (Home);