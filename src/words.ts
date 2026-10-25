// auto generate
export interface Word {
    label: string;
    text: string;
}
const defaultWords: Word[] = [
    {
        label: '邮件',
        text: 'youjian',
    },
    {
        label: '离开',
        text: 'likai',
    },
    {
        label: '准备',
        text: 'zhunbei',
    },
    {
        label: '庆祝',
        text: 'qingzhu',
    },
    {
        label: '宿舍',
        text: 'sushe',
    },
    {
        label: '注意',
        text: 'zhuyi',
    },
    {
        label: '非常',
        text: 'feichang',
    },
    {
        label: '家庭',
        text: 'jiating',
    },
    {
        label: '去年',
        text: 'qunian',
    },
    {
        label: '点心',
        text: 'dianxin',
    },
    {
        label: '上课',
        text: 'shangke',
    },
    {
        label: '美丽',
        text: 'meili',
    },
    {
        label: '德国',
        text: 'deguo',
    },
    {
        label: '一定',
        text: 'yiding',
    },
    {
        label: '着急',
        text: 'zhaoji',
    },
    {
        label: '铅笔',
        text: 'qianbi',
    },
    {
        label: '痛苦',
        text: 'tongku',
    },
    {
        label: '必须',
        text: 'bixu',
    },
    {
        label: '病人',
        text: 'bingren',
    },
    {
        label: '现在',
        text: 'xianzai',
    },
    {
        label: '牛奶',
        text: 'niunai',
    },
    {
        label: '月亮',
        text: 'yueliang',
    },
    {
        label: '早上',
        text: 'zaoshang',
    },
    {
        label: '简单',
        text: 'jiandan',
    },
    {
        label: '瓶子',
        text: 'pingzi',
    },
    {
        label: '哥哥',
        text: 'gege',
    },
    {
        label: '音乐',
        text: 'yinyue',
    },
    {
        label: '筷子',
        text: 'kuaizi',
    },
    {
        label: '还是',
        text: 'haishi',
    },
    {
        label: '桌子',
        text: 'zhuozi',
    },
    {
        label: '看见',
        text: 'kanjian',
    },
    {
        label: '一边',
        text: 'yibian',
    },
    {
        label: '大声',
        text: 'dasheng',
    },
    {
        label: '风景',
        text: 'fengjing',
    },
    {
        label: '餐厅',
        text: 'canting',
    },
    {
        label: '木头',
        text: 'mutou',
    },
    {
        label: '新年',
        text: 'xinnian',
    },
    {
        label: '嘴巴',
        text: 'zuiba',
    },
    {
        label: '应该',
        text: 'yinggai',
    },
    {
        label: '过来',
        text: 'guolai',
    },
    {
        label: '今天',
        text: 'jintian',
    },
    {
        label: '真好',
        text: 'zhenhao',
    },
    {
        label: '奥利奥',
        text: 'aoliao',
    },
    {
        label: '键盘',
        text: 'jianpan',
    },
    {
        label: '真实',
        text: 'zhenshi',
    },
    {
        label: '优联',
        text: 'youlian',
    },
    {
        label: '蓝牙',
        text: 'lanya',
    },
    {
        label: '无线',
        text: 'wuxian',
    },
    {
        label: '三明治',
        text: 'sanmingzhi',
    },
    {
        label: '胶条',
        text: 'jiaotiao',
    },
    {
        label: '星夜',
        text: 'xingye',
    },
    {
        label: '奶油',
        text: 'naiyou',
    },
    {
        label: '熊猫',
        text: 'xiongmao',
    },
    {
        label: '可乐',
        text: 'kele',
    },
    {
        label: '海外',
        text: 'haiwai',
    },
    {
        label: '矩阵',
        text: 'juzhen',
    },
    {
        label: '塑料',
        text: 'suliao',
    },
    {
        label: '大骨',
        text: 'dagu',
    },
    {
        label: '营地',
        text: 'yingdi',
    },
    {
        label: '无限',
        text: 'wuxian',
    },
    {
        label: '虚拟',
        text: 'xuni',
    },
    {
        label: '电玩',
        text: 'dianwan',
    },
    {
        label: '徽章',
        text: 'huizhang',
    },
    {
        label: '北极圈',
        text: 'beijiquan',
    },
    {
        label: '仁王',
        text: 'renwang',
    },
    {
        label: '怪物',
        text: 'guaiwu',
    },
    {
        label: '猎人',
        text: 'lieren',
    },
    {
        label: '大佬',
        text: 'dalao',
    },
    {
        label: '开车',
        text: 'kaiche',
    },
    {
        label: '代组',
        text: 'daizu',
    },
    {
        label: '亚克力',
        text: 'yakeli',
    },
    {
        label: '黄铜',
        text: 'huangtong',
    },
    {
        label: '不锈钢',
        text: 'buxiugang',
    },
    {
        label: '铝锭',
        text: 'lüding',
    },
    {
        label: '注塑',
        text: 'zhusu',
    },
    {
        label: '菠萝',
        text: 'boluo',
    },
    {
        label: '霓虹',
        text: 'nihong',
    },
    {
        label: '螺丝',
        text: 'luosi',
    },
    {
        label: '卫星轴',
        text: 'weixingzhou',
    },
    {
        label: '红白机',
        text: 'hongbaiji',
    },
    {
        label: '幻影',
        text: 'huanying',
    },
    {
        label: '日文',
        text: 'riwen',
    },
    {
        label: '俄文',
        text: 'ewen',
    },
    {
        label: '键帽',
        text: 'jianmao',
    },
    {
        label: '套件',
        text: 'taojian',
    },
    {
        label: '碳纤维',
        text: 'tanxianwei',
    },
    {
        label: '玻纤',
        text: 'boxian',
    },
    {
        label: '热升华',
        text: 'reshenghua',
    },
    {
        label: '头发',
        text: 'toufa',
    },
    {
        label: '客厅',
        text: 'keting',
    },
    {
        label: '游泳池',
        text: 'youyongchi',
    },
    {
        label: '周末',
        text: 'zhoumo',
    },
    {
        label: '弟弟',
        text: 'didi',
    },
    {
        label: '可爱',
        text: 'keai',
    },
    {
        label: '鹦鹉',
        text: 'yingwu',
    },
    {
        label: '漂白',
        text: 'piaobai',
    },
    {
        label: '电泳',
        text: 'dianyong',
    },
    {
        label: '武士道',
        text: 'wushidao',
    },
    {
        label: '码农',
        text: 'manong',
    },
    {
        label: '脉冲',
        text: 'maichong',
    },
    {
        label: '蒸汽波',
        text: 'zhengqibo',
    },
    {
        label: '青柠',
        text: 'qingning',
    },
    {
        label: '声波',
        text: 'shengbo',
    },
    {
        label: '橄榄',
        text: 'ganlan',
    },
    {
        label: '前锋',
        text: 'qianfeng',
    },
    {
        label: '深空',
        text: 'shenkong',
    },
    {
        label: '原点',
        text: 'yuandian',
    },
    {
        label: '樱花',
        text: 'yinghua',
    },
    {
        label: '原厂',
        text: 'yuanchang',
    },
    {
        label: '静电容',
        text: 'jingdianrong',
    },
    {
        label: '抛光',
        text: 'paoguang',
    },
    {
        label: '佳达隆',
        text: 'jiadalong',
    },
    {
        label: '宁芝',
        text: 'ningzhi',
    },
    {
        label: '北极星',
        text: 'beijixing',
    },
    {
        label: '退烧',
        text: 'tuishao',
    },
    {
        label: '吃瓜',
        text: 'chigua',
    },
    {
        label: '解毒',
        text: 'jiedu',
    },
    {
        label: '摸鱼',
        text: 'moyu',
    },
    {
        label: '樱桃',
        text: 'yingtao',
    },
    {
        label: '树懒',
        text: 'shulan',
    },
    {
        label: '模拟',
        text: 'moni',
    },
    {
        label: '激光',
        text: 'jiguang',
    },
    {
        label: '阳极',
        text: 'yangji',
    },
    {
        label: '喷涂',
        text: 'pentu',
    },
    {
        label: '便当',
        text: 'biandang',
    },
    {
        label: '夜行者',
        text: 'yexingzhe',
    },
    {
        label: '锤头鲨',
        text: 'chuitousha',
    },
    {
        label: '核子',
        text: 'hezi',
    },
    {
        label: '涂改',
        text: 'tugai',
    },
    {
        label: '神佑',
        text: 'shenyou',
    },
    {
        label: '注音',
        text: 'zhuyin',
    },
    {
        label: '桃花',
        text: 'taohua',
    },
    {
        label: '暗黑',
        text: 'anhei',
    },
    {
        label: '海岸',
        text: 'haian',
    },
    {
        label: '巧克力',
        text: 'qiaokeli',
    },
    {
        label: '斯巴达',
        text: 'sibada',
    },
    {
        label: '鬼魂',
        text: 'guihun',
    },
    {
        label: '爆裂',
        text: 'baolie',
    },
    {
        label: '绿洲',
        text: 'lüzhou',
    },
    {
        label: '标本',
        text: 'biaoben',
    },
    {
        label: '巫妖',
        text: 'wuyao',
    },
    {
        label: '永恒',
        text: 'yongheng',
    },
    {
        label: '奶昔',
        text: 'naixi',
    },
    {
        label: '河马',
        text: 'hema',
    },
    {
        label: '使命',
        text: 'shiming',
    },
    {
        label: '召唤',
        text: 'zhaohuan',
    },
    {
        label: '黑色',
        text: 'heise',
    },
    {
        label: '行动',
        text: 'xingdong',
    },
    {
        label: '白色',
        text: 'baise',
    },
    {
        label: '牛头',
        text: 'niutou',
    },
    {
        label: '个性',
        text: 'gexing',
    },
    {
        label: '战神',
        text: 'zhanshen',
    },
    {
        label: '现代',
        text: 'xiandai',
    },
    {
        label: '战争',
        text: 'zhanzheng',
    },
    {
        label: '凯华',
        text: 'kaihua',
    },
    {
        label: '精微科',
        text: 'jingweike',
    },
    {
        label: '空间',
        text: 'kongjian',
    },
    {
        label: '东方',
        text: 'dongfang',
    },
    {
        label: '山水',
        text: 'shanshui',
    },
    {
        label: '微光',
        text: 'weiguang',
    },
    {
        label: '西装',
        text: 'xizhuang',
    },
    {
        label: '血缘',
        text: 'xueyuan',
    },
    {
        label: '诅咒',
        text: 'zuzhou',
    },
    {
        label: '钢板',
        text: 'gangban',
    },
    {
        label: '打卡',
        text: 'daka',
    },
    {
        label: '签到',
        text: 'qiandao',
    },
    {
        label: '上班',
        text: 'shangban',
    },
    {
        label: '双模',
        text: 'shuangmo',
    },
    {
        label: '单模',
        text: 'danmo',
    },
    {
        label: '划水',
        text: 'huashui',
    },
    {
        label: '外卖',
        text: 'waimai',
    },
    {
        label: '赞助',
        text: 'zanzhu',
    },
    {
        label: '打赏',
        text: 'dashang',
    },
    {
        label: '机械',
        text: 'jixie',
    },
    {
        label: '开关',
        text: 'kaiguan',
    },
    {
        label: '游戏',
        text: 'youxi',
    },
    {
        label: '无敌',
        text: 'wudi',
    },
    {
        label: '瞎眼',
        text: 'xiayan',
    },
    {
        label: '心态',
        text: 'xintai',
    },
    {
        label: '照片',
        text: 'zhaopian',
    },
    {
        label: '润滑',
        text: 'runhua',
    },
    {
        label: '联机',
        text: 'lianji',
    },
    {
        label: '配重',
        text: 'peizhong',
    },
    {
        label: '设计',
        text: 'sheji',
    },
    {
        label: '装饰',
        text: 'zhuangshi',
    },
    {
        label: '铭牌',
        text: 'mingpai',
    },
    {
        label: '定制',
        text: 'dingzhi',
    },
    {
        label: '独木舟',
        text: 'dumuzhou',
    },
    {
        label: '边牧',
        text: 'bianmu',
    },
    {
        label: '产品',
        text: 'chanpin',
    },
    {
        label: '鼠标',
        text: 'shubiao',
    },
    {
        label: '外设',
        text: 'waishe',
    },
    {
        label: '交流',
        text: 'jiaoliu',
    },
    {
        label: '磨砂',
        text: 'mosha',
    },
    {
        label: '透光',
        text: 'touguang',
    },
    {
        label: '打字',
        text: 'dazi',
    },
    {
        label: '玩具',
        text: 'wanju',
    },
    {
        label: '品牌',
        text: 'pinpai',
    },
    {
        label: '工作室',
        text: 'gongzuoshi',
    },
    {
        label: '快银轴',
        text: 'kuaiyinzhou',
    },
    {
        label: '磁轴',
        text: 'cizhou',
    },
    {
        label: '灰木轴',
        text: 'huimuzhou',
    },
    {
        label: '天空轴',
        text: 'tiankongzhou',
    },
    {
        label: '牛油果',
        text: 'niuyouguo',
    },
    {
        label: '奶油轴',
        text: 'naiyouzhou',
    },
    {
        label: '赤瞳轴',
        text: 'chitongzhou',
    },
    {
        label: '黄金轴',
        text: 'huangjinzhou',
    },
    {
        label: '白菜轴',
        text: 'baicaizhou',
    },
    {
        label: '豆腐轴',
        text: 'doufuzhou',
    },
    {
        label: '线性轴',
        text: 'xianxingzhou',
    },
    {
        label: '段落轴',
        text: 'duanluozhou',
    },
    {
        label: '静音轴',
        text: 'jingyinzhou',
    },
    {
        label: '提前触底',
        text: 'tiqianchudi',
    },
    {
        label: '触底行程',
        text: 'chudixingcheng',
    },
    {
        label: '初始压力',
        text: 'chushiyali',
    },
    {
        label: '触发压力',
        text: 'chufayali',
    },
    {
        label: '总行程',
        text: 'zonghangcheng',
    },
    {
        label: '弹簧音',
        text: 'tanhuangyin',
    },
    {
        label: '厂润',
        text: 'changrun',
    },
    {
        label: '个人润',
        text: 'gerenrun',
    },
    {
        label: '厚润',
        text: 'hourun',
    },
    {
        label: '薄膜',
        text: 'baomo',
    },
    {
        label: '声音包',
        text: 'shengyinbao',
    },
    {
        label: '夹心棉',
        text: 'jiaxinmian',
    },
    {
        label: '底棉',
        text: 'dimian',
    },
    {
        label: '轴下垫',
        text: 'zhouxiadian',
    },
    {
        label: '声优垫',
        text: 'shengyoudian',
    },
    {
        label: '开槽',
        text: 'kaicao',
    },
    {
        label: '原厂高度',
        text: 'yuanchanggaodu',
    },
    {
        label: '球帽',
        text: 'qiumao',
    },
    {
        label: '平帽',
        text: 'pingmao',
    },
    {
        label: '二色成型',
        text: 'ersechengxing',
    },
    {
        label: '激光雕刻',
        text: 'jiguangdiaoke',
    },
    {
        label: '五面热升华',
        text: 'wumianreshenghua',
    },
    {
        label: '侧刻',
        text: 'ceke',
    },
    {
        label: '正刻',
        text: 'zhengke',
    },
    {
        label: '无刻',
        text: 'wuke',
    },
    {
        label: '暗刻',
        text: 'anke',
    },
    {
        label: '字体包',
        text: 'zitibao',
    },
    {
        label: '字根',
        text: 'zigen',
    },
    {
        label: '适配器',
        text: 'shipeiqi',
    },
    {
        label: '增补',
        text: 'zengbu',
    },
    {
        label: '客制化',
        text: 'kezhihua',
    },
    {
        label: '量产键盘',
        text: 'liangchanjianpan',
    },
    {
        label: '公模',
        text: 'gongmo',
    },
    {
        label: '私模',
        text: 'simo',
    },
    {
        label: '船壳',
        text: 'chuanke',
    },
    {
        label: '上下盖',
        text: 'shangxiagai',
    },
    {
        label: '板簧',
        text: 'banhuang',
    },
    {
        label: '定位板',
        text: 'dingweiban',
    },
    {
        label: '黄铜定位',
        text: 'huangtongdingwei',
    },
    {
        label: '铝定位',
        text: 'lüdingwei',
    },
    {
        label: '碳纤定位',
        text: 'tanxiandingwei',
    },
    {
        label: '开槽定位',
        text: 'kaicaodingwei',
    },
    {
        label: '沉金',
        text: 'chenjin',
    },
    {
        label: '内胆',
        text: 'neidan',
    },
    {
        label: '外壳',
        text: 'waike',
    },
    {
        label: '阳极氧化',
        text: 'yangjiyanghua',
    },
    {
        label: '电泳漆',
        text: 'dianyongqi',
    },
    {
        label: '微喷',
        text: 'weipen',
    },
    {
        label: '水转印',
        text: 'shuizhuanyin',
    },
    {
        label: '拉丝',
        text: 'lasi',
    },
    {
        label: '喷砂',
        text: 'pensha',
    },
    {
        label: '三模连接',
        text: 'sanmolianjie',
    },
    {
        label: '有线模式',
        text: 'youxianmoshi',
    },
    {
        label: '蓝牙模式',
        text: 'lanyamoshi',
    },
    {
        label: '无线延迟',
        text: 'wuxianyanchi',
    },
    {
        label: '回报率',
        text: 'huibaolü',
    },
    {
        label: '全键无冲',
        text: 'quanjianwuchong',
    },
    {
        label: '六键无冲',
        text: 'liujianwuchong',
    },
    {
        label: '电池容量',
        text: 'dianchirongliang',
    },
    {
        label: '续航时间',
        text: 'xuhangshijian',
    },
    {
        label: '休眠策略',
        text: 'xiumiancelüe',
    },
    {
        label: '固件升级',
        text: 'gujianshengji',
    },
    {
        label: '驱动软件',
        text: 'qudongruanjian',
    },
    {
        label: '宏定义',
        text: 'hongdingyi',
    },
    {
        label: '宏录制',
        text: 'hongluzhi',
    },
    {
        label: '层切换',
        text: 'cengqiehuan',
    },
    {
        label: '阿米洛',
        text: 'amiluo',
    },
    {
        label: '斐尔可',
        text: 'feierke',
    },
    {
        label: '利奥博德',
        text: 'liaobode',
    },
    {
        label: '鸭子厂',
        text: 'yazichang',
    },
    {
        label: '龙豆',
        text: 'longdou',
    },
    {
        label: '客制化圈子',
        text: 'kezhihuaquanzi',
    },
    {
        label: '团长',
        text: 'tuanzhang',
    },
    {
        label: '开车团',
        text: 'kaichetuan',
    },
    {
        label: '拼团',
        text: 'pintuan',
    },
    {
        label: '现货',
        text: 'xianhuo',
    },
    {
        label: '期货',
        text: 'qihuo',
    },
    {
        label: '排单',
        text: 'paidan',
    },
    {
        label: '工期',
        text: 'gongqi',
    },
    {
        label: '翻车',
        text: 'fanche',
    },
    {
        label: '售后',
        text: 'shouhou',
    },
    {
        label: '质保',
        text: 'zhibao',
    },
    {
        label: '返修',
        text: 'fanxiu',
    },
    {
        label: '以旧换新',
        text: 'yijiuhuanxin',
    },
    {
        label: '上车',
        text: 'shangche',
    },
    {
        label: '下车',
        text: 'xiache',
    },
    {
        label: '抄作业',
        text: 'chaozuoye',
    },
    {
        label: '闭眼入',
        text: 'biyanru',
    },
    {
        label: '踩坑',
        text: 'caikeng',
    },
    {
        label: '真香',
        text: 'zhenxiang',
    },
    {
        label: '后悔',
        text: 'houhui',
    },
    {
        label: '纠结',
        text: 'jiujie',
    },
    {
        label: '凑合用',
        text: 'couheyong',
    },
    {
        label: '毕业',
        text: 'biye',
    },
    {
        label: '神价',
        text: 'shenjia',
    },
    {
        label: '骨折价',
        text: 'guzhejia',
    },
    {
        label: '韭菜',
        text: 'jiucai',
    },
    {
        label: '智商税',
        text: 'zhishangshui',
    },
    {
        label: '性价比',
        text: 'xingjiabi',
    },
    {
        label: '信仰充值',
        text: 'xinyangchongzhi',
    },
    {
        label: '钱包减肥',
        text: 'qianbaojianfei',
    },
    {
        label: '盲打',
        text: 'mangda',
    },
    {
        label: '指法',
        text: 'zhifa',
    },
    {
        label: '手速',
        text: 'shousu',
    },
    {
        label: '击键',
        text: 'jijian',
    },
    {
        label: '连击',
        text: 'lianji',
    },
    {
        label: '节奏感',
        text: 'jiezougan',
    },
    {
        label: '肌肉记忆',
        text: 'jiroujiyi',
    },
    {
        label: '手指跨度',
        text: 'shouzhikuadu',
    },
    {
        label: '手腕悬空',
        text: 'shouwanxuankong',
    },
    {
        label: '打字音',
        text: 'daziyin',
    },
    {
        label: '麻将音',
        text: 'majiangyin',
    },
    {
        label: '雨滴音',
        text: 'yudiyin',
    },
    {
        label: '石子音',
        text: 'shiziyin',
    },
    {
        label: '脆响',
        text: 'cuixiang',
    },
    {
        label: '闷响',
        text: 'menxiang',
    },
    {
        label: '空腔音',
        text: 'kongqiangyin',
    },
    {
        label: '调音',
        text: 'tiaoyin',
    },
    {
        label: '人体工学',
        text: 'rentigongxue',
    },
    {
        label: '倾斜角度',
        text: 'qingxiejiaodu',
    },
    {
        label: '掌托',
        text: 'zhangtuo',
    },
    {
        label: '手托',
        text: 'shoutuo',
    },
    {
        label: '腕托',
        text: 'wantuo',
    },
    {
        label: '分体键盘',
        text: 'fentijianpan',
    },
    {
        label: '紧凑配列',
        text: 'jincoupeilie',
    },
    {
        label: '九宫格',
        text: 'jiugongge',
    },
    {
        label: '小键盘',
        text: 'xiaojianpan',
    },
    {
        label: '功能区',
        text: 'gongnengqu',
    },
    {
        label: '编辑区',
        text: 'bianjiqu',
    },
    {
        label: '方向键',
        text: 'fangxiangjian',
    },
    {
        label: '配列',
        text: 'peilie',
    },
    {
        label: '键位数',
        text: 'jianweishu',
    },
    {
        label: '改键',
        text: 'gaijian',
    },
    {
        label: '刷固件',
        text: 'shuagujian',
    },
    {
        label: '写配置',
        text: 'xiepeizhi',
    },
    {
        label: '键位映射',
        text: 'jianweiyingshe',
    },
    {
        label: '组合键',
        text: 'zuhejian',
    },
    {
        label: '快捷键',
        text: 'kuaijiejian',
    },
    {
        label: '长按',
        text: 'changan',
    },
    {
        label: '双击触发',
        text: 'shuangjichufa',
    },
    {
        label: '轻点触发',
        text: 'qingdianchufa',
    },
    {
        label: '磁轴灵敏度',
        text: 'cizhoulingmindu',
    },
    {
        label: '快速触发',
        text: 'kuaisuchufa',
    },
    {
        label: '连续触发',
        text: 'lianxuchufa',
    },
];

export default defaultWords;
