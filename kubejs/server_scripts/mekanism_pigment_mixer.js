// priority: 80
// 颜料混合器配方降档：
//   · 强化合金 -> 灌注合金      （#mekanism:alloys/reinforced -> mekanism:alloy_infused）
//   · 精英电路 -> 高级电路      （#forge:circuits/elite -> mekanism:advanced_control_circuit）
//
// 原配方（Mekanism-1.20.1-10.4.16.80.jar :: data/mekanism/recipes/pigment_mixer.json）：
//   type=minecraft:crafting_shaped
//   ["ACA","#X#","ACA"]
//   A=#mekanism:alloys/reinforced  C=#forge:circuits/elite
//   #=mekanism:hdpe_rod            X=mekanism:steel_casing
//
// 改动后：["ACA","#X#","ACA"]  A=灌注合金 ×4，C=高级电路 ×2，其余不变。
//
// 说明：原版有序合成，直接用两次 replaceInput 精确替换，ID 保持不变。
//
// 生效：/reload

ServerEvents.recipes(event => {
  event.replaceInput(
    { id: 'mekanism:pigment_mixer' },
    '#mekanism:alloys/reinforced',
    'mekanism:alloy_infused'
  )

  event.replaceInput(
    { id: 'mekanism:pigment_mixer' },
    '#forge:circuits/elite',
    'mekanism:advanced_control_circuit'
  )
})
