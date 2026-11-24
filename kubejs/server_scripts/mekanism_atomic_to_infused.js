// priority: 80
// 把四个 Mekanism 机器/物品配方里的原子合金换成灌注合金：
//   mekanism:digital_miner              数字采矿机
//   mekanism:teleportation_core         传送核心
//   mekanism:robit                      机器人
//   mekanism:quantum_entangloporter     量子传送器（同时把终极电路换成高级电路、
//                                       精炼黑曜石锭换成锇锭）
// 另外把 robit 配方里的精炼黑曜石锭换成 alltheores:osmium_ingot。
//
// 原配方（Mekanism-1.20.1-10.4.16.80.jar :: data/mekanism/recipes/）：
//   digital_miner      type=mekanism:mek_data
//                      ["ACA","SRS","TXT"]  A=#mekanism:alloys/atomic  C=#forge:circuits/basic
//                      R=robit  S=logistical_sorter  T=teleportation_core  X=steel_casing
//   robit              type=mekanism:mek_data
//                      [" S ","EAE","IPI"]  A=#mekanism:alloys/atomic  E=energy_tablet
//                      I=#forge:ingots/refined_obsidian  P=#mekanism:personal_storage  S=#forge:ingots/steel
//   teleportation_core type=minecraft:crafting_shaped
//                      ["#A#","IDI","#A#"]  A=#mekanism:alloys/atomic  #=#forge:gems/lapis
//                      I=#forge:ingots/gold  D=#forge:gems/diamond
//   quantum_entangloporter type=minecraft:crafting_shaped
//                      ["ICI","ATA","ICI"]  A=#mekanism:alloys/atomic  C=#forge:circuits/ultimate
//                      I=#forge:ingots/refined_obsidian  T=teleportation_core
//
// 说明：原子合金（mekanism:alloy_atomic）的生产链要经过强化合金，而强化合金的灌注配方
// 已被本包禁用（见 mekanism_tag_input_fix.js），这里把这几个机器改用灌注合金，避免卡死。
//
// 写法说明：
//  · 原配方用的是标签 #mekanism:alloys/atomic（= #forge:alloys/ultimate），不是直接的物品 ID；
//    这里按要求换成具体物品 mekanism:alloy_infused。
//  · digital_miner / robit 是 mekanism:mek_data 自定义序列化器，KubeJS 的 replaceInput 改不到，
//    因此 remove + event.custom 完整重建（ID 沿用原 ID，避免 JEI 出现重复条目）。
//  · teleportation_core 是原版 crafting_shaped，用 replaceInput 精确改一处即可。
//  · quantum_entangloporter 也是原版 crafting_shaped，但要同时换两种材料（原子合金 + 终极电路），
//    为免 replaceInput 对标签的两轮替换互相干扰，这里同样 remove + 重建，ID 不变。
//  · teleportation_core 的图案里 A 出现 2 次（上下各一），所以改完是 2 个灌注合金。
//  · quantum_entangloporter 的 A、C 各出现 2 次，I 出现 4 次，改完是
//    2 个灌注合金 + 2 个高级电路 + 4 个 alltheores:osmium_ingot，传送核心仍是 1 个。
//  · robit 的 I 出现 1 次（左下角），改完是 1 个 alltheores:osmium_ingot。
//
// 生效：/reload

ServerEvents.recipes(event => {
  // ── ① 传送核心：原版有序合成，直接替换输入 ──────────────────────────
  event.replaceInput(
    { id: 'mekanism:teleportation_core' },
    '#mekanism:alloys/atomic',
    'mekanism:alloy_infused'
  )

  // ── ② 数字采矿机：重建 ───────────────────────────────────────────────
  event.remove({ id: 'mekanism:digital_miner' })

  event.custom({
    type: 'mekanism:mek_data',
    key: {
      A: { item: 'mekanism:alloy_infused' },
      C: { tag: 'forge:circuits/basic' },
      R: { item: 'mekanism:robit' },
      S: { item: 'mekanism:logistical_sorter' },
      T: { item: 'mekanism:teleportation_core' },
      X: { item: 'mekanism:steel_casing' }
    },
    pattern: ['ACA', 'SRS', 'TXT'],
    result: { item: 'mekanism:digital_miner' }
  }).id('mekanism:digital_miner')

  // ── ③ 机器人：重建（原子合金 + 精炼黑曜石锭两处同时替换）─────────────
  event.remove({ id: 'mekanism:robit' })

  event.custom({
    type: 'mekanism:mek_data',
    key: {
      A: { item: 'mekanism:alloy_infused' },
      E: { item: 'mekanism:energy_tablet' },
      I: { item: 'alltheores:osmium_ingot' },
      P: { tag: 'mekanism:personal_storage' },
      S: { tag: 'forge:ingots/steel' }
    },
    pattern: [' S ', 'EAE', 'IPI'],
    result: { item: 'mekanism:robit' }
  }).id('mekanism:robit')

  // ── ④ 量子传送器：重建（原子合金 → 灌注合金、终极电路 → 高级电路、
  //                     精炼黑曜石锭 → 锇锭）────────────────────────────
  //   原配方 ["ICI","ATA","ICI"]，A、C 各出现 2 次，I 出现 4 次。
  //   传送核心（T）保持不变，仍是 1 个。
  event.remove({ id: 'mekanism:quantum_entangloporter' })

  event.shaped('mekanism:quantum_entangloporter', [
    'ICI',
    'ATA',
    'ICI'
  ], {
    I: 'alltheores:osmium_ingot',
    C: 'mekanism:advanced_control_circuit',
    A: 'mekanism:alloy_infused',
    T: 'mekanism:teleportation_core'
  }).id('mekanism:quantum_entangloporter')
})
