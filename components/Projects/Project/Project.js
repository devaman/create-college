import React,{useState} from 'react';
import { Card, Checkbox, Label, Icon, Transition } from 'semantic-ui-react';
// import './Project.scss'
import axios from 'axios';
import config from '../../../config/database'
import Link from 'next/link';
const onTrashClick = async (setVisiblity,id) => {
    try {
        
        await axios.post(`${config.ROOT_URL}/deleteProject`,{_id:id})
        setVisiblity(false);
    } catch (err) {
        console.log(err);

    }
}
const Project = (props) => {
    const [visible,setVisiblity] = useState(true);
    
    return (
        <Transition visible={visible} animation='fade right' duration={500}>

        <Card className="college-project-card">
            <Card.Content>
                <Card.Header style={{ display: "flex", justifyContent: "space-between" }}><a href={`${props.url}`} target="_blank">{props.name}</a>{props.notRequiredCheck ? (props.options ? <Icon onClick={()=>onTrashClick(setVisiblity,props._id)} style={{ cursor: "pointer", color: "#db1414" }} name='trash' /> : null) : <Checkbox onChange={props.toggleCheckbox} value={props.selected}>Tick</Checkbox>}</Card.Header>
                <Card.Meta style={{ display: 'flex', alignItems: "center" }}><img src={props.avatar_url} width="15" style={{ borderRadius: "50%", marginRight: "8px" }} /><Link href="/[pid]" as={`/${props.username}`}><a >{props.username}</a></Link></Card.Meta>
                <Card.Description>
                    <Label color="orange">Open Issues {props.open_issues}</Label><Label color="blue" >Forks {props.forkCounts}</Label>
                </Card.Description>

            </Card.Content>
            <Card.Content extra>
                {props.languages ?
                    <Label as='a' color='teal' >
                        {props.languages}
                    </Label> : null}
                <span style={{ marginLeft: '8px' }}>Last Updated On {new Date(props.updated_at).toDateString()}</span>
            </Card.Content>
        </Card>
        </Transition>

    )
}
export default Project;