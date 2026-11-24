// priority: 0
// ATM（allthemodium）加工链
//
// ── 一、矿石 / 粗矿的加工产物改为「粗ATM粉」──
//   与铂（alltheores_platinum_dust_to_crude.js）、铱（alltheores_iridium_dust_to_chloride.js）
//   两条线同构：矿石与粗矿不再直接出 ATM 粉或 ATM 锭，中间插一层粗ATM粉。
//
//     富集仓   #forge:ores/allthemodium             -> 2 粗ATM粉
//     富集仓   #forge:storage_blocks/raw_allthemodium -> 12 粗ATM粉
//     富集仓   3 × #forge:raw_materials/allthemodium -> 4 粗ATM粉
//     锤子     粗ATM + #alltheores:ore_hammers       -> 2 粗ATM粉
//     熔炉/高炉 粗ATM                                -> 1 粗ATM粉（原为 1 ATM锭）
//     熔炉/高炉 两种矿石（allthemodium_ore / _slate_ore） -> 1 粗ATM粉（新增，ATM 原本没有矿石烧炼）
//
//   保留不动：锭->粉（粉碎）、脏粉->粉（富集）、Mekanism 五倍线的 clump / shard / slurry 系列。
//   粉->锭（熔炉/高炉）原本保留，现已改为热锭路线：那两条在 hot_ingots.js 的
//   「热ATM锭」小节里被删除，ATM 粉必须先熔成热ATM锭再冷却成锭。
//
// ── 二、五条加工配方 ──
//   1) 离心机  5 粗ATM粉 -> 3 ATM金属粉 + 1 粗铂粉 + 1 粗铱粉 + 1 锇粉，4000 RF
//   2) PRC     1000 氨气 + 1000 水 + 1 ATM金属粉 -> 1000 富ATM氨
//   3) PRC     9000 富ATM氨 + 900 水 + 9 ATM金属粉 -> 18 含杂ATM粉
//   4) 离心机  18 含杂ATM粉 -> 14 ATM金属粉 + 2 精制ATM粉，16000 RF
//   5) PRC     1000 氢气 + 1000 硝酸（液体）+ 1 精制ATM粉 -> 1 ATM粉 + 4000 氨气
//
//   配方 2/5 用 100 tick / energyRequired 1000；配方 3 处理量更大，用 200 tick / 3000，
//   与项目里其它 PRC 配方的写法一致（耗能可按需再调）。
//
// ── 物品与化学品 ──
//   kubejs:crude_allthemodium_dust        粗ATM粉
//   kubejs:allthemodium_metal_dust        ATM金属粉
//   kubejs:allthemodium_ammonium_dust     含杂ATM粉（ID 保留注册时的 ammonium 命名，只改显示名）
//   kubejs:reprecipitated_allthemodium_dust 精制ATM粉（同上，ID 保留 reprecipitated）
//   kubejs:rich_allthemodium_ammonia      富ATM氨（mekanism:gas，见 startup_scripts/custom_gases.js）
// 生效：/reload（配方）；物品与气体是 startup 注册，需重启游戏

