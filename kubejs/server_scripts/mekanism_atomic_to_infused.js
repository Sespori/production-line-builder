// priority: 80
// 把三个 Mekanism 机器/物品配方里的原子合金换成灌注合金：
//   mekanism:digital_miner        数字采矿机
//   mekanism:teleportation_core   传送核心
//   mekanism:robit                机器人
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
//
// 写法说明：
//  · 原配方用的是标签 #mekanism:alloys/atomic（= #forge:alloys/ultimate），不是直接的物品 ID；
//    这里按要求换成具体物品 mekanism:alloy_infused。
//  · digital_miner / robit 是 mekanism:mek_data 自定义序列化器，KubeJS 的 replaceInput 改不到，
//    因此 remove + event.custom 完整重建（ID 沿用原 ID，避免 JEI 出现重复条目）。
//  · teleportation_core 是原版 crafting_shaped，用 replaceInput 精确改一处即可。
//  · teleportation_core 的图案里 A 出现 2 次（上下各一），所以改完是 2 个灌注合金。
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
})
