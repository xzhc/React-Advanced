import { useState } from "react";
export function CaptureEventDemo() {
  const [eventLogs, setEventLogs] = useState([]);
  const addLog = (message) => {
    setEventLogs((prev) => [...prev, message]);
  };
  //捕获阶处理程序
  const handleOuterCapture = (e) => {
    addLog("1. 外层程序-捕获阶段");
    //如果取消注释下面这行，将阻止事件继续传播
    //e.stopPropagation();
  };

  const handleInnerCapture = (e) => {
    addLog("2. 内层程序-捕获阶段");
    //如果取消注释下面这行，将阻止事件继续传播
    //e.stopPropagation();
  };

  //冒泡阶段处理程序
  const handleInnerBubble = (e) => {
    addLog("3. 内层程序-冒泡阶段");
    //如果取消注释下面这行，将阻止事件继续冒泡
    e.stopPropagation();
  };

  const handleOuterBubble = (e) => {
    addLog("4. 外层程序-冒泡阶段");
    //如果取消注释下面这行，将阻止事件继续冒泡
    //e.stopPropagation();
  };

  const clearLogs = () => {
    setEventLogs([]);
  };
  return (
    <>
      <div className="capture-event-demo">
        <h2>点击查看事件传播顺序</h2>
        <div
          className="outer"
          onClickCapture={handleOuterCapture}
          onClick={handleOuterBubble}
        >
          外层元素
          <div
            className="inner"
            onClickCapture={handleInnerCapture}
            onClick={handleInnerBubble}
          >
            内层元素
          </div>
        </div>
      </div>

      <div className="event-log">
        <h3>事件日志</h3>
        <button onClick={clearLogs}>清除日志</button>
        <ol>
          {eventLogs.map((log, index) => {
            return <li key={index}>{log}</li>;
          })}
        </ol>
      </div>

      <div className="explanation">
        <p>事件传播顺序：</p>

        <ol>
          <li>捕获阶段：从外到内</li>
          <li>目标阶段：触发事件的元素</li>
          <li>冒泡阶段：从内到外</li>
        </ol>
        <p>
          注意：如果在任何阶段调用 e.stopPropagation()，事件传播将在该点停止。
        </p>
      </div>
    </>
  );
}
