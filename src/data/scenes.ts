export type Language = 'zh' | 'en' | 'de'

export type LocalizedText = Record<Language, string>
export type LocalizedList = Record<Language, string[]>

export type DimensionTone =
  | 'dreamfield'
  | 'browser'
  | 'bedroom'
  | 'pool'
  | 'mall'
  | 'backrooms'
  | 'soviet'
  | 'error'

export type DimensionSlug =
  | 'dreamfield'
  | 'browser-shrine'
  | 'silent-bedroom'
  | 'poolcore'
  | 'dead-mall'
  | 'backrooms'
  | 'post-soviet-signal'
  | 'error-shrine'

export type Dimension = {
  slug: string
  path: string
  tone: DimensionTone
  hidden?: boolean
  palette: [string, string, string, string]
  homePosition: {
    x: number
    y: number
    rotate: number
    scale: number
  }
  title: LocalizedText
  microLabel: LocalizedText
  coordinate: LocalizedText
  signal: LocalizedText
  ambientWords: LocalizedList
  visualMotifs: LocalizedList
  interactionMotifs: LocalizedList
  internetArtifacts: LocalizedList
  physicalArtifacts: LocalizedList
  overlayWords: LocalizedList
  crossLinks: DimensionSlug[]
  media: {
    still: string
    texture: string
    relic?: string
    illustration?: string
    overlay?: string
  }
}

export type ArchiveAsset = {
  id: string
  tone: DimensionTone | 'global'
  type: 'video' | 'image' | 'gif' | 'texture' | 'illustration'
  path: string
  label: LocalizedText
  source: string
}

export type PanelKind = 'visual' | 'interaction' | 'internet' | 'physical'

export const languages: Language[] = ['zh', 'en', 'de']

export const homePalette: [string, string, string, string] = [
  '#efe3d1',
  '#87bfe6',
  '#d8ffb2',
  '#17111f',
]

export const interfaceCopy = {
  brandStamp: {
    zh: '互联网梦装置',
    en: 'net dream apparatus',
    de: 'Netz-Traumapparat',
  },
  enter: {
    zh: '进入',
    en: 'enter',
    de: 'Eintreten',
  },
  returnHome: {
    zh: '返回漂移场',
    en: 'return to drift field',
    de: 'Zurück ins Driftfeld',
  },
  localeLabel: {
    zh: '语言',
    en: 'locale',
    de: 'Sprache',
  },
  hiddenRoute: {
    zh: '裂缝入口',
    en: 'fault seam',
    de: 'Riss-Eingang',
  },
  archiveLabel: {
    zh: '素材残片',
    en: 'material shards',
    de: 'Materialsplitter',
  },
  axesLabel: {
    zh: '非线性坐标',
    en: 'non-linear axes',
    de: 'Nichtlineare Achsen',
  },
  driftLabel: {
    zh: '漂移路由',
    en: 'drift routes',
    de: 'Drift-Routen',
  },
  homeSignal: {
    zh: '影像 / 漂移 / 微光',
    en: 'moving image / drift / glimmer',
    de: 'Bild / Drift / Schimmer',
  },
  homeWhisper: {
    zh: '停留 / 漫游 / 进入',
    en: 'linger / wander / enter',
    de: 'Verweilen / Treiben / Eintreten',
  },
  visualLabel: {
    zh: '视觉母题',
    en: 'visual motifs',
    de: 'Visuelle Motive',
  },
  interactionLabel: {
    zh: '交互母题',
    en: 'interaction motifs',
    de: 'Interaktionsmotive',
  },
  internetLabel: {
    zh: '互联网遗物',
    en: 'internet relics',
    de: 'Internet-Relikte',
  },
  physicalLabel: {
    zh: '现实遗物',
    en: 'physical relics',
    de: 'Materielle Relikte',
  },
  ambientLabel: {
    zh: '环境残响',
    en: 'ambient residue',
    de: 'Raum-Nachhall',
  },
  bootStamp: {
    zh: 'IAN / 动态影像 / 现场循环',
    en: 'IAN / moving image / live loop',
    de: 'IAN / Bewegtes Bild / Live-Schleife',
  },
  bootReady: {
    zh: '上滑 / 滚动 / 点击 开启',
    en: 'swipe / scroll / click to enter',
    de: 'Wischen / Scrollen / Klicken / Öffnen',
  },
  exploreStart: {
    zh: '开始探索',
    en: 'start exploring',
    de: 'Erkundung starten',
  },
  sceneConceptLabel: {
    zh: '概念记录',
    en: 'concept log',
    de: 'Konzeptprotokoll',
  },
  sceneArchiveLabel: {
    zh: '档案轨道',
    en: 'archive tracks',
    de: 'Archiv-Spuren',
  },
} satisfies Record<string, LocalizedText>

export const homeAxes: LocalizedList = {
  zh: ['温度轴', '液态轴', '制度轴', '失真轴'],
  en: ['temperature axis', 'liquid axis', 'civic axis', 'rupture axis'],
  de: ['Temperatur-Achse', 'Flüssigkeits-Achse', 'Ordnungs-Achse', 'Riss-Achse'],
}

export const homeGhostWords: LocalizedList = {
  zh: ['IAN', '影像', '微光', '漂移', '薄雾'],
  en: ['IAN', 'moving image', 'glimmer', 'drift', 'haze'],
  de: ['IAN', 'Bild', 'Schimmer', 'Drift', 'Dunst'],
}

