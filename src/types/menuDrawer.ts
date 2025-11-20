export const LOTTO_MENUS = [
  {
    id: 1,
    title: 'ទំព័រដើម',
    icon: 'home',
    path: 'Main',
    hasChild: false,
    isUrl:false
  },
  {
    id: 2,
    title: 'ភ្នាក់ងារ',
    icon: 'agent',
    end_point: 'client',
    path: 'BaseViewScreen',
    hasChild: false,
    isUrl:true
  },
  {
    id: 3,
    title: 'ប៉ុស្ត៏',
    icon: 'post',
    hasChild: true,
    children: [
      {
        id: '3-1',
        title: 'ប៉ុស្ត៏ ឆ្នោតសេដ្ឋី',
        path: 'BaseViewScreen',
        end_point: 'post/6',
        isUrl:true
      },
      {
        id: '3-2',
        title: 'ប៉ុស្ត៏ ឆ្នោតខ្មែរ​',
        path: 'BaseViewScreen',
        end_point: 'post/2',
        isUrl:true
      },
      {
        id: '3-3',
        path: 'BaseViewScreen',
        title: 'ប៉ុស្ត៏ ឆ្នោតវៀតណាម',
        end_point: 'post/1',
        isUrl:true
      },
    ],
  },
  {
    id: 4,
    title: 'សារី',
    icon: 'sary',
    path: 'BaseViewScreen',
    end_point: 'sary',
    hasChild: false,
    isUrl:true
  },
  {
    id: 5,
    title: 'ម៉ោងបិទ',
    icon: 'clock',
    path: 'BaseViewScreen',
    end_point: 'timeclose-lists',
    hasChild: false,
    isUrl:true
  },
  {
    id: 6,
    title: 'ផ្ទៀងលេខត្រូវ',
    icon: 'check',
    path: '/player',
    hasChild: true,
     children: [
      {
        id: '6-1',
        title: 'ផ្ទៀងលេខត្រូវ ឆ្នោតសេដ្ឋី',
        path: 'BaseViewScreen',
        end_point: 'checkresult/6',
        isUrl:true
      },
      {
        id: '6-2',
        title: 'ផ្ទៀងលេខត្រូវ ឆ្នោតខ្មែរ​',
        path: 'BaseViewScreen',
        end_point: 'checkresult/2',
        isUrl:true
      },
      {
        id: '6-3',
        title: 'ផ្ទៀងលេខត្រូវ ឆ្នោតវៀតណាម',
        path: 'BaseViewScreen',
        end_point: 'checkresult/1',
        isUrl:true
      },
    ],
  },
  {
    id: 7,
    title: 'ក្បាលបញ្ជី',
    icon: 'note',
    path: '/player',
    hasChild: true,
     children: [
      {
        id: '7-1',
        title: 'ក្បាលបញ្ជី ឆ្នោតសេដ្ឋី',
        path: 'BaseViewScreen',
        end_point: 'dailyReport/6',
        isUrl:true
      },
      {
        id: '7-2',
        title: 'ក្បាលបញ្ជី ឆ្នោតខ្មែរ​',
        path: 'BaseViewScreen',
        end_point: 'dailyReport/2',
        isUrl:true
      },
      {
        id: '7-3',
        title: 'ក្បាលបញ្ជី ឆ្នោតវៀតណាម',
        path: 'BaseViewScreen',
        end_point: 'dailyReport/1',
        isUrl:true
      },
    ],
  },
  {
    id: 8,
    title: 'ចាក់ឆ្នោត',
    icon: 'betting',
    path: '/player',
    hasChild: true,
     children: [
      {
        id: '8-1',
        title: 'ចាក់ឆ្នោត ឆ្នោតសេដ្ឋី',
        path: 'BettingScreen',
        end_point: 'sale/6',
        isUrl:true
      },
      {
        id: '8-2',
        title: 'ចាក់ឆ្នោត ឆ្នោតខ្មែរ​',
        path: 'BettingScreen',
        end_point: 'sale/2',
        isUrl:true
      },
      {
        id: '8-3',
        title: 'ចាក់ឆ្នោត ឆ្នោតវៀតណាម',
        path: 'BettingScreen',
        end_point: 'sale/1',
        isUrl:true
      },
    ],
  },
  {
    id: 9,
    title: 'របៀបចាក់',
    path: 'BaseViewScreen',
    icon: 'use',
    end_point: 'howtoplay',
    hasChild: false,
    isUrl:true
  },
  {
    id: 10,
    title: 'របៀបភ្ជាប់ម៉ាស៊ីន ព្រីន',
    icon: 'print',
    path: 'PrinterScreen',
    hasChild: false,
    isUrl:false
  },
  {
    id: 11,
    title: 'ចាកចេញ',
    icon: 'logout',
    path: '/logout',
    hasChild: false,
    isUrl:false,
    isLogout:true
  },
];
