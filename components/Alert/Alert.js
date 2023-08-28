import React from 'react'
import { Message } from 'semantic-ui-react'

const AlertComp = (props) => {
    if (props.type === 'success')
        return <Message
            success
            icon='check circle'
            content={props.message}
        />
    else if (props.type === 'error')
        return <Message
            error
            icon='times circle'
            content={props.message}
        />
    else
        return <Message
            color='blue'
            icon='info'
            content={props.message}
        />
}
export default AlertComp;