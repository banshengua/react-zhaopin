import React from 'react'
import {getChatId} from '../../util'
import {List,InputItem,NavBar,Icon,Grid} from 'antd-mobile'
import {connect} from 'react-redux'
import {getMsgList,sendMsg,recvMsg,rendMsg} from '../../redux/chat.redux'

@connect(
    state=>state,
    {getMsgList,sendMsg,recvMsg,rendMsg}
)
class Chat extends React.Component{
    constructor(props){
        super(props)
        this.state={
            text:'',
            msg:[],
            showEmoji:false
        }
        this.handleClick=this.handleClick.bind(this)
    }
    componentDidMount(){
        if(!this.props.chat.chatmsg.length<0){
            this.props.getMsgList()
            this.props.recvMsg()
        }
        // socket.on('recevmsg',(data)=>{
        
        //     this.setState({msg:[...this.state.msg,data.text]})
            
        // })
       
    }
    componentWillUnmount(){
        const to=this.props.match.params.user
        this.props.rendMsg(to)
    }
    fixCarousel(){
		setTimeout(function(){
			window.dispatchEvent(new Event('resize'))
		},0)
	}
    handleClick(){
        // socket.emit('sendmsg',{text:this.state.text})
        console.log('sendmsg')
        const to = this.props.match.params.user
        const from = this.props.user._id

        const msg=this.state.text
        this.props.sendMsg({from,to,msg})
        this.setState({text:'',showEmoji:false})
    }
    render(){
        const userid=this.props.match.params.user
        const Item=List.Item
        const users = this.props.chat.users
        const chatid=getChatId(userid,this.props.user._id)
        const chatmsg= this.props.chat.chatmsg.filter(v=>
            v.chatid===chatid
        )
        if(!users[userid]){
			return null
		}
        const emoji = '😀 😃 😄 😁 😆 😅 😂 😊 😇 🙂 🙃 😉 😌 😍 😘 😗 😙 😚 😋 😜 😝 😛 🤑 🤗 🤓 😎 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 😤 😠 😡 😶 😐 😑 😯 😦 😧 😮 😲 😵 😳 😱 😨 😰 😢 😥 😭 😓 😪 😴 🙄 🤔 😬 🤐 😷 🤒 🤕 😈 👿 👹 👺 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾 👐 🙌 👏 🙏 👍 👎 👊 ✊ 🤘 👌 👈 👉 👆 👇 ✋  🖐 🖖 👋  💪 🖕 ✍️  💅 🖖 💄 💋 👄 👅 👂 👃 👁 👀 '
        .split(' ')
        .filter(v=>v)
        .map(v=>({text:v}))
        return(
            <div id='chat-page'>
                <NavBar
                    mode='dark'
                    icon={<Icon type="left" />}
                    onLeftClick={()=>{
                        this.props.history.goBack()
                    }}
				>
					{users[userid].name}
				</NavBar>

                <div>
                    {chatmsg.map((v)=>{
                        const avatar = require(`../img/${users[v.from].avatar}.png`)
                        return v.from===userid?(
                            <List key={v._id}>
                            <Item
                          thumb={avatar}
                            >{v.content}</Item>
                            </List>
                           
                        ):(
                            <List key={v._id}>
                            <Item 
                            extra={<img alt='头像' src={avatar} />}
                            className="chat-me">{v.content}</Item>
                            </List>
                        )
                    })}
                </div>
                <div className="stick-footer">
                <List>
                <InputItem
                placeholder="请输入"
                value={this.state.text}
                onChange={v=>{
                    this.setState({text:v})
                }}
                extra={<div>
                    <span
                        style={{marginRight:15}}
                        onClick={()=>{
                            this.setState({
                                showEmoji:!this.state.showEmoji
                            })
                            this.fixCarousel()
                        }}
                    >😃</span>
                    <span onClick={()=>this.handleClick()} >发送</span>
                </div>}
                >
                </InputItem>  
                </List>

              {this.state.showEmoji?< Grid 
               data={emoji}
               columnNum={9}
               carouselMaxRow={4}
               isCarousel={true}
               onClick={(v)=>{
                   console.log(v)
                   this.setState({
                       text:this.state.text+v.text
                   })
               }} />:null} 
                </div>

            </div>
        )
    }
}
export default Chat