// priority: 100
// Pylons 模组三种过滤卡的合成配方改造
//
// 原配方（mob / player / potion 三种过滤卡结构完全相同）：
//
//   t c t        c = #forge:dyes/green              绿色染料
//   g d g        d = 各卡核心材料
//   g g g        g = #forge:glass                   玻璃（共 5 个）
//                t = minecraft:cyan_terracotta      青色陶瓦（共 2 个）
//
// 改造后：
//
//   t c t        t = mekanism:advanced_control_circuit   高级控制电路
//   g d g        g = #mekanismadditions:plastic_blocks/transparent   透明塑料块（18 色任选）
//   g g g
//
// 说明：
//   - 玻璃出现在 g 键，第二排左右 2 格 + 第三排 3 格，共 5 处，整类替换为透明塑料块
//   - 青色陶瓦出现在 t 键，第一排左右 2 格，整类替换为高级控制电路
//   - c 键（绿染料）不变；d 键核心材料不变：
//       mob_filter    -> #forge:ingots/netherite   下界合金锭
//       player_filter -> #forge:gems/diamond       钻石
//       potion_filter -> #forge:gems/emerald       绿宝石
//   - 配方 ID、合成书分组（group: pylons）、产出数量均保持不变
// 生效：/reload

ServerEvents.recipes(event => {
  const FILTERS = [
    'pylons:mob_filter',
    'pylons:player_filter',
    'pylons:potion_filter'
  ]

  FILTERS.forEach(id => {
    event.replaceInput(
      { id: id },
      '#forge:glass',
      '#mekanismadditions:plastic_blocks/transparent'
    )

    event.replaceInput(
      { id: id },
      'minecraft:cyan_terracotta',
      'mekanism:advanced_control_circuit'
    )
  })
})
