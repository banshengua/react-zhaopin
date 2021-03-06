import React from 'react'
import Login from './container/login/login'
import Register from './container/register/register'
import AuthRoute from './component/authroute/authroute'
import BossInfo from './container/bossinfo/bossinfo'
import GeniusInfo from './container/geniusinfo/geniusinfo'
import Dashboard from './component/dashboard/dashboard'
import Chat from './component/Chat/chat'
import { Route,Switch } from 'react-router-dom'
export default class App extends React.Component{
    constructor(props){
        super(props)    
        this.state={
            hasError:false
        }
    }
    componentDidCatch(){
        this.setState({
			hasError:true
		})
    }
    render(){
        return this.state.hasError?<h2>出错了</h2>:
        <div>
            <AuthRoute></AuthRoute>
				<Switch>
					
					<Route path='/bossinfo' component={BossInfo}></Route>
					<Route path='/geniusinfo' component={GeniusInfo}></Route>
					<Route path='/login' component={Login}></Route>
					<Route path='/register' component={Register}></Route>
					<Route path='/chat/:user' component={Chat}></Route>
					<Route component={Dashboard}></Route>
				
				</Switch>


        </div>
            
    
    }
}
