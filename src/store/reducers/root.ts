/*
 * @Author: zhaoxuanzi
 * @Date: 2020-12-07 20:12:31
 * @LastEditors: zhaoxuanzi
 * @LastEditTime: 2021-01-28 19:00:25
 */
import { Word } from '@/words';
import storage from '@/utils/storage';

const UI_SCALE = 'UI_SCALE';
const UI_THEME = 'UI_THEME';
const HANZI_FONT = 'HANZI_FONT';
const WORDS_MODE = 'WORDS_MODE';
const COUNTDOWN_TIME = 'COUNTDOWN_TIME';
const CUSTOMER_WORDS = 'CUSTOMER_WORDS';
const BACK_IMG_URL = 'BACK_IMG_URL';
const INPUT_MODE = 'INPUT_MODE';

const _state = {
    uiScale: storage.local.get<string>(UI_SCALE) || 's',
    uiTheme: storage.local.get<string>(UI_THEME) || '',
    // 汉字字族: sans-思源黑体  kai-霞鹜文楷
    hanziFont: storage.local.get<string>(HANZI_FONT) || 'sans',
    wordsMode: storage.local.get<string>(WORDS_MODE) || '1',
    countdownTime: storage.local.get<string>(COUNTDOWN_TIME) || '60',
    customerWords: storage.local.get<Word[]>(CUSTOMER_WORDS) || [],
    backImgUrl: storage.local.get<string>(BACK_IMG_URL) || '',
    // 输入方案: 1-全拼 2-小鹤双拼
    inputMode: storage.local.get<string>(INPUT_MODE) || '1',
};
type State = typeof _state;

const reducer = {
    setUiScale: (state: State, payload: State['uiScale']): Partial<State> => {
        storage.local.set(UI_SCALE, payload);
        return { uiScale: payload };
    },
    setUiTheme: (state: State, payload: State['uiScale']): Partial<State> => {
        storage.local.set(UI_THEME, payload);
        return { uiTheme: payload };
    },
    setHanziFont: (state: State, payload: State['hanziFont']): Partial<State> => {
        storage.local.set(HANZI_FONT, payload);
        return { hanziFont: payload };
    },
    setWordsMode: (state: State, payload: State['wordsMode']): Partial<State> => {
        storage.local.set(WORDS_MODE, payload);
        return { wordsMode: payload };
    },
    setCountdownTime: (state: State, payload: State['countdownTime']): Partial<State> => {
        storage.local.set(COUNTDOWN_TIME, payload);
        return { countdownTime: payload };
    },
    saveCustomerWords: (state: State, payload: State['customerWords']): Partial<State> => {
        storage.local.set(CUSTOMER_WORDS, payload);
        return { customerWords: payload };
    },
    setBackImgUrl: (state: State, payload: State['backImgUrl']): Partial<State> => {
        storage.local.set(BACK_IMG_URL, payload);
        return { backImgUrl: payload };
    },
    setInputMode: (state: State, payload: State['inputMode']): Partial<State> => {
        storage.local.set(INPUT_MODE, payload);
        return { inputMode: payload };
    },
};

export default {
    state: _state,
    reducer,
};
