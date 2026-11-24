// priority: 0
// 铂产线拆分：矿石 / 粗铂（raw material）不再直接出「精制铂粉」或「铂锭」，
// 一律先出中间产物 kubejs:crude_platinum_dust（粗铂粉，见 startup_scripts/custom_items.js）
//
// 背景：
//   alltheores 把铂粉（alltheores:platinum_dust）同时挂在了「矿石直接制粉」和
//   「铂锭 / 脏铂粉再加工」两条链上，导致粗料一步就能拿到精制粉；
//   熔炼 / 高炉同样能把矿石、粗铂一步烧成铂锭。这里把「粗料一步到位」的配方全部掐掉，
//   精制铂粉只保留「铂锭粉碎」与「脏铂粉富集」两个来源。
//
// 第一部分 · 产物铂粉 -> 粗铂粉
// 保留（原料含 alltheores:platinum_ingot 或 alltheores:dirty_platinum_dust，未改动）：
//   · alltheores:mek_processing/platinum/dust/from_ingot          （粉碎：forge:ingots/platinum -> 铂粉）
//   · alltheores:mek_processing/platinum/dust/from_dirty_dust     （富集：脏铂粉 -> 铂粉）
//   · alltheores:platinum_dust_from_hammer_ingot_crushing         （锤子：forge:ingots/platinum -> 铂粉）
//   · alltheores:thermal_pulverize/pulverizer_platinum_ingot_to_dust（粉碎机：forge:ingots/platinum -> 铂粉）
//
// 改写（5 条，delete + 用原 ID 重建，除产物外参数一律照抄原值）：
//   ① alltheores:mek_processing/platinum/dust/from_ore            富集 矿石 -> 2
//   ② alltheores:mek_processing/platinum/dust/from_raw_block      富集 粗铂块 -> 12
//   ③ alltheores:mek_processing/platinum/dust/from_raw_ore        富集 粗铂 ×3 -> 4
//   ④ alltheores:platinum_dust_from_hammer_crushing               锤子 粗铂 -> 2
//   ⑤ alltheores:thermal_pulverize/pulverizer_platinum_ore        粉碎机 矿石 -> 2 (+锡粉/砂砾副产)
//
// 第二部分 · 产物铂锭 -> 粗铂粉（原料是铂矿石或粗铂的熔炼 / 高炉，共 6 条）
//   矿石：alltheores:platinum_ore、alltheores:deepslate_platinum_ore
//        （两者都在 #forge:ores/platinum 里；该标签另有 nether / end / other 三种矿石，
//          但模组没给它们熔炼配方，所以没有可改的条目）
//   粗铂：alltheores:raw_platinum
//   保留不改：铂粉烧锭（smelting_dust/platinum_ingot、from_dust_blasting）、
//            9 粒合成锭、铂块分解 9 锭 —— 原料都不是矿石/粗铂。
//
// 第三部分 · 补齐另外三种铂矿的烧炼
//   #forge:ores/platinum 有 5 种矿石，alltheores 只给 platinum_ore / deepslate_platinum_ore
//   写了熔炼与高炉；nether / end / other 三种原本没有任何烧炼配方。这里按同模组数值
//   （200 tick、经验 0.15）补 6 条，产物同样是粗铂粉，保证五种矿石行为一致。
//
// 生效：/reload

