// priority: 80
// 三台化学机器的配方降档：
//   · 精炼黑曜石锭 -> 强化合金      （#forge:ingots/refined_obsidian -> mekanism:alloy_reinforced）
//   · 终极电路     -> 精英电路      （#forge:circuits/ultimate -> mekanism:elite_control_circuit）
//
// 原配方（Mekanism-1.20.1-10.4.16.80.jar :: data/mekanism/recipes/）：
//   chemical_dissolution_chamber.json  type=mekanism:mek_data          ["ITI","CXC","ITI"]
//     I=#forge:ingots/refined_obsidian  C=#forge:circuits/ultimate
//     T=basic_chemical_tank             X=steel_casing
//   chemical_washer.json               type=mekanism:mek_data          ["IBI","CXC","ITI"]
//     I=#forge:ingots/refined_obsidian  C=#forge:circuits/ultimate
//     B=basic_fluid_tank                T=basic_chemical_tank          X=steel_casing
//   chemical_crystallizer.json         type=minecraft:crafting_shaped ["IAI","CXC","IAI"]
//     I=#forge:ingots/refined_obsidian  C=#forge:circuits/ultimate
//     A=#forge:gems/fluorite            X=steel_casing
//
// 改动后（材料数量不变，只换品类）：
//   溶解室  ["ITI","CXC","ITI"]  I=强化合金 ×4，C=精英电路 ×2
//   洗涤机  ["IBI","CXC","ITI"]  I=强化合金 ×4，C=精英电路 ×2
//   结晶器  ["IAI","CXC","IAI"]  I=强化合金 ×4，C=精英电路 ×2
//
// 写法说明：
//   溶解室 / 洗涤机是 mekanism:mek_data 自定义序列化器，replaceInput 改不到 -> remove + event.custom 重建；
//   结晶器是原版 crafting_shaped -> 两次 replaceInput 即可。三者 ID 均沿用原 ID。
//
// 注：mekanism:elite_control_circuit 本身不在本次范围内（其配方是「强化合金 + 高级电路」，不含上述两种材料）。
//
// 生效：/reload

ServerEvents.recipes(event => {
  // ── ① 化学溶解室：重建 ───────────────────────────────────────────────
  event.remove({ id: 'mekanism:chemical_dissolution_chamber' })

  event.custom({
    type: 'mekanism:mek_data',
    key: {
      C: { item: 'mekanism:elite_control_circuit' },
      I: { item: 'mekanism:alloy_reinforced' },
      T: { item: 'mekanism:basic_chemical_tank' },
      X: { item: 'mekanism:steel_casing' }
    },
    pattern: ['ITI', 'CXC', 'ITI'],
    result: { item: 'mekanism:chemical_dissolution_chamber' }
  }).id('mekanism:chemical_dissolution_chamber')

  // ── ② 化学洗涤机：重建 ───────────────────────────────────────────────
  event.remove({ id: 'mekanism:chemical_washer' })

  event.custom({
    type: 'mekanism:mek_data',
    key: {
      B: { item: 'mekanism:basic_fluid_tank' },
      C: { item: 'mekanism:elite_control_circuit' },
      I: { item: 'mekanism:alloy_reinforced' },
      T: { item: 'mekanism:basic_chemical_tank' },
      X: { item: 'mekanism:steel_casing' }
    },
    pattern: ['IBI', 'CXC', 'ITI'],
    result: { item: 'mekanism:chemical_washer' }
  }).id('mekanism:chemical_washer')

  // ── ③ 化学结晶器：原版有序合成，两处替换 ────────────────────────────
  event.replaceInput(
    { id: 'mekanism:chemical_crystallizer' },
    '#forge:ingots/refined_obsidian',
    'mekanism:alloy_reinforced'
  )

  event.replaceInput(
    { id: 'mekanism:chemical_crystallizer' },
    '#forge:circuits/ultimate',
    'mekanism:elite_control_circuit'
  )
})