export const dimensions: Dimension[] = [
  {
    slug: 'dreamfield',
    path: '/dreamfield',
    tone: 'dreamfield',
    palette: ['#efe8d8', '#96cfff', '#d3ffaf', '#1c1624'],
    homePosition: { x: 14, y: 27, rotate: -8, scale: 1.03 },
    title: {
      zh: '梦野',
      en: 'Dream Field',
      de: 'Traum-Feld',
    },
    microLabel: {
      zh: '软晴缓存',
      en: 'soft weather cache',
      de: 'Weicher Wetter-Cache',
    },
    coordinate: {
      zh: '扇区 01 / 软草白昼',
      en: 'sector 01 / soft lawn',
      de: 'Sektor 01 / Weicher Rasen',
    },
    signal: {
      zh: '塑料白昼 / 低清云层 / 软草回声',
      en: 'plastic noon / low-res cloud / lawn echo',
      de: 'Plastikmittag / Low-Res-Wolke / Rasen-Echo',
    },
    ambientWords: {
      zh: ['糖壳天空', '云层缓存', '浅草回声', '静态午后'],
      en: ['sugar-shell sky', 'cloud cache', 'soft lawn echo', 'static noon'],
      de: ['Zuckerhimmel', 'Wolken-Cache', 'Rasen-Echo', 'Stiller Mittag'],
    },
    visualMotifs: {
      zh: ['塑料云', '桌面壁纸', '奶油亮边', '虚假晴朗'],
      en: ['plastic clouds', 'desktop wallpaper', 'cream edge glow', 'false clear air'],
      de: ['Plastikwolken', 'Desktop-Tapete', 'Creme-Leuchten', 'Falsche Klarheit'],
    },
    interactionMotifs: {
      zh: ['漂浮显影', '缓慢靠近', '贴纸入口', '软性偏移'],
      en: ['floating reveals', 'slow approach', 'sticker portals', 'soft offset'],
      de: ['Schwebende Enthüllung', 'Langsames Nähern', 'Sticker-Portale', 'Weicher Versatz'],
    },
    internetArtifacts: {
      zh: ['访客计数器', '云桌面', '星标链接', '过期图标'],
      en: ['visitor counter', 'cloud desktop', 'star links', 'expired icons'],
      de: ['Besucherzähler', 'Wolken-Desktop', 'Stern-Links', 'Veraltete Icons'],
    },
    physicalArtifacts: {
      zh: ['塑料贴纸', '窗帘光痕', 'CD 虹彩', '儿童玩具壳'],
      en: ['plastic stickers', 'curtain glow', 'cd iridescence', 'toy shells'],
      de: ['Plastiksticker', 'Vorhangglanz', 'CD-Schimmer', 'Spielzeughüllen'],
    },
    overlayWords: {
      zh: ['薄云', '静晴', '低像素', '轻草', '暖白'],
      en: ['thin cloud', 'clear hush', 'low pixel', 'soft grass', 'warm white'],
      de: ['Dünnwolke', 'Klare Stille', 'Low-Pixel', 'Weiches Gras', 'Warmweiß'],
    },
    crossLinks: ['browser-shrine', 'poolcore', 'silent-bedroom'],
    media: {
      still: '/media/IMG_2433.jpg',
      texture: '/media/textures/Plastic017A_1K-JPG_Color.jpg',
      relic: '/media/clouds-timelapse.webm',
      illustration: '/media/found/computer-monitor-simulated.jpg',
      overlay: '/media/ian-noise-veil.gif',
    },
  },
  {
    slug: 'browser-shrine',
    path: '/browser-shrine',
    tone: 'browser',
    palette: ['#f5d5ab', '#9fd4ff', '#fff1ce', '#23191a'],
    homePosition: { x: 72, y: 20, rotate: 7, scale: 0.98 },
    title: {
      zh: '浏览器圣殿',
      en: 'Browser Shrine',
      de: 'Browser-Schrein',
    },
    microLabel: {
      zh: '索引祭坛',
      en: 'index altar',
      de: 'Index-Altar',
    },
    coordinate: {
      zh: '扇区 02 / 门户尘埃',
      en: 'sector 02 / portal dust',
      de: 'Sektor 02 / Portalstaub',
    },
    signal: {
      zh: '按钮铬 / 客簿光 / 门户尘',
      en: 'button chrome / guest glow / portal dust',
      de: 'Button-Chrom / Gästebuchglanz / Portalstaub',
    },
    ambientWords: {
      zh: ['检索钟声', '门户尘', '客簿余温', '旧网呼吸'],
      en: ['search chime', 'portal dust', 'guestbook heat', 'old web breath'],
      de: ['Suchglocke', 'Portalstaub', 'Gästebuchwärme', 'Altes Netzatmen'],
    },
    visualMotifs: {
      zh: ['按钮镀铬', 'marquee 幻影', '网页徽章', '链接花粉'],
      en: ['button chrome', 'marquee ghosts', 'web badges', 'link pollen'],
      de: ['Button-Chrom', 'Marquee-Geister', 'Web-Abzeichen', 'Link-Pollen'],
    },
    interactionMotifs: {
      zh: ['遗物点击', '编号闪烁', '路径误导', '旧页唤醒'],
      en: ['relic clicks', 'digit flicker', 'path misdirection', 'page wake-up'],
      de: ['Relikt-Klicks', 'Ziffernflackern', 'Pfad-Irrtum', 'Seitenweckung'],
    },
    internetArtifacts: {
      zh: ['guestbook', 'webring', 'under construction', '搜索框'],
      en: ['guestbook', 'webring', 'under construction', 'search field'],
      de: ['Gästebuch', 'Webring', 'Under Construction', 'Suchfeld'],
    },
    physicalArtifacts: {
      zh: ['透明胶带', '旧显示器壳', '票据纸', '泛黄标签'],
      en: ['clear tape', 'monitor shell', 'receipt paper', 'aged labels'],
      de: ['Klebeband', 'Monitorgehäuse', 'Bonpapier', 'Vergilbte Etiketten'],
    },
    overlayWords: {
      zh: ['index', 'guest', 'ring', 'cache', 'trace'],
      en: ['index', 'guest', 'ring', 'cache', 'trace'],
      de: ['Index', 'Gast', 'Ring', 'Cache', 'Spur'],
    },
    crossLinks: ['dreamfield', 'dead-mall', 'error-shrine'],
    media: {
      still: '/media/found/browser-mosaic.png',
      texture: '/media/textures/Plastic017A_1K-JPG_Color.jpg',
      relic: '/media/found/installing-windows-95.jpg',
      illustration: '/media/found/vintage-computer-arrangement.jpg',
      overlay: '/media/found/dots-glitch.gif',
    },
  },
  {
    slug: 'silent-bedroom',
    path: '/silent-bedroom',
    tone: 'bedroom',
    palette: ['#cfd3ff', '#f0ccbf', '#fff4e7', '#141424'],
    homePosition: { x: 27, y: 66, rotate: -6, scale: 1.04 },
    title: {
      zh: '静默卧室',
      en: 'Silent Bedroom',
      de: 'Stilles Zimmer',
    },
    microLabel: {
      zh: '待机夜层',
      en: 'standby night layer',
      de: 'Standby-Nachtschicht',
    },
    coordinate: {
      zh: '扇区 03 / 屏幕静夜',
      en: 'sector 03 / screen hush',
      de: 'Sektor 03 / Bildschirmruhe',
    },
    signal: {
      zh: '待机蓝 / 灯丝低温 / 布面阴影',
      en: 'standby blue / lamp hush / fabric shadow',
      de: 'Standby-Blau / Lampenstille / Stoffschatten',
    },
    ambientWords: {
      zh: ['夜灯壳', '布料阴影', '地毯静电', '轻蓝待机'],
      en: ['night lamp shell', 'fabric shadows', 'carpet static', 'blue standby'],
      de: ['Nachtlampe', 'Stoffschatten', 'Teppichknistern', 'Blaues Standby'],
    },
    visualMotifs: {
      zh: ['半开窗帘', '旧屏余光', '布面褶痕', '低亮蓝'],
      en: ['half curtain', 'screen residue', 'fabric folds', 'low blue glow'],
      de: ['Halber Vorhang', 'Bildschirmrest', 'Stofffalten', 'Dunkelblaues Glimmen'],
    },
    interactionMotifs: {
      zh: ['呼吸悬停', '慢速点亮', '边缘显影', '轻柔回弹'],
      en: ['breathing hover', 'slow illumination', 'edge reveal', 'soft rebound'],
      de: ['Schwebender Atem', 'Langsames Leuchten', 'Kanten-Enthüllung', 'Weicher Rückprall'],
    },
    internetArtifacts: {
      zh: ['屏保', '像素时钟', 'IM 残影', '离线状态'],
      en: ['screensaver', 'pixel clock', 'IM afterimage', 'offline badge'],
      de: ['Bildschirmschoner', 'Pixeluhr', 'IM-Nachbild', 'Offline-Symbol'],
    },
    physicalArtifacts: {
      zh: ['台灯', '床单', '风扇声', '地毯绒面'],
      en: ['table lamp', 'bedsheet', 'fan hum', 'carpet pile'],
      de: ['Tischlampe', 'Bettlaken', 'Ventilatorbrummen', 'Teppichflor'],
    },
    overlayWords: {
      zh: ['待机', '织物', '热度', '静电', '窗影'],
      en: ['standby', 'fabric', 'heat', 'static', 'window shadow'],
      de: ['Standby', 'Stoff', 'Wärme', 'Statik', 'Fensterschatten'],
    },
    crossLinks: ['dreamfield', 'poolcore', 'backrooms'],
    media: {
      still: '/media/IMG_2435.jpg',
      texture: '/media/IMG_2428.jpg',
      relic: '/media/found/old-tv.jpg',
      illustration: '/media/found/basement-desk.jpg',
      overlay: '/media/ian-noise-veil.gif',
    },
  },
  {
    slug: 'poolcore',
    path: '/poolcore',
    tone: 'pool',
    palette: ['#9ee4f0', '#f4ffff', '#96b6f1', '#092437'],
    homePosition: { x: 68, y: 60, rotate: 5, scale: 1.02 },
    title: {
      zh: '池核',
      en: 'Pool Core',
      de: 'Pool-Core',
    },
    microLabel: {
      zh: '回声水室',
      en: 'echo basin',
      de: 'Echo-Becken',
    },
    coordinate: {
      zh: '扇区 04 / 瓷砖深度',
      en: 'sector 04 / tile depth',
      de: 'Sektor 04 / Kacheltiefe',
    },
    signal: {
      zh: '氯光 / 空池 / 湿回声',
      en: 'chlorine glow / empty pool / wet echo',
      de: 'Chlorlicht / Leerbecken / Nassechos',
    },
    ambientWords: {
      zh: ['潮湿镜面', '白灯反射', '空池回声', '蓝绿雾层'],
      en: ['wet mirror', 'white lamp reflection', 'empty pool echo', 'blue-green haze'],
      de: ['Nasser Spiegel', 'Weißlicht-Reflex', 'Leerbecken-Echo', 'Blaugrüner Nebel'],
    },
    visualMotifs: {
      zh: ['液态文字', '水面反折', '瓷砖缝线', '浅氯光'],
      en: ['liquid text', 'surface refraction', 'tile seams', 'chlorine glow'],
      de: ['Flüssiger Text', 'Oberflächenbruch', 'Kachelfugen', 'Chlorlicht'],
    },
    interactionMotifs: {
      zh: ['浮膜入口', '倒影按钮', '缓慢折射', '湿感拖尾'],
      en: ['membrane portals', 'reflection buttons', 'slow refraction', 'wet trails'],
      de: ['Membran-Portale', 'Spiegel-Buttons', 'Langsame Brechung', 'Nasse Spuren'],
    },
    internetArtifacts: {
      zh: ['半透明状态条', '液态光标', '蓝色载入条', '镜像标签'],
      en: ['translucent status bars', 'liquid cursor', 'blue loading bars', 'mirrored labels'],
      de: ['Transparente Statusleisten', 'Flüssiger Cursor', 'Blaue Ladebalken', 'Spiegel-Labels'],
    },
    physicalArtifacts: {
      zh: ['泳池扶手', '瓷砖', '池灯', '水汽玻璃'],
      en: ['pool rails', 'tiles', 'pool lamps', 'steamed glass'],
      de: ['Poolgeländer', 'Kacheln', 'Poollampen', 'Beschlagene Scheibe'],
    },
    overlayWords: {
      zh: ['氯', '回声', '薄水', '反射', '冷白'],
      en: ['chlorine', 'echo', 'thin water', 'reflection', 'cold white'],
      de: ['Chlor', 'Echo', 'Dünnwasser', 'Spiegelung', 'Kaltweiß'],
    },
    crossLinks: ['dreamfield', 'silent-bedroom', 'backrooms'],
    media: {
      still: '/media/IMG_2426.jpg',
      texture: '/media/textures/Tiles096_1K-JPG_Color.jpg',
      relic: '/media/found/poolcore-interior.jpg',
      illustration: '/media/IMG_2424.jpg',
      overlay: '/media/111.gif',
    },
  },
  {
    slug: 'dead-mall',
    path: '/dead-mall',
    tone: 'mall',
    palette: ['#f3d0c4', '#ffd593', '#fff7ef', '#211521'],
    homePosition: { x: 85, y: 47, rotate: -4, scale: 1.01 },
    title: {
      zh: '空商城',
      en: 'Dead Mall',
      de: 'Mall-Ruine',
    },
    microLabel: {
      zh: '消费幻影',
      en: 'consumer mirage',
      de: 'Konsum-Mirage',
    },
    coordinate: {
      zh: '扇区 05 / 灯箱中庭',
      en: 'sector 05 / lightbox atrium',
      de: 'Sektor 05 / Leuchtkasten-Atrium',
    },
    signal: {
      zh: '灯箱灰 / 空中庭 / 假出口',
      en: 'lightbox dust / vacant atrium / false exit',
      de: 'Leuchtkastengrau / Leeres Atrium / Falscher Ausgang',
    },
    ambientWords: {
      zh: ['玻璃扶梯', '灯箱粉尘', '假石地面', '中庭回空'],
      en: ['glass rails', 'lightbox dust', 'fake stone floor', 'atrium vacancy'],
      de: ['Glasgeländer', 'Leuchtkastenstaub', 'Kunststeinboden', 'Atriumsleere'],
    },
    visualMotifs: {
      zh: ['导视箭头', '商场粉色', '空橱窗', '香槟色回光'],
      en: ['wayfinding arrows', 'mall pink', 'vacant vitrines', 'champagne glare'],
      de: ['Wegpfeile', 'Mall-Rosa', 'Leere Vitrinen', 'Champagnerschimmer'],
    },
    interactionMotifs: {
      zh: ['误导路牌', '亮面跳转', '中庭回响', '假出口'],
      en: ['misleading signage', 'gloss jumps', 'atrium echoes', 'false exits'],
      de: ['Irrweg-Schilder', 'Glanzsprünge', 'Atrium-Echos', 'Falsche Ausgänge'],
    },
    internetArtifacts: {
      zh: ['促销横幅', '导览界面', '楼层按钮', '电子指示牌'],
      en: ['sale banners', 'directory UI', 'floor buttons', 'digital signs'],
      de: ['Verkaufsbanner', 'Leitsystem-UI', 'Etagenbuttons', 'Digitale Schilder'],
    },
    physicalArtifacts: {
      zh: ['玻璃栏杆', '假植物', '大理石纹', '扶梯口'],
      en: ['glass balustrades', 'fake plants', 'marble veins', 'escalator mouths'],
      de: ['Glasbrüstung', 'Kunstpflanzen', 'Marmoradern', 'Rolltreppenmund'],
    },
    overlayWords: {
      zh: ['atrium', 'sale', 'vacancy', 'level', 'lightbox'],
      en: ['atrium', 'sale', 'vacancy', 'level', 'lightbox'],
      de: ['Atrium', 'Sale', 'Leere', 'Level', 'Leuchtkasten'],
    },
    crossLinks: ['browser-shrine', 'backrooms', 'post-soviet-signal'],
    media: {
      still: '/media/found/mall-atrium.jpg',
      texture: '/media/textures/Concrete013_1K-JPG_Color.jpg',
      relic: '/media/found/dead-mall-interior.jpg',
      illustration: '/media/found/abandoned-mall.jpg',
      overlay: '/media/found/dots-glitch.gif',
    },
  },
  {
    slug: 'backrooms',
    path: '/backrooms',
    tone: 'backrooms',
    palette: ['#d7d08d', '#918968', '#fff9ca', '#201b10'],
    homePosition: { x: 43, y: 79, rotate: 4, scale: 1.06 },
    title: {
      zh: '后室',
      en: 'Back Rooms',
      de: 'Backrooms',
    },
    microLabel: {
      zh: '重复空间',
      en: 'repeat chamber',
      de: 'Wiederholungsraum',
    },
    coordinate: {
      zh: '扇区 06 / 荧光走廊',
      en: 'sector 06 / fluorescent corridor',
      de: 'Sektor 06 / Fluoreszenzflur',
    },
    signal: {
      zh: '荧光嗡鸣 / 重复门口 / 错误尺度',
      en: 'fluorescent hum / repeated doorway / wrong scale',
      de: 'Leuchtstoffbrumm / Wiederholte Türen / Falscher Maßstab',
    },
    ambientWords: {
      zh: ['空调嗡鸣', '重复门口', '旧黄灯', '墙体偏差'],
      en: ['air-condition hum', 'repeated doorways', 'yellow tubes', 'wall drift'],
      de: ['Klimabrummen', 'Wiederholte Türen', 'Gelbe Röhren', 'Wanddrift'],
    },
    visualMotifs: {
      zh: ['荧光黄雾', '错误尺度', '办公残壳', '消失角落'],
      en: ['fluorescent haze', 'wrong scale', 'office husks', 'vanishing corners'],
      de: ['Leuchtgelber Nebel', 'Falscher Maßstab', 'Bürohüllen', 'Verschwindende Ecken'],
    },
    interactionMotifs: {
      zh: ['延迟入口', '编号重复', '轻微迷路', '方向不可信'],
      en: ['delayed portals', 'repeating numbers', 'gentle disorientation', 'unreliable direction'],
      de: ['Verspätete Portale', 'Wiederholte Nummern', 'Sanfte Desorientierung', 'Unzuverlässige Richtung'],
    },
    internetArtifacts: {
      zh: ['失败表单', '加载中断', '错误弹窗', '重复字段'],
      en: ['failed forms', 'broken loaders', 'error modals', 'duplicate fields'],
      de: ['Fehlformulare', 'Abgebrochene Loader', 'Fehlerfenster', 'Doppelte Felder'],
    },
    physicalArtifacts: {
      zh: ['地毯', '吊顶板', '隔墙', '白炽噪光'],
      en: ['carpet', 'ceiling panels', 'partition walls', 'fluorescent wash'],
      de: ['Teppich', 'Deckenplatten', 'Trennwände', 'Leuchtstoffflut'],
    },
    overlayWords: {
      zh: ['unit', 'panel', 'repeat', 'hum', 'exit?'],
      en: ['unit', 'panel', 'repeat', 'hum', 'exit?'],
      de: ['Einheit', 'Panel', 'Wiederholung', 'Brummen', 'Ausgang?'],
    },
    crossLinks: ['silent-bedroom', 'dead-mall', 'error-shrine'],
    media: {
      still: '/media/IMG_2429.jpg',
      texture: '/media/textures/Concrete013_1K-JPG_Color.jpg',
      relic: '/media/IMG_2427.jpg',
      illustration: '/media/found/fluorescent-panel.jpg',
      overlay: '/media/ian-noise-veil.gif',
    },
  },
  {
    slug: 'post-soviet-signal',
    path: '/post-soviet-signal',
    tone: 'soviet',
    palette: ['#93acd0', '#8d7470', '#e9edf4', '#121821'],
    homePosition: { x: 55, y: 33, rotate: -5, scale: 1.02 },
    title: {
      zh: '后苏联信号',
      en: 'Post-Soviet Signal',
      de: 'Post-Sowjet-Signal',
    },
    microLabel: {
      zh: '冬夜设施',
      en: 'winter facility',
      de: 'Winter-Anlage',
    },
    coordinate: {
      zh: '扇区 07 / 混凝土夜色',
      en: 'sector 07 / concrete night',
      de: 'Sektor 07 / Betonnacht',
    },
    signal: {
      zh: '冷站牌 / 混凝土 / 夜色电流',
      en: 'cold bus stop / concrete / night current',
      de: 'Kalte Haltestelle / Beton / Nachtstrom',
    },
    ambientWords: {
      zh: ['冬夜广场', '铁锈边缘', '冷站牌', '电视雪花'],
      en: ['winter plaza', 'rust edge', 'cold station signs', 'television snow'],
      de: ['Winterplatz', 'Rostkante', 'Kalte Haltestellen', 'Fernsehschnee'],
    },
    visualMotifs: {
      zh: ['混凝土立面', '冰蓝阴影', '硬字幕', '集体夜色'],
      en: ['concrete facades', 'ice-blue shade', 'hard subtitles', 'collective night'],
      de: ['Betonfassaden', 'Eisblauer Schatten', 'Harte Untertitel', 'Kollektivnacht'],
    },
    interactionMotifs: {
      zh: ['硬切显影', '设施唤醒', '冷色脉冲', '远程开关'],
      en: ['hard cuts', 'facility wake-up', 'cold pulses', 'remote switches'],
      de: ['Harte Schnitte', 'Anlagenweckung', 'Kalte Pulse', 'Fernschalter'],
    },
    internetArtifacts: {
      zh: ['监控式界面', '粗粝状态框', '广播编号', '老式菜单'],
      en: ['surveillance UI', 'rough status boxes', 'broadcast numbers', 'aged menus'],
      de: ['Überwachungs-UI', 'Raue Statusfelder', 'Sendernummern', 'Alte Menüs'],
    },
    physicalArtifacts: {
      zh: ['公寓楼', '公交站', '旧电视', '广场灯杆'],
      en: ['apartment blocks', 'bus stops', 'old televisions', 'plaza lamps'],
      de: ['Plattenbauten', 'Bushaltestellen', 'Alte Fernsehgeräte', 'Platzlampen'],
    },
    overlayWords: {
      zh: ['block', 'winter', 'district', 'antenna', 'voltage'],
      en: ['block', 'winter', 'district', 'antenna', 'voltage'],
      de: ['Block', 'Winter', 'Bezirk', 'Antenne', 'Spannung'],
    },
    crossLinks: ['dead-mall', 'browser-shrine', 'error-shrine'],
    media: {
      still: '/media/found/post-soviet-apartments.jpg',
      texture: '/media/textures/Concrete013_1K-JPG_Color.jpg',
      illustration: '/media/found/moscow-bus-stop.jpg',
      relic: '/media/found/soviet-tv-minsk.jpg',
      overlay: '/media/222.gif',
    },
  },
  {
    slug: 'error-shrine',
    path: '/error-shrine',
    tone: 'error',
    hidden: true,
    palette: ['#d5ff4f', '#ff5f66', '#45e7ff', '#09060d'],
    homePosition: { x: 50, y: 50, rotate: 0, scale: 1 },
    title: {
      zh: '错误圣龛',
      en: 'Error Shrine',
      de: 'Fehler-Schrein',
    },
    microLabel: {
      zh: '故障峰值',
      en: 'rupture peak',
      de: 'Riss-Gipfel',
    },
    coordinate: {
      zh: '隐藏扇区 / 酸性断层',
      en: 'hidden sector / acid fracture',
      de: 'Verborgener Sektor / Säureriss',
    },
    signal: {
      zh: '酸性字块 / 断帧 / 反相火花',
      en: 'acid type / split frame / inverted spark',
      de: 'Säureschrift / Rissbild / Invertfunke',
    },
    ambientWords: {
      zh: ['酸银', '裂帧', '高压字块', '反向界面'],
      en: ['acid silver', 'split frames', 'high-voltage type', 'inverted UI'],
      de: ['Säuresilber', 'Rissbilder', 'Hochspannungs-Schrift', 'Invertierte UI'],
    },
    visualMotifs: {
      zh: ['RGB 裂缝', '字物化', '反相警示', '极端切层'],
      en: ['rgb fissures', 'text sculpture', 'inverted warnings', 'extreme slicing'],
      de: ['RGB-Risse', 'Textskulptur', 'Invertierte Warnungen', 'Extremschnitte'],
    },
    interactionMotifs: {
      zh: ['不稳定入口', '闪断过场', '撕裂切换', '随机偏移'],
      en: ['unstable portals', 'flash cuts', 'tear transitions', 'random offsets'],
      de: ['Instabile Portale', 'Blitzschnitte', 'Riss-Übergänge', 'Zufallsversatz'],
    },
    internetArtifacts: {
      zh: ['崩坏窗口', '错位状态条', '像素断片', '扫描噪声'],
      en: ['collapsed windows', 'misaligned bars', 'pixel shards', 'scan noise'],
      de: ['Zerfallene Fenster', 'Versetzte Balken', 'Pixelbruch', 'Scanrauschen'],
    },
    physicalArtifacts: {
      zh: ['警示材质', '破镜边', '投影残片', '荧光塑壳'],
      en: ['warning surfaces', 'broken mirror edges', 'projection shards', 'fluorescent shells'],
      de: ['Warnflächen', 'Spiegelbruchkanten', 'Projektionssplitter', 'Leuchtschalen'],
    },
    overlayWords: {
      zh: ['fault', 'scar', 'acid', 'split', 'burn'],
      en: ['fault', 'scar', 'acid', 'split', 'burn'],
      de: ['Fehler', 'Narbe', 'Säure', 'Riss', 'Brand'],
    },
    crossLinks: ['browser-shrine', 'backrooms', 'post-soviet-signal'],
    media: {
      still: '/media/uploaded/error-shrine-shadow-monitor.jpg',
      texture: '/media/textures/Concrete013_1K-JPG_Color.jpg',
      relic: '/media/uploaded/error-shrine-signal-hand.jpg',
      illustration: '/media/uploaded/error-shrine-blue-tv.jpg',
      overlay: '/media/uploaded/error-shrine-green-face.jpg',
    },
  },
]

