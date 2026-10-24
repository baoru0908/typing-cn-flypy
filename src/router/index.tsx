import { FC, lazy, useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';

const Monkey = lazy(() => import('@/views/monkey/Monkey'));
const English = lazy(() => import('@/views/english/English'));
const Code = lazy(() => import('@/views/code/Code'));
const Custom = lazy(() => import('@/views/custom/Custom'));

const Redirect: FC<{ to: string }> = ({ to }) => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(to);
    });
    return null;
};

const AppRouter: FC = () => {
    /**
     * react-router-dom@6+ 路由配置方式
     * https://github.com/remix-run/react-router/blob/main/docs/upgrading/v5.md#use-useroutes-instead-of-react-router-config
     *
     * 模式：中文双拼 / 英文 / 代码 / 自定义文本
     */
    const el = useRoutes([
        {
            path: '/',
            element: <Monkey />,
        },
        {
            path: '/monkey',
            element: <Monkey />,
        },
        {
            path: '/english',
            element: <English />,
        },
        {
            path: '/code',
            element: <Code />,
        },
        {
            path: '/custom',
            element: <Custom />,
        },
        {
            path: '*',
            element: <Redirect to="/" />,
        },
    ]);

    return el;
};

export default AppRouter;
