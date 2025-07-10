import { useLayoutEffect, useRef, useState } from "react";

export function ResizeExample() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const targetRef = useRef(null);
  const measureRef = useRef(null);

  useLayoutEffect(() => {
    if (measureRef.current) {
      const [width, height] = measureRef.current.getBoundingClientRect();

      setWidth(width);
      setHeight(height);
    }
  }, [measureRef.current]);

  return (
    <div>
      <div
        ref={measureRef}
        style={{
          border: "1px solid blue",
          padding: "20px",
          display: "inline-block",
        }}
      >
        这是要测量的内容
      </div>

      <div
        ref={targetRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: "lightgreen",
          marginTop: "10px",
        }}
      >
        我的尺寸与上面元素相同
      </div>
      <p>
        测量结果：{width}px x {height}px
      </p>
    </div>
  );
}
