// priority: 0
// 铱产线：铱矿 / 粗铱（raw material）不再直接出「铱粉」或「铱锭」，
// 一律先出中间产物 kubejs:crude_iridium_dust（粗铱粉），再走氯化路线：
//
//   铱矿 / 粗铱 ──┬─ 富集仓（矿石 2、粗铱块 12、粗铱 ×3 → 4）
//                 ├─ 工作台锤子（粗铱 → 2）
//                 └─ 熔炉 / 高炉（矿石、深层矿石、粗铱 → 1）
//                        ↓
//              kubejs:crude_iridium_dust（粗铱粉）
//                        ↓  PRC：1000 氯化氢 + 1000 水
//              kubejs:iridium_chloride_dust（氯化铱粉）
//                        ↓  PRC：1000 水 + 1000 氢气
//            alltheores:dirty_iridium_dust（污浊铱粉）
//                        ↓  富集仓（alltheores:mek_processing/iridium/dust/from_dirty_dust）
//                   alltheores:iridium_dust（铱粉）
//                        ↓  熔炼 / 高炉（原配方保留）
//                   alltheores:iridium_ingot（铱锭）
//
// 定位与铂产线完全对称（见 alltheores_platinum_dust_to_crude.js）：
//   · 保留：原料是「铱锭」或「脏铱粉」的制粉配方
//     （mek_processing/iridium/dust/from_ingot、from_dirty_dust）；
//   · 改写：4 条直出铱粉 + 6 条矿石/粗铱直烧铱锭；
//   · 补齐：nether / end / other 三种铱矿的熔炼与高炉
//     （AllTheOres 只为 iridium_ore / deepslate_iridium_ore 写了烧炼，
//       另外三种矿石方块存在但原本没有烧炼途径）。
//
// 两条 PRC 配方写在 mekanism_custom_recipes.js 里（与铂的那条放在一起）。
// 生效：/reload（物品注册与贴图需要重启，见 startup_scripts/custom_items.js）

ServerEvents.recipes(event => {
  const CRUDE = 'kubejs:crude_iridium_dust'

  // ══════════════════════════════════════════════════════════════════════
  // 1) 直出铱粉的 4 条 → 粗铱粉
  // ══════════════════════════════════════════════════════════════════════
  const DUST_TARGETS = [
    'alltheores:mek_processing/iridium/dust/from_ore',
    'alltheores:mek_processing/iridium/dust/from_raw_block',
    'alltheores:mek_processing/iridium/dust/from_raw_ore',
    'alltheores:iridium_dust_from_hammer_crushing'
  ]
  DUST_TARGETS.forEach(id => event.remove({ id: id }))

  // 富集仓：铱矿石 → 2 粗铱粉
  event.custom({
    type: 'mekanism:enriching',
    input: { ingredient: { tag: 'forge:ores/iridium' } },
    output: { item: CRUDE, count: 2 }
  }).id('alltheores:mek_processing/iridium/dust/from_ore')

  // 富集仓：粗铱块 → 12 粗铱粉
  event.custom({
    type: 'mekanism:enriching',
    input: { ingredient: { tag: 'forge:storage_blocks/raw_iridium' } },
    output: { item: CRUDE, count: 12 }
  }).id('alltheores:mek_processing/iridium/dust/from_raw_block')

  // 富集仓：3 个粗铱 → 4 粗铱粉（amount 是消耗数量，不能丢）
  event.custom({
    type: 'mekanism:enriching',
    input: { amount: 3, ingredient: { tag: 'forge:raw_materials/iridium' } },
    output: { item: CRUDE, count: 4 }
  }).id('alltheores:mek_processing/iridium/dust/from_raw_ore')

  // 工作台（锤子）：粗铱 → 2 粗铱粉
  event.custom({
    type: 'minecraft:crafting_shapeless',
    category: 'misc',
    ingredients: [
      { tag: 'alltheores:ore_hammers' },
      { tag: 'forge:raw_materials/iridium' }
    ],
    result: { item: CRUDE, count: 2 }
  }).id('alltheores:iridium_dust_from_hammer_crushing')

  // ══════════════════════════════════════════════════════════════════════
  // 2) 矿石 / 粗铱 直烧铱锭的 6 条 → 粗铱粉
  //    数值全部照抄原配方（烹饪时间、经验），只换产物（1 个粗铱粉）。
  // ══════════════════════════════════════════════════════════════════════
  // [配方 ID, 配方类型, 原料物品, 烹饪时间, 经验]
  const SMELT_TARGETS = [
    ['alltheores:iridium_ingot_from_ore',                'minecraft:smelting', 'alltheores:iridium_ore',            200, 0.15],
    ['alltheores:iridium_ingot_from_ore_blasting',       'minecraft:blasting', 'alltheores:iridium_ore',            200, 0.15],
    ['alltheores:iridium_ingot_from_slate_ore',          'minecraft:smelting', 'alltheores:deepslate_iridium_ore',  200, 0.15],
    ['alltheores:iridium_ingot_from_slate_ore_blasting', 'minecraft:blasting', 'alltheores:deepslate_iridium_ore',  200, 0.15],
    ['alltheores:iridium_ingot_from_raw',                'minecraft:smelting', 'alltheores:raw_iridium',            200, 0.15],
    ['alltheores:iridium_ingot_from_raw_blasting',       'minecraft:blasting', 'alltheores:raw_iridium',            100, 0.15]
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

  // ══════════════════════════════════════════════════════════════════════
  // 3) 补齐另外三种铱矿的熔炼 / 高炉
  //    #forge:ores/iridium 有 5 种矿石方块，AllTheOres 只给 iridium_ore /
  //    deepslate_iridium_ore 写了烧炼；nether / end / other 三种原本没有烧炼途径。
  //    数值沿用同模组的 200 tick / 0.15 经验，产物同样是粗铱粉。
  // ══════════════════════════════════════════════════════════════════════
  const EXTRA_ORES = [
    'alltheores:nether_iridium_ore',
    'alltheores:end_iridium_ore',
    'alltheores:other_iridium_ore'
  ]

  EXTRA_ORES.forEach(function (ore) {
    const name = ore.split(':')[1]
    event.custom({
      type: 'minecraft:smelting',
      category: 'misc',
      ingredient: { item: ore },
      result: CRUDE,
      experience: 0.15,
      cookingtime: 200
    }).id('kubejs:smelting/crude_iridium_from_' + name)

    event.custom({
      type: 'minecraft:blasting',
      category: 'misc',
      ingredient: { item: ore },
      result: CRUDE,
      experience: 0.15,
      cookingtime: 200
    }).id('kubejs:blasting/crude_iridium_from_' + name)
  })

  console.info('[PLB] iridium: 4 dust recipes + 6 ingot-smelting recipes -> crude iridium dust, ' +
    'plus ' + (EXTRA_ORES.length * 2) + ' new smelting/blasting recipes for nether/end/other ores')
})
