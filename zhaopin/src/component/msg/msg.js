import React from 'react'
import {connect} from 'react-redux'
import {List,Badge} from 'antd-mobile'
@connect(
    state=>state
)
class Msg extends React.Component{
    constructor(props){
        super(props)
        this.state={}
    }
 getLast(arr){
return arr[arr.length-1]
 }   
render(){
    const msgGroup={}
    this.props.chat.chatmsg.forEach(v => {
        msgGroup[v.chatid]=msgGroup[v.chatid]||[]
        msgGroup[v.chatid].push(v)
   
    });
   const chatList=Object.values(msgGroup).sort((a,b)=>{
    const a_last=this.getLast(a).create_time
    const b_last=this.getLast(b).create_time
    return b_last-a_last
   })
   const Item=List.Item
   const Brief = Item.Brief
  const userid=this.props.user._id




 
    return(
        <div>
           <List>
        {chatList.map(v=>{
            const lastItem=this.getLast(v)
            const targetId = userid==v[0].from?v[0].to:v[0].from
            const unreadNum=v.filter(item=>!item.read&&userid==item.to).length
            const name = this.props.chat.users[targetId].name?this.props.chat.users[targetId].name:null
            const avatar = this.props.chat.users[targetId].avatar?this.props.chat.users[targetId].avatar:null
       
       
        return (
        <Item
           key={lastItem.create_time}
           thumb={require(`../img/${avatar}.png`)}
           extra={<Badge text={unreadNum}></Badge>}
           onClick={()=>{
               this.props.history.push(`/chat/${lastItem.from}`)
           }}
           >
           {lastItem.content}
           <Brief>{name}</Brief>
           </Item>  
       )
              
        })}
           </List>

        </div>
    )
}
}
export default Msg