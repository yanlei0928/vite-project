import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';

// 封装按需加载包装函数
const lazyLoad = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component />
  </Suspense>
);

// 使用 React.lazy 实现代码分割（按需加载）
const Test1 = lazy(() => import('../pages/Test1'));
const Test2 = lazy(() => import('../pages/Test2'));
const Test3 = lazy(() => import('../pages/Test3'));
const Test4 = lazy(() => import('../pages/Test4'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/test1',
    element: lazyLoad(Test1),
  },
  {
    path: '/test2',
    element: lazyLoad(Test2),
  },
  {
    path: '/test3',
    element: lazyLoad(Test3),
  },
  {
    path: '/test4',
    element: lazyLoad(Test4),
  },
]);

export default router;
