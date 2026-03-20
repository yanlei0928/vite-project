import React from 'react';
import { Link } from 'react-router-dom';
import { useCounterStore } from '../store/useCounterStore';

const Test1: React.FC = () => {
  const { count, increment, decrement } = useCounterStore();

  return (
    <div className="p-8 text-center max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h1 className="text-2xl font-bold text-gray-800">Test 1 页面 (Zustand Demo)</h1>
      <p className="text-gray-500">当前共享计数: <span className="text-blue-600 font-bold text-xl">{count}</span></p>
      
      <div className="flex justify-center gap-4 py-4">
        <button 
          onClick={decrement}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
        >- 减少</button>
        <button 
          onClick={increment}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition"
        >+ 增加</button>
      </div>

      <div className="flex justify-center gap-4 mt-6 border-t pt-4">
        <Link to="/" className="text-blue-500 hover:text-blue-700 font-medium">返回首页</Link>
        <Link to="/test2" className="text-blue-500 hover:text-blue-700 font-medium">前往 Test 2</Link>
      </div>
    </div>
  );
};

export default Test1;
