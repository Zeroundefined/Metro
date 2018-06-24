import { url, Response } from '../../utils/http';
import { message } from 'antd';


const getLogs = () => {
    return fetch(`${url}/getLog`, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json()).then(data => {

      if (data.errMsg) {
        message.error(data.errMsg);
      }

      return data
    })
}

export { getLogs }