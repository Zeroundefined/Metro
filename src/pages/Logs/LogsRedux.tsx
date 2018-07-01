import { url, Response } from '../../utils/http';
import { message } from 'antd';
import { browserHistory } from 'react-router';


const getLogs = () => {
    return fetch(`${url}/getLog`, {
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json()).then(data => {

      if (data.errMsg) {
        if(data.code === 401) {
          browserHistory.push('/login');
        }
        message.error(data.errMsg);
      }

      return data
    })
}

export { getLogs }