ServerEvents.recipes(event => {
  const CRUDE = 'kubejs:crude_platinum_dust'

  // ── 先删掉原配方（KubeJS 先统一执行删除、再统一执行新增，可以复用原 ID） ──
  const TARGETS = [
    'alltheores:mek_processing/platinum/dust/from_ore',
    'alltheores:mek_processing/platinum/dust/from_raw_block',
    'alltheores:mek_processing/platinum/dust/from_raw_ore',
    'alltheores:platinum_dust_from_hammer_crushing',
    'alltheores:thermal_pulverize/pulverizer_platinum_ore'
  ]
  TARGETS.forEach(id => event.remove({ id: id }))

  // ── ① 富集仓：铂矿石 → 2 粗铂粉 ──
  event.custom({
    type: 'mekanism:enriching',
    input: { ingredient: { tag: 'forge:ores/platinum' } },
    output: { item: CRUDE, count: 2 }
  }).id('alltheores:mek_processing/platinum/dust/from_ore')

  // ── ② 富集仓：粗铂块 → 12 粗铂粉 ──
  event.custom({
    type: 'mekanism:enriching',
    input: { ingredient: { tag: 'forge:storage_blocks/raw_platinum' } },
    output: { item: CRUDE, count: 12 }
  }).id('alltheores:mek_processing/platinum/dust/from_raw_block')

  // ── ③ 富集仓：3 个粗铂 → 4 粗铂粉（amount 指消耗数量，不能丢） ──
  event.custom({
    type: 'mekanism:enriching',
    input: { amount: 3, ingredient: { tag: 'forge:raw_materials/platinum' } },
    output: { item: CRUDE, count: 4 }
  }).id('alltheores:mek_processing/platinum/dust/from_raw_ore')

  // ── ④ 工作台（锤子）：粗铂 → 2 粗铂粉 ──
  event.custom({
    type: 'minecraft:crafting_shapeless',
    category: 'misc',
    ingredients: [
      { tag: 'alltheores:ore_hammers' },
      { tag: 'forge:raw_materials/platinum' }
    ],
    result: { item: CRUDE, count: 2 }
  }).id('alltheores:platinum_dust_from_hammer_crushing')

  // ── ⑤ 粉碎机：铂矿石 → 2 粗铂粉 + 副产（chance 是 thermal 的「保证数量」写法） ──
  event.custom({
    type: 'thermal:pulverizer',
    ingredient: { tag: 'forge:ores/platinum' },
    result: [
      { item: CRUDE, chance: 2.0 },
      { item: 'alltheores:tin_dust', chance: 0.1 },
      { item: 'minecraft:gravel', chance: 0.2 }
    ],
    experience: 0.2
  }).id('alltheores:thermal_pulverize/pulverizer_platinum_ore')

  // ── 第二部分：矿石 / 粗铂 熔炼出铂锭 → 改为出粗铂粉 ──────────────────────
  // [配方 ID, 配方类型, 原料物品, 烹饪时间, 经验]
  // 数值全部照抄原配方，只换产物（1 个粗铂粉，与原产物 1 个铂锭等量）。
  const SMELT_TARGETS = [
    ['alltheores:platinum_ingot_from_ore',                 'minecraft:smelting', 'alltheores:platinum_ore',           200, 0.15],
    ['alltheores:platinum_ingot_from_ore_blasting',        'minecraft:blasting', 'alltheores:platinum_ore',           200, 0.15],
    ['alltheores:platinum_ingot_from_slate_ore',           'minecraft:smelting', 'alltheores:deepslate_platinum_ore', 200, 0.15],
    ['alltheores:platinum_ingot_from_slate_ore_blasting',  'minecraft:blasting', 'alltheores:deepslate_platinum_ore', 200, 0.15],
    ['alltheores:platinum_ingot_from_raw',                 'minecraft:smelting', 'alltheores:raw_platinum',           200, 0.15],
    ['alltheores:platinum_ingot_from_raw_blasting',        'minecraft:blasting', 'alltheores:raw_platinum',           100, 0.15]
  ]

  SMELT_TARGETS.forEach(t => event.remove({ id: t[0] }))

  SMELT_TARGETS.forEach(t => {
    event.custom({
      type: t[1],
      category: 'misc',
      ingredient: { item: t[2] },
      result: CRUDE,
      experience: t[4],
      cookingtime: t[3]
    }).id(t[0])
  })

  // 兜底：别的数据包若用 #forge:ores/platinum 标签、或产物写成 forge:ingots/platinum 标签，
  // 上面的精确 ID 删不到。这里再按「输入 + 产物」整类替换一次（API 不存在时静默跳过）。
  try {
    event.replaceOutput(
      { input: '#forge:ores/platinum' },
      'alltheores:platinum_ingot',
      CRUDE
    )
    event.replaceOutput(
      { input: 'alltheores:raw_platinum' },
      'alltheores:platinum_ingot',
      CRUDE
    )
  } catch (err) {
    console.warn('[PLB] replaceOutput 兜底不可用：' + err)
  }

  // ── 第三部分：补齐另外三种铂矿的熔炼 / 高炉配方 ─────────────────────────
  // #forge:ores/platinum 共 5 种矿石，alltheores 只为 platinum_ore / deepslate_platinum_ore
  // 写了熔炼与高炉，nether / end / other 三种完全没有烧炼途径（只能进机器磨粉）。
  // 这里按同模组的数值补上（熔炼 200 tick / 高炉 200 tick / 经验 0.15），产物同样是粗铂粉。
  const EXTRA_ORES = [
    'alltheores:nether_platinum_ore',
    'alltheores:end_platinum_ore',
    'alltheores:other_platinum_ore'
  ]

  EXTRA_ORES.forEach(function (ore) {
    const name = ore.split(':')[1]      // 例如 nether_platinum_ore
    event.custom({
      type: 'minecraft:smelting',
      category: 'misc',
      ingredient: { item: ore },
      result: CRUDE,
      experience: 0.15,
      cookingtime: 200
    }).id('kubejs:smelting/crude_platinum_from_' + name)

    event.custom({
      type: 'minecraft:blasting',
      category: 'misc',
      ingredient: { item: ore },
      result: CRUDE,
      experience: 0.15,
      cookingtime: 200
    }).id('kubejs:blasting/crude_platinum_from_' + name)
  })

  console.info('[PLB] platinum: 5 dust recipes + 6 ingot-smelting recipes -> crude platinum dust, ' +
    'plus ' + (EXTRA_ORES.length * 2) + ' new smelting/blasting recipes for nether/end/other ores')
})
