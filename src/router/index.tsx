import { FC, lazy, useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';

const Monkey = lazy(() => import('@/views/monkey/Monkey'));

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
     * 小鹤双拼版：仅保留模式2(计时)打字练习
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
            path: '*',
            element: <Redirect to="/" />,
        },
    ]);

    return el;
};

export default AppRouter;
