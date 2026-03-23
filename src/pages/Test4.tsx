import { useState, useEffect } from "react";

// 子组件 A：显示窗口尺寸
const ChildComponentA = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    console.log("ChildComponentA mounted");
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
      <h3 className="text-lg font-semibold text-purple-800 mb-4">子组件 A</h3>
      <div className="space-y-2">
        <div className="text-sm text-gray-600">宽度: <span className="font-bold text-purple-600">{windowSize.width}px</span></div>
        <div className="text-sm text-gray-600">高度: <span className="font-bold text-purple-600">{windowSize.height}px</span></div>
      </div>
    </div>
  );
};

// 子组件 B：显示窗口尺寸（不同样式）
const ChildComponentB = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    console.log("ChildComponentB mounted");
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
      <h3 className="text-lg font-semibold text-orange-800 mb-4">子组件 B</h3>
      <div className="space-y-2">
        <div className="text-sm text-gray-600">宽度: <span className="font-bold text-orange-600">{windowSize.width}px</span></div>
        <div className="text-sm text-gray-600">高度: <span className="font-bold text-orange-600">{windowSize.height}px</span></div>
      </div>
    </div>
  );
};

const Test4 = () => {
  const [activeComponent, setActiveComponent] = useState<"A" | "B">("A");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">窗口尺寸监听</h1>

        {/* 切换按钮 */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveComponent("A")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeComponent === "A"
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            显示组件 A
          </button>
          <button
            onClick={() => setActiveComponent("B")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeComponent === "B"
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            显示组件 B
          </button>
        </div>

        {/* 动态显示子组件 */}
        <div className="mb-8">
          {activeComponent === "A" ? <ChildComponentA /> : <ChildComponentB />}
        </div>

        <p className="text-gray-400 text-sm">尝试调整浏览器窗口大小，数值会实时更新</p>
      </div>
    </div>
  );
};

export default Test4;
