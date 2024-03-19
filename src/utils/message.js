import {message } from 'antd';
const useMessage=()=>{
  let [messageApi, contextHolder] = message.useMessage();
  const success = (msg) => {
    messageApi.open({
      type: 'success',
      content: msg
    });
  };
  const error = (msg) => {
    messageApi.open({
      type: 'error',
      content: msg
    });
  };
  const warning = (msg) => {
    messageApi.open({
      type: 'warning',
      content: msg
    });
  };
  return {contextHolder,success,error,warning}
}
export default useMessage;