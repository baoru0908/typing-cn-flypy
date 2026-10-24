import React, { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';

import './App.less';
import AppRouter from './router';
import store, { $getState } from './store';
import { normalizeHanziFont } from './utils/env';
import { isColorClash } from './utils/color';

import Header from './components/header/Header';
import Footer from './components/footer/Footer';

/** 字号档位 + 汉字字族：写进 <html data-scale / data-hanzi>，由 tokens.less 消费 */
const ScaleBridge: React.FC = () => {
    useEffect(() => {
        const apply = () => {
            const { uiScale, hanziFont } = $getState().root;
            const scale = uiScale || 's';
            const hanzi = normalizeHanziFont(hanziFont);
            const el = document.documentElement;
            if (el.dataset.scale !== scale) el.dataset.scale = scale;
            if (el.dataset.hanzi !== hanzi) el.dataset.hanzi = hanzi;
        };
        apply();
        return store.subscribe(apply);
    }, []);
    return null;
};

/**
 * 主题语义校验：强调色与错误色撞色时（nothing / nothing-dark 两者同为红），
 * 写入 <html data-accent-clash="1">，由 tokens.less 把红色让给"错误"，
 * "正确"改用亮度表达 —— 否则打对和打错同色，错误完全看不出来。
 */
const AccentClashBridge: React.FC = () => {
    useEffect(() => {
        let timer = 0;
        const apply = () => {
            const cs = getComputedStyle(document.documentElement);
            const accent = cs.getPropertyValue('--primary-color').trim();
            const error = cs.getPropertyValue('--monkey-error-color').trim();
            const next = isColorClash(accent, error) ? '1' : '0';
            const el = document.documentElement;
            if (el.dataset.accentClash !== next) el.dataset.accentClash = next;
        };
        const schedule = () => {
            window.clearTimeout(timer);
            requestAnimationFrame(apply);
            // 单文件版的主题是替换 <style> 内容，不会触发 load，补一次延时兜底
            timer = window.setTimeout(apply, 120);
        };
        apply();
        schedule();
        const link = document.querySelector('#current-theme');
        link?.addEventListener('load', apply);
        const unsubscribe = store.subscribe(schedule);
        return () => {
            unsubscribe();
            window.clearTimeout(timer);
            link?.removeEventListener('load', apply);
        };
    }, []);
    return null;
};

const App: React.FC = () => (
    <Provider store={store}>
        <ScaleBridge />
        <AccentClashBridge />
        <div className="app-main">
            {/* HashRouter 不需要 basename; BrowserRouter 才需要 */}
            <Router>
                <Header />
                <Suspense fallback={<></>}>
                    <AppRouter />
                </Suspense>
                <Footer />
            </Router>
        </div>
    </Provider>
);

export default App;
