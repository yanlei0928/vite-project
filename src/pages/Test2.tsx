import React from 'react';
import { Link } from 'react-router-dom';
import { useCounterStore } from '../store/useCounterStore';

const Test2: React.FC = () => {
  const count = useCounterStore((state) => state.count);

  return (
    <div className="p-8 text-center max-w-md mx-auto bg-gray-50 rounded-xl shadow-lg space-y-6 mt-10 border border-gray-200">
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        Test 2 页面
      </h1>
      <p className="text-gray-600">
        跨页面获取的共享 Count 值为: 
      </p>
      <div className="text-7xl font-black text-purple-600 drop-shadow-sm">
        {count}
      </div>
      
      <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
        <Link to="/" className="text-indigo-500 hover:text-indigo-700 font-medium underline underline-offset-4">返回首页</Link>
        <Link to="/test1" className="text-indigo-500 hover:text-indigo-700 font-medium underline underline-offset-4">前往 Test 1</Link>
      </div>
    </div>
  );
};

export default Test2;
