// priority: 0
// 蚀刻酸桶：改成压力室配方（铜粉 + 液态氯桶 + 液态氨桶）
//
// ── 原配方 ──
//   pneumaticcraft:pressure_chamber/etching_acid
//     1 塑料桶 + 2 腐肉 + 2 蜘蛛眼 + 2 火药（#forge:gunpowder），pressure 1.0
//     -> 1 蚀刻酸桶
//
// ── 新配方 ──
//   1 铜粉（alltheores:copper_dust）
//   1 液态氯桶（mekanism:chlorine_bucket）
//   4 液态氨桶（kubejs:liquid_ammonia_bucket，流体注册见 startup_scripts/custom_fluids.js）
//   pressure 1.0
//   -> 1 蚀刻酸桶（pneumaticcraft:etching_acid_bucket）
//   -> 4 空桶（minecraft:bucket）
//
// ── 写法依据 ──
//   照抄本体自己的 pressure_chamber/milk_to_slime_balls：
//     1 牛奶桶 + 4 绿色染料 -> 4 粘液球 + 1 空桶
//   输入侧用 {"type":"pneumaticcraft:stacked_item","count":N}，
//   输出侧用 {"count":N,"item":...}，多产物直接在 results 数组里并列 ——
//   桶换桶正是这条配方已经在做的事。
//
// ── 一个容易误会的点 ──
//   压力室的物品是以**掉落物实体**放在腔体里的，不吃 GUI 槽位，
//   所以 4 个氨桶 + 氯桶 + 铜粉共 6 个物品不会被槽位数量卡住，
//   只要它们都在腔体内的同一块空间里即可。
//
// 生效：/reload。但液态氨是 startup 注册的，第一次要重启游戏，
//       否则找不到 kubejs:liquid_ammonia_bucket 会让这条配方解析失败。

ServerEvents.recipes(event => {
  const ID = 'pneumaticcraft:pressure_chamber/etching_acid'
  event.remove({ id: ID })

  event.custom({
    type: 'pneumaticcraft:pressure_chamber',
    inputs: [
      { item: 'alltheores:copper_dust' },
      { item: 'mekanism:chlorine_bucket' },
      { type: 'pneumaticcraft:stacked_item', count: 4, item: 'kubejs:liquid_ammonia_bucket' }
    ],
    pressure: 1.0,
    results: [
      { item: 'pneumaticcraft:etching_acid_bucket' },
      { count: 4, item: 'minecraft:bucket' }
    ]
  }).id(ID)

  console.info('[PLB] etching acid: pressure chamber = 1 copper dust + 1 chlorine bucket ' +
    '+ 4 liquid ammonia buckets -> 1 etching acid bucket + 4 buckets')
})