ServerEvents.recipes(event => {
  const CRUDE = 'kubejs:crude_allthemodium_dust'
  const METAL = 'kubejs:allthemodium_metal_dust'
  const IMPURE = 'kubejs:allthemodium_ammonium_dust'
  const REFINED = 'kubejs:reprecipitated_allthemodium_dust'
  const ATM_DUST = 'allthemodium:allthemodium_dust'
  const RICH = 'kubejs:rich_allthemodium_ammonia'

  // ══════════════════════════════════════════════════════════════════════
  // 一、制粉：4 条改粗ATM粉（数值、tag 全部沿用原配方）
  // ══════════════════════════════════════════════════════════════════════
  // [配方 ID, 输入对象, 产出数量]
  const DUST = [
    ['allthemodium:mek_processing/allthemodium/dust/from_ore',
      { ingredient: { tag: 'forge:ores/allthemodium' } }, 2],
    ['allthemodium:mek_processing/allthemodium/dust/from_raw_block',
      { ingredient: { tag: 'forge:storage_blocks/raw_allthemodium' } }, 12],
    ['allthemodium:mek_processing/allthemodium/dust/from_raw_ore',
      { amount: 3, ingredient: { tag: 'forge:raw_materials/allthemodium' } }, 4]
  ]

  DUST.forEach(function (t) {
    event.remove({ id: t[0] })
    event.custom({
      type: 'mekanism:enriching',
      input: t[1],
      output: { item: CRUDE, count: t[2] }
    }).id(t[0])
  })

  // 锤子：粗ATM -> 2 粗ATM粉（原 allthemodium_dust_from_ore_crushing 的产物是 ATM 粉）
  const HAMMER = 'allthemodium:allthemodium_dust_from_ore_crushing'
  event.remove({ id: HAMMER })
  event.custom({
    type: 'minecraft:crafting_shapeless',
    category: 'misc',
    ingredients: [
      { item: 'allthemodium:raw_allthemodium' },
      { tag: 'alltheores:ore_hammers' }
    ],
    result: { item: CRUDE, count: 2 }
  }).id(HAMMER)

  // ══════════════════════════════════════════════════════════════════════
  // 二、粗矿烧炼：2 条由「1 ATM锭」改为「1 粗ATM粉」
  // ══════════════════════════════════════════════════════════════════════
  const RAW_SMELT = [
    ['allthemodium:allthemodium_ingot_from_raw_smelting', 'minecraft:smelting'],
    ['allthemodium:allthemodium_ingot_from_raw_blasting', 'minecraft:blasting']
  ]

  RAW_SMELT.forEach(function (t) {
    event.remove({ id: t[0] })
    event.custom({
      type: t[1],
      category: 'misc',
      ingredient: { item: 'allthemodium:raw_allthemodium' },
      result: CRUDE,
      experience: 0.15,
      cookingtime: 200
    }).id(t[0])
  })

  // ══════════════════════════════════════════════════════════════════════
  // 三、两种矿石补熔炼 / 高炉（ATM 只写了粗矿的烧炼，矿石没有）
  // ══════════════════════════════════════════════════════════════════════
  const ORES = ['allthemodium:allthemodium_ore', 'allthemodium:allthemodium_slate_ore']

  ORES.forEach(function (ore) {
    const name = ore.split(':')[1]
    event.custom({
      type: 'minecraft:smelting',
      category: 'misc',
      ingredient: { item: ore },
      result: CRUDE,
      experience: 0.15,
      cookingtime: 200
    }).id('kubejs:smelting/crude_allthemodium_from_' + name)

    event.custom({
      type: 'minecraft:blasting',
      category: 'misc',
      ingredient: { item: ore },
      result: CRUDE,
      experience: 0.15,
      cookingtime: 200
    }).id('kubejs:blasting/crude_allthemodium_from_' + name)
  })

  // ══════════════════════════════════════════════════════════════════════
  // 四、五条加工配方
  // ══════════════════════════════════════════════════════════════════════

  // 1) 离心机：5 粗ATM粉 -> 3 ATM金属粉 + 1 粗铂粉 + 1 粗铱粉 + 1 锇粉
  //    离心机只有 4 个输出槽，这里正好占满。
  //    第 4 项用 alltheores:osmium_dust（锇粉）而不是污浊锇粉：
  //    Mekanism 那套污浊粉没有统一到 AllTheOres（AU 的 tags 清单里没有
  //    forge:dirty_dusts/{material}），污浊锇粉实际是 mekanism:dirty_dust_osmium，
  //    与 alltheores:dirty_osmium_dust 是两个物品；直接给成品粉可以避开这个问题。
  event.custom({
    type: 'thermal:centrifuge',
    ingredient: { item: CRUDE, count: 5 },
    result: [
      { item: METAL, count: 3 },
      { item: 'kubejs:crude_platinum_dust', count: 1 },
      { item: 'kubejs:crude_iridium_dust', count: 1 },
      { item: 'alltheores:osmium_dust', count: 1 }
    ],
    energy: 4000
  }).id('kubejs:centrifuge/crude_allthemodium_dust')

  // 2) PRC：1000 氨气 + 1000 水 + 1 ATM金属粉 -> 1000 富ATM氨
  event.custom({
    type: 'mekanism:reaction',
    duration: 100,
    gasInput: { amount: 1000, gas: 'kubejs:ammonia' },
    fluidInput: { amount: 1000, fluid: 'minecraft:water' },
    itemInput: { ingredient: { item: METAL } },
    gasOutput: { amount: 1000, gas: RICH },
    energyRequired: 1000
  }).id('kubejs:reaction/rich_allthemodium_ammonia')

  // 3) PRC：9000 富ATM氨 + 900 水 + 9 ATM金属粉 -> 18 含杂ATM粉
  //    输入量比其它配方大一个量级，duration / energyRequired 同步放大。
  event.custom({
    type: 'mekanism:reaction',
    duration: 200,
    gasInput: { amount: 9000, gas: RICH },
    fluidInput: { amount: 900, fluid: 'minecraft:water' },
    itemInput: { amount: 9, ingredient: { item: METAL } },
    itemOutput: { count: 18, item: IMPURE },
    energyRequired: 3000
  }).id('kubejs:reaction/impure_allthemodium_dust')

  // 4) 离心机：18 含杂ATM粉 -> 14 ATM金属粉 + 2 精制ATM粉
  event.custom({
    type: 'thermal:centrifuge',
    ingredient: { item: IMPURE, count: 18 },
    result: [
      { item: METAL, count: 14 },
      { item: REFINED, count: 2 }
    ],
    energy: 16000
  }).id('kubejs:centrifuge/impure_allthemodium_dust')

  // 5) PRC：1000 氢气 + 1000 硝酸 + 1 精制ATM粉 -> 1 ATM粉 + 4000 氨气
  //    返回的是原版 ATM 粉（allthemodium:allthemodium_dust），与五倍线最终产物一致。
  event.custom({
    type: 'mekanism:reaction',
    duration: 100,
    gasInput: { amount: 1000, gas: 'mekanism:hydrogen' },
    fluidInput: { amount: 1000, fluid: 'kubejs:nitric_acid' },
    itemInput: { ingredient: { item: REFINED } },
    itemOutput: { count: 1, item: ATM_DUST },
    gasOutput: { amount: 4000, gas: 'kubejs:ammonia' },
    energyRequired: 1000
  }).id('kubejs:reaction/allthemodium_dust_from_refined')

  console.info('[PLB] allthemodium: 4 dust recipes + 2 raw smelting -> crude ATM dust, ' +
    'plus ' + (ORES.length * 2) + ' ore smelting/blasting; 5 processing recipes added')
})
