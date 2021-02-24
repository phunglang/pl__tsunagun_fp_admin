const URL_API_ADMIN = 'https://tsunagun-fp-api.gonosen.work/api/admin';
const URL_API = 'https://tsunagun-fp-api.gonosen.work/api';
const SEPARATOR_URL = '/';
const URL_API_LOGIN_ADMIN = URL_API_ADMIN + SEPARATOR_URL + 'login';

const URL_API_USER_LIST_ADMIN = URL_API_ADMIN + SEPARATOR_URL + 'users' + SEPARATOR_URL + 'listUser';
const PAGE_SIZE = 20;

const DATETIME_JP = {
    weekdayHeaderFormat: 'narrow',
    labelPrevYear: '昨年',
    labelPrevMonth: '先月',
    labelCurrentMonth: '今月',
    labelNextMonth: '来月',
    labelNextYear: '来年',
    labelToday: '現代',
    labelSelected: '選択した日付',
    labelNoDateSelected: '日付が選択されていません',
    labelCalendar: 'カレンダー',
    labelNav: 'カレンダーナビゲーション',
    labelHelp: 'カーソルキーを使用して日付を参照します'
};

export {
    URL_API_ADMIN,
    URL_API_LOGIN_ADMIN,
    URL_API_USER_LIST_ADMIN,
    PAGE_SIZE,
    URL_API,
    DATETIME_JP
};
