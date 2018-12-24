import axios from 'axios'
import io from 'socket.io-client'
const MSG_LIST='MSG_LIST'
const MSG_RECV='MSG_RECV'
const MSG_READ='MSG_READ'
const socket=io('ws://localhost:9093')
const initState={
    unread:0,
    chatmsg:[],
    users:[]
}
export function chat(state=initState,action){
switch(action.type){
    case MSG_LIST:
        return {...state,chatmsg:action.payload.msgs,unread:action.payload.msgs.filter(v=>!v.read&&v.to==action.payload.userid).length,
            users:action.payload.users}
    case MSG_RECV:
   const n= action.payload.to==action.userid?1:0
    return {...state,chatmsg:[...state.chatmsg,action.payload],unread:state.unread+n}
    case MSG_READ:
    return {...state,unread:state.unread-action.payload.num,chatmsg:state.chatmsg.map((v)=>({...v,read:action.payload.from==v.from?true:v.read}))}
    default:
    return state
}
}
function msgList(msgs,users,userid){
    return {
        type:MSG_LIST,
        payload:{msgs,users,userid}
    }
}
function msgRecv(data,userid){
    return {
        type:MSG_RECV,
        payload:data,
        userid:userid
    }
}
export function recvMsg(){
    return (dispatch,getState)=>{
        socket.on('recvmsg',function(data){
            const userid=getState().user._id
            dispatch(msgRecv(data,userid))
        })
    }

}
function msgRead({from,userid,num}){
	return {type: MSG_READ, payload:{from,userid,num}}
}
export function sendMsg({from,to,msg}){
return dispatch=>{socket.emit('sendmsg',{from,to,msg})
}


}
export function rendMsg(from){
    return  (dispatch,getState)=>{
        axios.post('/user/readmsg',{from}).then((res)=>{
            if(res.data.code==0){
                const userid=getState().user._id
                dispatch(msgRead({from,userid,num:res.data.num}))
            }
        })
    }
}

export function getMsgList(){
    return (dispatch,getState)=>{
        axios.get('/user/getmsglist').then((res)=>{
            if(res.data.code==0){
                const userid=getState().user._id
                return dispatch(msgList(res.data.msgs,res.data.users,userid))
            }
        })
    }
}