export const visibleDimensions = dimensions.filter((dimension) => !dimension.hidden)
export const dimensionConceptCopy: Record<DimensionSlug, LocalizedText> = {
  dreamfield: {
    zh: '这一分区像被压缩过度的夏日桌面。草地、云层与塑料光泽被反复转载，最终只留下能让人短暂停留的温柔假象。',
    en: 'This zone feels like an over-compressed summer desktop: lawn, cloud, and plastic shine reposted until only a soft illusion remains for brief shelter.',
    de: 'Diese Zone wirkt wie ein überkomprimierter Sommer-Desktop: Wiese, Wolke und Plastikglanz wurden so oft kopiert, bis nur eine sanfte Zuflucht blieb.',
  },
  'browser-shrine': {
    zh: '这里收藏早期网页的礼仪：闪烁链接、旧窗口边框、加载中的祈祷。每次点击都像一次向失效协议致敬。',
    en: 'Here the rituals of early web survive: blinking links, old window chrome, prayers during loading. Every click salutes a broken protocol.',
    de: 'Hier leben die Rituale des frühen Netzes weiter: blinkende Links, alte Fensterrahmen, Gebete im Ladezustand. Jeder Klick grüßt ein defektes Protokoll.',
  },
  'silent-bedroom': {
    zh: '静默卧室是离线后的夜间缓存。屏幕余辉、被遗忘的键盘和半睡半醒的噪点，把私人记忆改写成公共梦境。',
    en: 'Silent Bedroom is a night cache after disconnect: monitor afterglow, forgotten keys, and half-awake noise rewriting private memory into shared dream.',
    de: 'Silent Bedroom ist ein Nacht-Cache nach der Trennung: Monitornachglühen, vergessene Tasten und halbwaches Rauschen schreiben private Erinnerung zum gemeinsamen Traum um.',
  },
  poolcore: {
    zh: '池核区记录被时间浸泡的蓝色建筑。水面反射像循环失败的界面刷新，让人分不清此刻是在清晨还是旧录像带里。',
    en: 'Poolcore logs blue architecture soaked by time. Reflections behave like failed interface refresh, blurring whether this is dawn or an old tape.',
    de: 'Poolcore protokolliert blaue Architektur im Zeitsud. Spiegelungen wirken wie fehlgeschlagene Interface-Refreshs und verwischen Morgenlicht mit altem Bandmaterial.',
  },
  'dead-mall': {
    zh: '废商场分区保存消费时代的回声：空置中庭、褪色导视和迟到的霓虹。路线仍完整，目的地却早已撤场。',
    en: 'Dead Mall preserves retail-era echoes: vacant atriums, faded wayfinding, neon arriving too late. The route map remains; the destinations are gone.',
    de: 'Dead Mall bewahrt Echos des Konsumzeitalters: leere Atrien, verblasste Leitsysteme, verspätetes Neon. Die Wege bleiben, die Ziele sind geräumt.',
  },
  backrooms: {
    zh: '后室像被错误导出的办公平面图。灯管嗡鸣、墙纸重复、转角无尽，空间不断提示你已离开主叙事。',
    en: 'Backrooms resembles an office floorplan exported wrong: humming tubes, repeated wallpaper, endless corners reminding you the main narrative has been left behind.',
    de: 'Backrooms gleicht einem falsch exportierten Bürogrundriss: summende Röhren, wiederholte Tapete, endlose Ecken als Hinweis, dass die Haupterzählung verlassen wurde.',
  },
  'post-soviet-signal': {
    zh: '后苏联信号由楼体、电视雪花和冬季频率组成。频道不断切换，却始终停在同一段历史回声上。',
    en: 'Post-Soviet Signal is built from tower blocks, TV snow, and winter frequencies. Channels keep switching, yet history loops on the same echo.',
    de: 'Post-Soviet Signal besteht aus Plattenbauten, Fernsehrauschen und Winterfrequenzen. Die Kanäle wechseln ständig, doch die Geschichte bleibt im selben Echo hängen.',
  },
  'error-shrine': {
    zh: '故障圣坛是本档案最不稳定的层。图像被烧蚀、接口被误译，仍有人在这里尝试重新连接世界。',
    en: 'Error Shrine is the archive’s least stable layer: images scorched, interfaces mistranslated, yet someone still attempts to reconnect the world from here.',
    de: 'Error Shrine ist die instabilste Schicht des Archivs: Bilder angebrannt, Interfaces fehlübersetzt, und doch versucht hier noch jemand, die Welt neu zu verbinden.',
  },
}
export const dimensionArchiveIntroCopy: Record<DimensionSlug, LocalizedText> = {
  dreamfield: {
    zh: '本条目采集“晴日幻觉”的四组证据：视觉皮层、交互回路、网络旧物与现实残留。',
    en: 'This record logs four traces of a synthetic sunny day: visual skin, interaction loop, web relics, and physical residue.',
    de: 'Dieser Eintrag sammelt vier Spuren eines synthetischen Sonnentags: visuelle Haut, Interaktionsschleife, Netzrelikte und materielle Rückstände.',
  },
  'browser-shrine': {
    zh: '以下轨道用于校对旧网页仪式：看见、点击、连线与触碰如何共同组成“浏览”本体。',
    en: 'The tracks below calibrate old web rituals: how seeing, clicking, linking, and touching assemble the body of browsing.',
    de: 'Die folgenden Spuren kalibrieren alte Webrituale: wie Sehen, Klicken, Verlinken und Berühren den Körper des Browsens bilden.',
  },
  'silent-bedroom': {
    zh: '此处归档夜间设备的低声回放，记录私密空间如何被屏幕光改写成可共享的梦。',
    en: 'Here we archive the low replay of nocturnal devices, tracing how private rooms are rewritten by monitor light into shared dream.',
    de: 'Hier archivieren wir das leise Replay nächtlicher Geräte und verfolgen, wie private Räume durch Monitorlicht zum gemeinsamen Traum umgeschrieben werden.',
  },
  poolcore: {
    zh: '轨道样本围绕“湿度记忆”展开：色块、回声、旧网印痕与实体瓷砖互相漂移。',
    en: 'These tracks revolve around humid memory: color fields, echoes, old-net imprints, and tiled matter drifting through each other.',
    de: 'Diese Spuren kreisen um feuchte Erinnerung: Farbflächen, Echos, Alt-Netz-Abdrücke und Kachelmaterie treiben ineinander.',
  },
  'dead-mall': {
    zh: '档案将商场拆分为四条慢速信号：景观、行为、网络复写与物理空壳。',
    en: 'The archive breaks the mall into four slow signals: scenery, behavior, network rewrites, and physical shells.',
    de: 'Das Archiv zerlegt die Mall in vier langsame Signale: Szenerie, Verhalten, Netzwerk-Umschriften und materielle Hüllen.',
  },
  backrooms: {
    zh: '我们把迷路感分层标注：先是视觉重复，再是动作迟滞，然后是网络噪声，最后是空间触感。',
    en: 'We annotate disorientation in layers: visual repetition first, delayed movement next, then network noise, and finally spatial touch.',
    de: 'Wir markieren Verirrung in Schichten: zuerst visuelle Wiederholung, dann verzögerte Bewegung, danach Netzrauschen und zuletzt räumliche Haptik.',
  },
  'post-soviet-signal': {
    zh: '轨道收录冬季频道中的四类碎片，用于追踪信号如何在历史与当下之间反复失真。',
    en: 'The tracks collect four fragment classes from winter channels, tracing how signals distort again and again between history and now.',
    de: 'Die Spuren sammeln vier Fragmentklassen aus Winterkanälen und verfolgen, wie Signale zwischen Geschichte und Gegenwart wiederholt verzerren.',
  },
  'error-shrine': {
    zh: '下列条目是故障层的临时修复日志：每个标签都可能是线索，也可能是新的裂口。',
    en: 'The entries below are temporary repair logs from the fault layer; each tag may be a clue—or a fresh fracture.',
    de: 'Die folgenden Einträge sind provisorische Reparaturlogs der Fehlerschicht; jedes Tag kann Spur sein oder neuer Riss.',
  },
}
const dimensionsBySlug = new Map(dimensions.map((dimension) => [dimension.slug, dimension]))
const dimensionsByPath = new Map(dimensions.map((dimension) => [dimension.path, dimension]))

