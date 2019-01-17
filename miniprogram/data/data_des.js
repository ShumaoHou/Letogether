// 目的地信息json数据
var desArray = [{
    name: "南京-夫子庙",
    imageUrl: "http://b1-q.mafengwo.net/s8/M00/5E/60/wKgBpVYDQVGAK_s4AAMKxIPZgHg21.jpeg?imageMogr2%2Fthumbnail%2F%21380x270r%2Fgravity%2FCenter%2Fcrop%2F%21380x270%2Fquality%2F100",
    intro: "南京夫子庙位于南京市秦淮区秦淮河北岸贡院街、江南贡院以西，即南京孔庙、南京文庙、文宣王庙，为供奉祭祀孔子之地，是中国第一所国家最高学府，也是中国四大文庙，为中国古代文化枢纽之地、金陵历史人文荟萃之地，不仅是明清时期南京的文教中心，同时也是居东南各省之冠的文教建筑群，现为夫子庙秦淮风光带重要组成部分。",
  },
  {
    name: "南京-中山陵",
    imageUrl: "http://n1-q.mafengwo.net/s7/M00/1B/B7/wKgB6lSVmIuAJElEAA3l2E8cUXY58.jpeg?imageMogr2%2Fthumbnail%2F%21690x370r%2Fgravity%2FCenter%2Fcrop%2F%21690x370%2Fquality%2F100",
    intro: "位于钟山风景区，孙中山先生的陵墓就安葬于此，在钟山中茅峰南麓，中山陵园风景区以此闻名。陵寝建筑中轴对称，从牌坊、墓道、陵门、碑亭到祭堂有392级石阶和平台10个，全部用白色花岗岩，再覆以蓝色玻璃瓦，宏伟大气。\n风景区内还有音乐台、行健亭、光化亭、流徽榭、藏经楼等多处纪念性建筑，都非常值得一游。\n陵寝免费参观，但需要提前预约入园时间，为了避免到场后无法约到当前时段的入场的门票，建议提前一天以上预约门票，其他景点会有门票，也可以买套票观光，景区内还有观光车，方便大家游览。",
  },
  {
    name: "南京-明孝陵",
    imageUrl: "http://p4-q.mafengwo.net/s7/M00/38/74/wKgB6lPDdk-ANa8nAAjkCipWbIU15.jpeg?imageMogr2%2Fthumbnail%2F%21690x450r%2Fgravity%2FCenter%2Fcrop%2F%21690x450%2Fquality%2F90%7Cwatermark%2F1%2Fimage%2FaHR0cDovL2I0LXEubWFmZW5nd28ubmV0L3MxMS9NMDAvNDQvOUIvd0tnQkVGc1A1UnlBRHY3cEFBQUhaWlVQUmxROTkwLnBuZw%3D%3D%2Fgravity%2FSouthEast%2Fdx%2F10%2Fdy%2F11",
    intro: "明孝陵是明太祖朱元璋与马皇后的陵墓，陵墓宏伟壮观，是我国古代最大的帝王陵寝之一。\n明孝陵前后历时38年才建成，开启了明、清两代帝陵的规制，现存的仅为陵园最后部分。\n陵园总体布局气魄恢宏，技艺高超，特别是明孝陵的神道长达2400米，曲折幽深。",
  },
  {
    name: "南京-南京大学(鼓楼校区)",
    imageUrl: "http://n4-q.mafengwo.net/s5/M00/BD/0C/wKgB3FFmxNiAcv05AAqtPMsXDH808.jpeg?imageMogr2%2Fthumbnail%2F%21690x370r%2Fgravity%2FCenter%2Fcrop%2F%21690x370%2Fquality%2F100",
    intro: "南京大学前身上可溯至源于汉后吴永安元年（258年）的南京太学，历史上曾历经多次变迁，是中国第一所现代大学。南京大学鼓楼校区为南京大学三大校区之一，全国重点文物保护单位金陵大学旧址所在地。汉口路将鼓楼校区划为南园、北园，南园是学生宿舍生活区，北园是教学科研区，北园金陵苑一带为中华传统风格建筑群。鼓楼校区有孙中山就任中华民国临时大总统时的故居，赛珍珠故居、何应钦故居（斗鸡闸）等。1952年南京大学由四牌楼迁往鼓楼办学，鼓楼校区也成为南京大学主校区，直至南京大学仙林校区启用。",
  },
  {
    name: "南京-总统府",
    imageUrl: "http://n2-q.mafengwo.net/s8/M00/EE/92/wKgBpVUVORCAdWiSAAxGoMTmgvs83.jpeg?imageMogr2%2Fthumbnail%2F%21690x370r%2Fgravity%2FCenter%2Fcrop%2F%21690x370%2Fquality%2F100",
    intro: "南京总统府迄今已有600多年历史，这里不仅是国民政府中央所在地，也见证着太平天国与两江总督衙门的兴衰。\n在这里，中西结合的院落，西式的办公楼，中式的花园，保留了江南古典园林一样的格局，亭台楼阁，小桥流水。\n总统府分三个区域，中区（中轴线）主要是国民政府总统府及所属机构。西区是孙中山的临时大总统办公室、秘书处和西花园，以及参谋本部等。东区主要是行政院旧址、马厩和东花园。一系列展馆和史料陈列，分布在这三个区域中。",
  },
  {
    name: "南京-古鸡鸣寺",
    imageUrl: "http://b1-q.mafengwo.net/s6/M00/5B/1B/wKgB4lMzaAKACJZrAAW2MX4ECTE21.jpeg?imageMogr2%2Fthumbnail%2F%21690x370r%2Fgravity%2FCenter%2Fcrop%2F%21690x370%2Fquality%2F100",
    intro: "鸡鸣寺始建于西晋，是南京最古老、香火最旺的佛寺之一。\n寺中环境十分幽雅，香火缭绕，左为施食台，台前为弥勒殿，其上是大雄宝殿和观音楼。\n寺的东北边有一口胭脂井，相传陈叔宝与其妃张丽华、孔贵嫔曾藏入井中，因为这段往事，很多游客慕名前来。\n通往鸡鸣寺前道路两旁的樱花尤其出名，每到清明时节，一片樱海，十分美丽。",
  },
  {
    name: "南京-玄武湖公园",
    imageUrl: "http://b4-q.mafengwo.net/s6/M00/43/6F/wKgB4lMyplGAWXAIAAR9jGCKpb087.jpeg?imageMogr2%2Fthumbnail%2F%21690x370r%2Fgravity%2FCenter%2Fcrop%2F%21690x370%2Fquality%2F100",
    intro: "玄武湖是中国最大的皇家园林湖泊，与嘉兴南湖、杭州西湖并称“江南三大名湖”。\n主要包括樱洲、梁洲、翠洲等五块绿洲，荟萃了许多的名胜古迹，现在是南京最大的文化休闲公园。\n春天适合游樱洲，能看到缀满枝头的樱花；这里还有荷花园，是看荷花、拍照的好去处。\n菱洲的台菱花架上能眺望钟山的景色；梁洲有盆景园、杜鹃园楼等景观，每年10月-11月左右会举办菊花展。\n此外，园内还有一处情侣园，有郁金香、桃花等多种植物，景色宜人，常有新人来此拍婚纱照。",
  },
  {
    name: "南京-雨花台",
    imageUrl: "http://p4-q.mafengwo.net/s5/M00/AD/25/wKgB3FF6RYiAW9veAAoObsV11Lk05.jpeg?imageMogr2%2Fthumbnail%2F%21690x370r%2Fgravity%2FCenter%2Fcrop%2F%21690x370%2Fquality%2F100",
    intro: "雨花台位于南京中华门南，由3个松柏环抱的秀丽山岗组成，是南京的红色旅游景点。\n整个景区分为烈士陵园区、名胜古迹区、雨花石文化区、雨花茶文化区、游乐活动区和生态密林区六大块。\n在革命烈士纪念馆和烈士事迹陈列馆，陈列了许多当年战士们的书籍，手稿，衣服，写作工具。\n园内葱葱郁郁，不仅是旅游胜地，也是南京市民休闲娱乐之所。",
  },
]

// 定义数据出口
module.exports = {
  desArray: desArray
}