// priority: 100
// 在 thermal:machine_bottler（灌装机 / Bottler）中新增 HDPE 颗粒配方：
//   1000mb mekanism:ethene + 10x mekanism:substrate  ->  20x mekanism:hdpe_pellet   耗能 2000 RF
//
// 格式参考 thermal_expansion :: data/thermal/recipes/machines/bottler/bottler_mossy_stone_bricks.json
//   ingredients: [ {item/tag}, {fluid, amount} ]，result: [ {item, count} ]，energy 为整数 RF
//
// 原料与产出按 100mb + 1 substrate -> 2 pellet 的基准等比放大 10 倍，比例不变、耗能不变：
//   倍数  乙烯      基质   产出      单次耗能   单颗耗能
//   1x    100mb     1      2 颗      2000 RF    1000 RF
//   10x   1000mb    10     20 颗     2000 RF    100 RF   ← 当前
//
// 对照 Mekanism 原路线（mekanism:reaction）：
//   50mb ethene + 10mb oxygen + 1 substrate -> 1 pellet，1000 J
//   本配方不需要氧气，单颗颗粒的乙烯/基质用量均为原版的两倍。
// 生效：/reload

ServerEvents.recipes(event => {
  event.custom({
    type: 'thermal:bottler',
    ingredients: [
      { item: 'mekanism:substrate', count: 10 },
      { fluid: 'mekanism:ethene', amount: 1000 }
    ],
    result: [
      { item: 'mekanism:hdpe_pellet', count: 20 }
    ],
    energy: 2000
  }).id('kubejs:bottler_hdpe_pellet_from_ethene')
})