export const assetArchive: ArchiveAsset[] = [
  {
    id: 'glitch-installation',
    tone: 'error',
    type: 'gif',
    path: '/media/ian-glitch-installation.gif',
    label: {
      zh: '故障装置',
      en: 'glitch installation',
      de: 'Glitch-Installation',
    },
    source: 'project file',
  },
  {
    id: 'glitch-still',
    tone: 'error',
    type: 'image',
    path: '/media/ian-glitch-still.png',
    label: {
      zh: '故障静帧',
      en: 'glitch still',
      de: 'Glitch-Standbild',
    },
    source: 'project file',
  },
  {
    id: 'noise-veil',
    tone: 'global',
    type: 'gif',
    path: '/media/ian-noise-veil.gif',
    label: {
      zh: '噪点面纱',
      en: 'noise veil',
      de: 'Rauschschleier',
    },
    source: 'project file',
  },
  {
    id: 'browser-mosaic',
    tone: 'browser',
    type: 'image',
    path: '/media/found/browser-mosaic.png',
    label: {
      zh: '旧浏览器视窗',
      en: 'mosaic browser view',
      de: 'Mosaic-Browserfenster',
    },
    source: 'Wikimedia Commons',
  },
  {
    id: 'computer-monitor-simulated',
    tone: 'dreamfield',
    type: 'image',
    path: '/media/found/computer-monitor-simulated.jpg',
    label: {
      zh: '旧显示器幻景',
      en: 'simulated monitor glow',
      de: 'Monitor-Simulation',
    },
    source: 'Wikimedia Commons',
  },
  {
    id: 'abandoned-mall',
    tone: 'mall',
    type: 'image',
    path: '/media/found/abandoned-mall.jpg',
    label: {
      zh: '废弃商场',
      en: 'abandoned mall',
      de: 'Verlassene Mall',
    },
    source: 'Wikimedia Commons',
  },
  {
    id: 'mall-atrium',
    tone: 'mall',
    type: 'image',
    path: '/media/found/mall-atrium.jpg',
    label: {
      zh: '螺旋中庭',
      en: 'spiral atrium',
      de: 'Spiral-Atrium',
    },
    source: 'Wikimedia Commons',
  },
  {
    id: 'vintage-computer-arrangement',
    tone: 'browser',
    type: 'image',
    path: '/media/found/vintage-computer-arrangement.jpg',
    label: {
      zh: '复古电脑阵列',
      en: 'vintage computer arrangement',
      de: 'Vintage-Computer-Arrangement',
    },
    source: 'Wikimedia Commons',
  },
  {
    id: 'lakeforest-construction',
    tone: 'mall',
    type: 'image',
    path: '/media/found/lakeforest-construction-1978.jpg',
    label: {
      zh: 'Lakeforest 商场施工',
      en: 'lakeforest mall construction',
      de: 'Lakeforest-Mall-Bau',
    },
    source: 'Wikimedia Commons',
  },
  {
    id: 'pool-photo',
    tone: 'pool',
    type: 'image',
    path: '/media/found/poolcore-interior.jpg',
    label: {
      zh: '室内泳池',
      en: 'indoor pool',
      de: 'Hallenbad',
    },
    source: 'Wikimedia Commons',
  },
  {
    id: 'soviet-photo',
    tone: 'soviet',
    type: 'image',
    path: '/media/found/post-soviet-apartments.jpg',
    label: {
      zh: '公寓楼外立面',
      en: 'apartment block facade',
      de: 'Plattenbau-Fassade',
    },
    source: 'Wikimedia Commons',
  },
  {
    id: 'dreamfield-hill',
    tone: 'dreamfield',
    type: 'image',
    path: '/media/IMG_2433.jpg',
    label: {
      zh: '蓝天草坡',
      en: 'blue-sky hill',
      de: 'Blauhimmel-Hang',
    },
    source: 'user media',
  },
  {
    id: 'bedroom-desk',
    tone: 'bedroom',
    type: 'image',
    path: '/media/IMG_2435.jpg',
    label: {
      zh: '旧桌面角落',
      en: 'desktop corner',
      de: 'Schreibtischecke',
    },
    source: 'user media',
  },
  {
    id: 'main-hero-poster',
    tone: 'dreamfield',
    type: 'image',
    path: '/media/ian-main-hero-poster.png',
    label: {
      zh: '主开幕静帧',
      en: 'opening still',
      de: 'Eröffnungsbild',
    },
    source: 'derived from project file',
  },
]
export const assetArchiveById = new Map(assetArchive.map((asset) => [asset.id, asset]))

