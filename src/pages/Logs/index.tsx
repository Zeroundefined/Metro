import * as React from 'react';
import './Logs.scss';
import { getLogs } from './LogsRedux';

export default class Logs extends React.Component {

	state = {
		logs: [
				
		]
	}

	componentDidMount() {
		getLogs().then(data => {
			this.setState({logs: data.data})
		})
	}
  render() {
  	let {logs} = this.state;
    return (
	    <div className="logs">
	    	<ul className="content">
	    		{logs.map((log, key) => <li key={log.id}>{log.content}</li>)}		
	    	</ul>	    
	    </div>
    	
    )

  }
}