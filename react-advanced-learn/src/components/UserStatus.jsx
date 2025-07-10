import { useEffect, useDebugValue, useState } from "react";

//自定义hook用于追踪用户是否在线
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  //添加调试值，在ReactDevTools中显示用户状态
  useDebugValue(isOnline ? "在线" : "离线");
  return isOnline;
}

//示例组件
export function UserStatus() {
  const isOnline = useOnlineStatus();
  return <div>用户状态：{isOnline ? "在线" : "离线"}</div>;
}