export const homeArchiveCollageIds = [
  'main-hero-poster',
  'dreamfield-hill',
  'browser-mosaic',
  'vintage-computer-arrangement',
  'computer-monitor-simulated',
  'bedroom-desk',
  'mall-atrium',
  'abandoned-mall',
  'pool-photo',
  'soviet-photo',
  'lakeforest-construction',
  'glitch-installation',
] as const

export const dimensionPanelMedia: Record<string, Record<PanelKind, string[]>> = {
  dreamfield: {
    visual: [
      '/media/IMG_2433.jpg',
      '/media/found/xp-bliss.svg',
      '/media/ian-main-hero-poster.png',
    ],
    interaction: [
      '/media/clouds-timelapse.webm',
      '/media/found/computer-monitor-simulated.jpg',
      '/media/ian-main-hero-poster.png',
    ],
    internet: [
      '/media/found/msn-messenger-icon.png',
      '/media/found/xp-explorer-icon.png',
      '/media/found/xp-logo.svg',
    ],
    physical: [
      '/media/found/pentium-windows98-sticker.jpg',
      '/media/found/xp-logo.svg',
      '/media/found/computer-monitor-simulated.jpg',
    ],
  },
  'browser-shrine': {
    visual: [
      '/media/found/browser-mosaic.png',
      '/media/found/vintage-computer-arrangement.jpg',
      '/media/found/dots-glitch.gif',
    ],
    interaction: [
      '/media/found/installing-windows-95.jpg',
      '/media/found/vintage-computer-arrangement.jpg',
      '/media/IMG_2435.jpg',
    ],
    internet: [
      '/media/found/msn-messenger-icon.png',
      '/media/found/xp-explorer-icon.png',
      '/media/found/xp-logo.svg',
    ],
    physical: [
      '/media/found/pentium-windows98-sticker.jpg',
      '/media/found/microsoft-keyboard.jpg',
      '/media/textures/Plastic017A_1K-JPG_Color.jpg',
    ],
  },
  'silent-bedroom': {
    visual: [
      '/media/IMG_2435.jpg',
      '/media/ian-main-hero-poster.png',
      '/media/clouds-timelapse.webm',
    ],
    interaction: [
      '/media/found/basement-desk.jpg',
      '/media/found/old-tv.jpg',
      '/media/ian-noise-veil.gif',
    ],
    internet: [
      '/media/found/computer-monitor-simulated.jpg',
      '/media/222.gif',
      '/media/ian-noise-veil.gif',
    ],
    physical: [
      '/media/found/microsoft-keyboard.jpg',
      '/media/IMG_2428.jpg',
      '/media/found/old-tv.jpg',
    ],
  },
  poolcore: {
    visual: ['/media/IMG_2424.jpg', '/media/found/poolcore-interior.jpg', '/media/IMG_2426.jpg'],
    interaction: ['/media/111.gif', '/media/IMG_2426.jpg', '/media/clouds-timelapse.webm'],
    internet: ['/media/IMG_2425.jpg', '/media/111.gif', '/media/clouds-timelapse.webm'],
    physical: ['/media/IMG_2423.jpg', '/media/textures/Tiles096_1K-JPG_Color.jpg', '/media/IMG_2424.jpg'],
  },
  'dead-mall': {
    visual: [
      '/media/found/mall-atrium.jpg',
      '/media/found/abandoned-mall.jpg',
      '/media/found/dead-mall-interior.jpg',
    ],
    interaction: [
      '/media/IMG_2430.jpg',
      '/media/found/lakeforest-construction-1978.jpg',
      '/media/found/dots-glitch.gif',
    ],
    internet: [
      '/media/found/lakeforest-construction-1978.jpg',
      '/media/found/browser-mosaic.png',
      '/media/found/dots-glitch.gif',
    ],
    physical: [
      '/media/IMG_2430.jpg',
      '/media/found/abandoned-mall.jpg',
      '/media/found/mall-atrium.jpg',
    ],
  },
  backrooms: {
    visual: [
      '/media/found/fluorescent-panel.jpg',
      '/media/IMG_2429.jpg',
      '/media/IMG_2427.jpg',
    ],
    interaction: [
      '/media/IMG_2427.jpg',
      '/media/ian-noise-veil.gif',
      '/media/111.gif',
    ],
    internet: [
      '/media/found/windows-xp-bsod.png',
      '/media/222.gif',
      '/media/found/dots-glitch.gif',
    ],
    physical: [
      '/media/IMG_2428.jpg',
      '/media/textures/Concrete013_1K-JPG_Color.jpg',
      '/media/found/fluorescent-panel.jpg',
    ],
  },
  'post-soviet-signal': {
    visual: [
      '/media/found/post-soviet-apartments.jpg',
      '/media/found/moscow-bus-stop.jpg',
      '/media/textures/Concrete013_1K-JPG_Color.jpg',
    ],
    interaction: ['/media/found/soviet-tv-minsk.jpg', '/media/222.gif', '/media/111.gif'],
    internet: ['/media/ian-glitch-still.png', '/media/ian-noise-veil.gif', '/media/IMG_2428.jpg'],
    physical: [
      '/media/found/soviet-tv-minsk.jpg',
      '/media/textures/Concrete013_1K-JPG_Color.jpg',
      '/media/found/moscow-bus-stop.jpg',
    ],
  },
  'error-shrine': {
    visual: [
      '/media/uploaded/error-shrine-shadow-monitor.jpg',
      '/media/uploaded/error-shrine-signal-hand.jpg',
      '/media/uploaded/error-shrine-green-face.jpg',
    ],
    interaction: [
      '/media/uploaded/error-shrine-blue-tv.jpg',
      '/media/uploaded/error-shrine-connected.jpg',
      '/media/ian-glitch-installation.gif',
    ],
    internet: [
      '/media/uploaded/error-shrine-connected.jpg',
      '/media/uploaded/error-shrine-green-face.jpg',
      '/media/uploaded/error-shrine-signal-hand.jpg',
    ],
    physical: [
      '/media/uploaded/error-shrine-blue-tv.jpg',
      '/media/uploaded/error-shrine-shadow-monitor.jpg',
      '/media/111.gif',
    ],
  },
}

export function getDimensionBySlug(slug?: string) {
  if (!slug) {
    return undefined
  }

  return dimensionsBySlug.get(slug)
}

export function getDimensionByPath(pathname: string) {
  return dimensionsByPath.get(pathname)
}

export function fragmentText(text: string) {
  const cleaned = text
    .replace(/[.,!?;:()[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!cleaned) {
    return []
  }

  const segments = cleaned.split(/[\s/|_-]+/).filter(Boolean)

  if (segments.length > 1) {
    return segments
  }

  if (/[\u4e00-\u9fff]/u.test(cleaned)) {
    return Array.from(cleaned).filter((character) => character.trim().length > 0)
  }

  return [cleaned]
}


export function pickLocalized(text: LocalizedText, language: Language) {
  return text[language] ?? text.en
}

export function pickLocalizedList(text: LocalizedList, language: Language) {
  return text[language] ?? text.en
}
