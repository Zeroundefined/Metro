import * as React from 'react';
import './Logs.scss';
import * as TITLEICON from '../../img/icons-11.png';
import { getLogs } from './LogsRedux.tsx';

export default class Logs extends React.Component {
	constructor(props) {
		super();
		this.state = {
			logs: [
				
			]
		}
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
	    		{logs.map((log, key) => return <li key={log.id}>{log.content}</li>)}		
	    	</ul>	    
	    </div>
    	
    )

  }
}