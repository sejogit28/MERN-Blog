import React from 'react';


const getStyle = (props)=>
{
    let baseClass = "";
    if(props.message.msgError)
        baseClass = baseClass + "ui negative message";
    else
        baseClass= baseClass + "ui success message";
    return baseClass;
}

const Message = props =>
{
    return(
        <div className={getStyle(props)}>
            <div className="content">
                <div className="header">
                  {props.message.msgBody}
                </div>
            </div>
        </div>      
    )

}
export default Message;