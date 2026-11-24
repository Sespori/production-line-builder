// priority: 0
// 为移植回来的 4 种元素粉补上合成配方，并给对应流体加熔岩炉（machine_crucible）配方
//
// ── 老版配方（ThermalFoundation 1.12.2-2.6.7.1，assets/thermalfoundation/recipes/）──
//   四个元素粉结构完全一致：2× 元素粉 + 1× 红石粉 + 1× 主题材料 → 2 个成品
//     炽焱粉 dust_pyrotheum : 2× dustBlaze  + dustRedstone + dustSulfur
//     凛冰粉 dust_cryotheum : 2× dustBlizz  + dustRedstone + 雪球
//     地岩粉 dust_petrotheum: 2× dustBasalz + dustRedstone + dustObsidian
//     清风粉 dust_aerotheum : 2× dustBlitz  + dustRedstone + dustSaltpeter
//   材料含义与 1.20.1 对应关系（均在本整合包内真实存在）：
//     dustBlitz  → thermal:blitz_powder（狂风粉）
//     dustBlizz  → thermal:blizz_powder（暴雪粉）
//     dustBasalz → thermal:basalz_powder（岩石粉）
//     dustBlaze  → minecraft:blaze_powder（烈焰粉，原版）
//     dustSulfur → thermal:sulfur_dust（硫粉，见 sulfur_unify.js）
//     dustSaltpeter → thermal:niter_dust（硝石粉）
//     dustObsidian  → mekanism:dust_obsidian（整合包内唯一黑曜石粉）
//
//   魔力粉（dust_mana）在 1.12.2 没有获取途径，本包自定义合成：
//     1× 魔力粉基底（正中）+ 4 种元素粉（四条边中间）→ 1 个魔力粉
//
// ── 熔岩炉 ──
// 老版 1 个粉 → 250 mB 对应流体、8000 RF（MC 百科配方表数据），五种流体一致。
// 本包按需求把耗能降为老版的四分之一：8000 → **2000 RF**（产量与配方 ID 不变）。
//
// 生效：/reload

ServerEvents.recipes(event => {
  // ── 元素粉：2× 元素源 + 红石粉 + 主题材料 → 2 个 ──
  event.shapeless('2x kubejs:dust_pyrotheum', [
    'minecraft:blaze_powder', 'minecraft:blaze_powder', 'minecraft:redstone', 'thermal:sulfur_dust'
  ]).id('kubejs:thermal/dust_pyrotheum')

  event.shapeless('2x kubejs:dust_cryotheum', [
    'thermal:blizz_powder', 'thermal:blizz_powder', 'minecraft:redstone', 'minecraft:snowball'
  ]).id('kubejs:thermal/dust_cryotheum')

  event.shapeless('2x kubejs:dust_petrotheum', [
    'thermal:basalz_powder', 'thermal:basalz_powder', 'minecraft:redstone', 'mekanism:dust_obsidian'
  ]).id('kubejs:thermal/dust_petrotheum')

  event.shapeless('2x kubejs:dust_aerotheum', [
    'thermal:blitz_powder', 'thermal:blitz_powder', 'minecraft:redstone', 'thermal:niter_dust'
  ]).id('kubejs:thermal/dust_aerotheum')

  // ── 魔力粉：正中魔力粉基底 + 四条边中间的 4 种元素粉 → 4 个 ──
  //      . A .      A = 清风粉 dust_aerotheum
  //      C M Y      C = 凛冰粉 dust_cryotheum
  //      . P .      P = 地岩粉 dust_petrotheum
  //                 Y = 炽焱粉 dust_pyrotheum
  //                 M = 魔力粉基底 dust_mana_base
  event.shaped('4x kubejs:dust_mana', [
    ' A ',
    'CMY',
    ' P '
  ], {
    A: 'kubejs:dust_aerotheum',
    C: 'kubejs:dust_cryotheum',
    P: 'kubejs:dust_petrotheum',
    Y: 'kubejs:dust_pyrotheum',
    M: 'kubejs:dust_mana_base'
  }).id('kubejs:thermal/dust_mana')

  // ── 熔岩炉：1 个粉 → 250 mB 对应流体，2 000 RF ──
  const CRUCIBLE = [
    ['kubejs:dust_pyrotheum', 'kubejs:pyrotheum'],
    ['kubejs:dust_cryotheum', 'kubejs:cryotheum'],
    ['kubejs:dust_petrotheum', 'kubejs:petrotheum'],
    ['kubejs:dust_aerotheum', 'kubejs:aerotheum'],
    ['kubejs:dust_mana', 'kubejs:mana']
  ]

  CRUCIBLE.forEach(pair => {
    event.custom({
      type: 'thermal:crucible',
      ingredient: { item: pair[0] },
      result: [{ fluid: pair[1], amount: 250 }],
      energy: 2000
    }).id('kubejs:crucible/' + pair[1].split(':')[1])
  })
})
