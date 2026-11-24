// priority: 0
// Ars Nouveau 灌注室（ars_nouveau:imbuement_chamber）自定义配方
//
// 配方类型：ars_nouveau:imbuement（ImbuementRecipe$Serializer.fromJson 逐字段核对过）
//   input          单个 Ingredient，可 {item} / {tag} / 数组（多选一）
//   output         字符串物品 ID（不是 {item,count} 对象）
//   count          int，必填
//   source         int，消耗的魔源，必填
//   pedestalItems  数组，必填（空写 []），每项形如 { item: { item: '...' } }（外层 item 是包装字段）
//
// 机器机制（反编译 ImbuementTile / ImbuementRecipe 确认）：
//   · 只有一个输入槽，匹配只看 item/tag 不看数量；完成时 setStackInSlot(0, 产物)，
//     整个槽被覆盖 —— 槽里多放几个会一起消失，但配方并不"要求"数量。
//   · 底座物品**不消耗**：isMatch 只比较「底座数量相等 + 多元集匹配」，
//     全类没有清空底座的调用（对比：附魔装置 EnchantingApparatusTile 确实会 setStack 清空）。
//     所以 pedestalItems 是"必须摆着"的条件，不是材料成本。
//   · 底座数量必须与配方列表长度**完全相等**，多摆一件带物品的底座就合不成。
//   · 同一物品可以在底座列表里重复出现（多元集匹配），因此「狂风精华 ×2」用两个底座条目表达。
//
// 本文件六条配方（前四条是「魔力粉基底灌成元素之杆」，后两条是物品升阶）：
//   ① 狂风之杆 thermal:blitz_rod <- 底座：狂风精华 ×2 / 幻翼膜 / 羽毛
//   ② 暴雪之杆 thermal:blizz_rod <- 底座：凛冰精华 ×2 / 墨囊 / 蓝冰
//   ③ 地岩之杆 thermal:basalz_rod <- 底座：地岩精华 ×2 / 黑曜石 / 深板岩圆石
//   ④ 烈焰棒 minecraft:blaze_rod  <- 底座：炽焰精华 ×2 / 岩浆块 / 岩浆桶
//   ⑤ 共振魔源宝石 kubejs:resonant_source_gem <- 输入魔源宝石，底座：七种精华各 1
//   ⑥ 末影珍珠 minecraft:ender_pearl <- 输入传送核心，底座：操控精华 ×2 / 末地石 / 黑曜石
//   ①②③④⑥ 消耗 500 魔源，⑤ 消耗 2000；产出均 1 个；底座物品不消耗，只要求摆齐。
//
// 生效：/reload

ServerEvents.recipes(event => {
  event.custom({
    type: 'ars_nouveau:imbuement',
    input: { item: 'kubejs:dust_mana_base' },
    output: 'thermal:blitz_rod',
    count: 1,
    source: 500,
    pedestalItems: [
      { item: { item: 'ars_nouveau:air_essence' } },
      { item: { item: 'ars_nouveau:air_essence' } },
      { item: { item: 'minecraft:phantom_membrane' } },
      { item: { item: 'minecraft:feather' } }
    ]
  }).id('kubejs:imbuement/blitz_rod')

  // 暴雪之杆：魔力粉基底 + 凛冰精华 ×2 / 墨囊 / 蓝冰
  event.custom({
    type: 'ars_nouveau:imbuement',
    input: { item: 'kubejs:dust_mana_base' },
    output: 'thermal:blizz_rod',
    count: 1,
    source: 500,
    pedestalItems: [
      { item: { item: 'ars_nouveau:water_essence' } },
      { item: { item: 'ars_nouveau:water_essence' } },
      { item: { item: 'minecraft:ink_sac' } },
      { item: { item: 'minecraft:blue_ice' } }
    ]
  }).id('kubejs:imbuement/blizz_rod')

  // 地岩之杆：魔力粉基底 + 地岩精华 ×2 / 黑曜石 / 深板岩圆石
  event.custom({
    type: 'ars_nouveau:imbuement',
    input: { item: 'kubejs:dust_mana_base' },
    output: 'thermal:basalz_rod',
    count: 1,
    source: 500,
    pedestalItems: [
      { item: { item: 'ars_nouveau:earth_essence' } },
      { item: { item: 'ars_nouveau:earth_essence' } },
      { item: { item: 'minecraft:obsidian' } },
      { item: { item: 'minecraft:cobbled_deepslate' } }
    ]
  }).id('kubejs:imbuement/basalz_rod')

  // 烈焰棒：魔力粉基底 + 炽焰精华 ×2 / 岩浆块 / 岩浆桶
  event.custom({
    type: 'ars_nouveau:imbuement',
    input: { item: 'kubejs:dust_mana_base' },
    output: 'minecraft:blaze_rod',
    count: 1,
    source: 500,
    pedestalItems: [
      { item: { item: 'ars_nouveau:fire_essence' } },
      { item: { item: 'ars_nouveau:fire_essence' } },
      { item: { item: 'minecraft:magma_block' } },
      { item: { item: 'minecraft:lava_bucket' } }
    ]
  }).id('kubejs:imbuement/blaze_rod')

  // 共振魔源宝石：魔源宝石 + 七种精华各一（7 个底座）-> 2000 魔源
  //   产物 kubejs:resonant_source_gem 由 startup_scripts/custom_items.js 注册，
  //   粉碎机可再拆回 9 个魔力粉基底（见 custom_recipes.js）。
  event.custom({
    type: 'ars_nouveau:imbuement',
    input: { item: 'ars_nouveau:source_gem' },
    output: 'kubejs:resonant_source_gem',
    count: 1,
    source: 2000,
    pedestalItems: [
      { item: { item: 'ars_nouveau:fire_essence' } },
      { item: { item: 'ars_nouveau:manipulation_essence' } },
      { item: { item: 'ars_nouveau:air_essence' } },
      { item: { item: 'ars_nouveau:earth_essence' } },
      { item: { item: 'ars_nouveau:conjuration_essence' } },
      { item: { item: 'ars_nouveau:water_essence' } },
      { item: { item: 'ars_nouveau:abjuration_essence' } }
    ]
  }).id('kubejs:imbuement/resonant_source_gem')

  // 末影珍珠：传送核心 + 操控精华 ×2 / 末地石 / 黑曜石（4 个底座）-> 500 魔源
  event.custom({
    type: 'ars_nouveau:imbuement',
    input: { item: 'mekanism:teleportation_core' },
    output: 'minecraft:ender_pearl',
    count: 1,
    source: 500,
    pedestalItems: [
      { item: { item: 'ars_nouveau:manipulation_essence' } },
      { item: { item: 'ars_nouveau:manipulation_essence' } },
      { item: { item: 'minecraft:end_stone' } },
      { item: { item: 'minecraft:obsidian' } }
    ]
  }).id('kubejs:imbuement/ender_pearl')
})
