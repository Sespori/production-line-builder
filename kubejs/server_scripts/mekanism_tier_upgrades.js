// priority: 80
// 四个 Mekanism 机器的配方提档：
//   mekanism:purification_chamber            净化仓
//   mekanism:chemical_oxidizer               化学氧化机
//   mekanism:thermal_evaporation_controller  热力蒸馏控制器
//   mekanism:thermal_evaporation_valve       热力蒸馏阀门
//
// 改动规则：
//   · 灌注合金  -> 强化合金    （#mekanism:alloys/infused -> mekanism:alloy_reinforced）
//   · 基础电路 / 高级电路 -> 精英电路（#forge:circuits/basic、#forge:circuits/advanced -> mekanism:elite_control_circuit）
//
// 原配方（Mekanism-1.20.1-10.4.16.80.jar :: data/mekanism/recipes/）：
//   purification_chamber     mek_data  ["ACA","OPO","ACA"]
//                            A=#mekanism:alloys/infused  C=#forge:circuits/advanced
//                            O=#forge:ingots/osmium      P=enrichment_chamber
//   chemical_oxidizer        mek_data  ["ACA","P#T","ACA"]
//                            A=#mekanism:alloys/infused  C=#forge:circuits/basic
//                            #=dynamic_tank  P=#mekanism:personal_storage  T=basic_chemical_tank
//   thermal_evaporation/controller  crafting_shaped  ["CGC","#B#","###"]
//                            C=#forge:circuits/advanced  G=#forge:glass_panes
//                            #=thermal_evaporation_block  B=bucket
//   thermal_evaporation/valve       crafting_shaped  [" # ","#C#"," # "]
//                            C=#forge:circuits/advanced  #=thermal_evaporation_block
//
// 注意：后两条（控制器 / 阀门）的原配方里**没有合金**，所以只换电路；
//       前两条的合金标签出现 4 次、电路标签出现 2 次，改完即为 4 个强化合金 + 2 个精英电路。
//
// 写法说明：
//   purification_chamber / chemical_oxidizer 是 mekanism:mek_data 自定义序列化器，
//   KubeJS 的 replaceInput 改不到，改为 remove + event.custom 完整重建（沿用原 ID）。
//   控制器 / 阀门是原版 crafting_shaped，直接 replaceInput 即可。
//
// 生效：/reload

ServerEvents.recipes(event => {
  // ── ① 净化仓：mek_data，重建 ─────────────────────────────────────────
  event.remove({ id: 'mekanism:purification_chamber' })

  event.custom({
    type: 'mekanism:mek_data',
    key: {
      A: { item: 'mekanism:alloy_reinforced' },
      C: { item: 'mekanism:elite_control_circuit' },
      O: { tag: 'forge:ingots/osmium' },
      P: { item: 'mekanism:enrichment_chamber' }
    },
    pattern: ['ACA', 'OPO', 'ACA'],
    result: { item: 'mekanism:purification_chamber' }
  }).id('mekanism:purification_chamber')

  // ── ② 化学氧化机：mek_data，重建 ─────────────────────────────────────
  event.remove({ id: 'mekanism:chemical_oxidizer' })

  event.custom({
    type: 'mekanism:mek_data',
    key: {
      '#': { item: 'mekanism:dynamic_tank' },
      A: { item: 'mekanism:alloy_reinforced' },
      C: { item: 'mekanism:elite_control_circuit' },
      P: { tag: 'mekanism:personal_storage' },
      T: { item: 'mekanism:basic_chemical_tank' }
    },
    pattern: ['ACA', 'P#T', 'ACA'],
    result: { item: 'mekanism:chemical_oxidizer' }
  }).id('mekanism:chemical_oxidizer')

  // ── ③ 热力蒸馏控制器：原版有序合成，只换电路 ────────────────────────
  event.replaceInput(
    { id: 'mekanism:thermal_evaporation/controller' },
    '#forge:circuits/advanced',
    'mekanism:elite_control_circuit'
  )

  // ── ④ 热力蒸馏阀门：原版有序合成，只换电路 ──────────────────────────
  event.replaceInput(
    { id: 'mekanism:thermal_evaporation/valve' },
    '#forge:circuits/advanced',
    'mekanism:elite_control_circuit'
  )
})
