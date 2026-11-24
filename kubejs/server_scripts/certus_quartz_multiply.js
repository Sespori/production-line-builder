// priority: 0
// 赛特斯石英水晶 ↔ 赛特斯石英簇 的增殖循环（参照紫水晶那一对配方）
//
// 参考对象：
//   ① mekanism_custom_recipes.js 的 kubejs:enriching/amethyst_cluster
//      富集室 mekanism:enrichment_chamber：minecraft:amethyst_cluster → 3 × amethyst_shard
//   ② thermal 原生 crystallizer_amethyst_cluster.json
//      结晶器 thermal:machine_crystallizer：2000 mB 水 + 1 amethyst_shard → 1 amethyst_cluster
//   两条合起来就是「1 簇 → 3 碎片 → 3 簇」的增殖环（净增靠水与机器能耗支撑）。
//
// 本文件照同一套数值给 AE2 的赛特斯石英复刻一对：
//   1) 富集室 mekanism:enrichment_chamber（类型 mekanism:enriching）
//      ae2:quartz_cluster（赛特斯石英簇）→ 3 × ae2:certus_quartz_crystal（赛特斯石英水晶）
//   2) 结晶器 thermal:machine_crystallizer（类型 thermal:crystallizer）
//      2000 mB 水 + 1 ae2:certus_quartz_crystal → 1 ae2:quartz_cluster
//
// 说明：
//   · 全实例扫描过，没有任何配方引用 ae2:quartz_cluster（赛特斯石英簇，只在陨石里自然生长），
//     所以不会和现有配方重复或互相覆盖。
//   · 结晶器那条必须带流体（照抄紫水晶的 2000 mB 水）：Thermal 的结晶器 JEI 分类
//     与致冷器一样按流体槽取输入，纯物品配方在 JEI 里会显示异常。
//   · 结晶器原配方没有写 energy 字段，走机器默认能耗，这里同样不写，保持一致。
// 生效：/reload

ServerEvents.recipes(event => {
  // ── 富集室：赛特斯石英簇 → 3 赛特斯石英水晶 ──
  event.custom({
    type: 'mekanism:enriching',
    input: { ingredient: { item: 'ae2:quartz_cluster' } },
    output: { count: 3, item: 'ae2:certus_quartz_crystal' }
  }).id('kubejs:enriching/quartz_cluster')

  // ── 结晶器：2000 mB 水 + 1 赛特斯石英水晶 → 1 赛特斯石英簇 ──
  event.custom({
    type: 'thermal:crystallizer',
    ingredients: [
      { fluid: 'minecraft:water', amount: 2000 },
      { item: 'ae2:certus_quartz_crystal' }
    ],
    result: [{ item: 'ae2:quartz_cluster' }]
  }).id('kubejs:crystallizer/quartz_cluster')
})
