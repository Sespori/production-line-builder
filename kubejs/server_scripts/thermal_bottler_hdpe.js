// priority: 100
// 在 thermal:machine_bottler（灌装机 / Bottler）中新增 HDPE 颗粒配方：
//   100mb mekanism:ethene + 1x mekanism:substrate  ->  2x mekanism:hdpe_pellet   耗能 2000 RF
//
// 格式参考 thermal_expansion :: data/thermal/recipes/machines/bottler/bottler_mossy_stone_bricks.json
//   ingredients: [ {item/tag}, {fluid, amount} ]，result: [ {item, count} ]，energy 为整数 RF
//
// 对照 Mekanism 原路线（mekanism:reaction）：
//   50mb ethene + 10mb oxygen + 1 substrate -> 1 pellet，1000 J
//   本配方不需要氧气，单颗颗粒的乙烯/基质用量均为原版的两倍（100mb + 1 substrate 出 2 颗）。
// 生效：/reload

ServerEvents.recipes(event => {
  event.custom({
    type: 'thermal:bottler',
    ingredients: [
      { item: 'mekanism:substrate', count: 1 },
      { fluid: 'mekanism:ethene', amount: 100 }
    ],
    result: [
      { item: 'mekanism:hdpe_pellet', count: 2 }
    ],
    energy: 2000
  }).id('kubejs:bottler_hdpe_pellet_from_ethene')
})
