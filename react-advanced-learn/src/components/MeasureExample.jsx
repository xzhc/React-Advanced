import { useCallback, useEffect, useState } from "react";

export function MeasureExample() {
  const [height, setHeight] = useState(0);
  const [elements, setElements] = useState([]);

  //使用useCallback创建稳定的ref回调
  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  //收集多个元素引用的回调
  const collectRef = useCallback((node) => {
    if (node !== null) {
      setElements((prev) => [...prev.filter((el) => el !== node), node]);
    } else {
      setElements((prev) => prev.filter((el) => el.isConnected));
    }
  }, []);

  useEffect(() => {
    console.log("收集的元素数量：", elements.length);
  }, [elements]);
  return (
    <div>
      <h2 ref={measuredRef}>你好世界</h2>
      <p>上面标题的高度是：{Math.round(height)}px</p>

      <div>
        {["A", "B", "C"].map((item) => (
          <div key={item} ref={collectRef}>
            项目{item}
          </div>
        ))}
      </div>
    </div>
  );
}
