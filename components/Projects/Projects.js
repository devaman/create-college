import React from 'react';
import Project from './Project/Project';
import { Loader, Button } from 'semantic-ui-react';
// import  './Projects.scss'
const Projects = (props)=>{
    if(props.data){
        let projects = props.data.map((d,i)=>{
            return <Project {...d} key={d.id} toggleCheckbox={()=>props.toggleCheckbox(i)}/>
        })
    return <div className="all-projects">
        <Button loading={props.submiting} className="stick" onClick={props.onSubmit}>Submit</Button>

        {projects}
        
        </div>;

    }else{
        return <Loader active inline='centered' >Fetching your Projects</Loader>
    }
}
export default Projects;