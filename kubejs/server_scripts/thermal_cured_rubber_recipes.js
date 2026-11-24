// priority: 90
// 收紧 thermal:cured_rubber（硫化橡胶）的制作途径
//
// 目标：只有「用硫」或「由橡胶块拆回」的途径可用；用硫的途径统一收敛到灌装机。
//
// ── 保留（不动）──
//   thermal:machines/press/unpacking/press_cured_rubber_unpacking
//      压印机：1 橡胶块 + 拆包模具 -> 4 个（原料就是 cured_rubber_block）
//   thermal:storage/cured_rubber_from_block
//      工作台无序：1 橡胶块 -> 4 个（同上）
//
// ── 禁用 ──
//   thermal:smelting/cured_rubber_from_smelting
//      熔炉：1 thermal:rubber -> 1 cured_rubber，200 tick / 经验 0.2（无硫、无橡胶块）
//   thermal:machines/smelter/smelter_cured_rubber
//      感应炉：2 橡胶 + 1 硫（#forge:gems/sulfur ∪ #forge:dusts/sulfur）-> 4 个
//      虽然用了硫，但按要求改由灌装机承担，这条一并删掉。
//
// ── 新增（写在 custom_recipes.js 第 6 条）──
//   kubejs:bottler/cured_rubber
//      灌装机：1000 mB thermal:latex（植物胶乳）+ 1 thermal:sulfur_dust
//              -> 3 个 thermal:cured_rubber，2000 RF
//
// ── 关于 EnderIO 合金炉里那一条 ──
//   合金炉（enderio:alloy_smelter）的「熔炼模式」没有自己的数据包配方：
//   AlloySmelterBlockEntity 用的是 RecipeCaches.SMELTING（原版熔炼配方缓存，
//   由 AddReloadListenerEvent 的监听器在每次数据包重载时重建），熔炼模式直接吃
//   minecraft:smelting。所以 JEI 合金炉分类下那条 cured_rubber 就是上面的熔炉配方，
//   不是独立条目（EnderIO 的 jar 里没有 cured_rubber 字样）。
//
// 说明：产出 cured_rubber 的配方全实例只有 4 条（含 thermal jar 内嵌的 thermal_core），
// 其中两条要删（熔炉、感应炉），两条保留（都要橡胶块）。
// 删除都按 ID 精确删 + 「类型 + 产物」补一刀；不能只按产物删，否则会把保留的两条也带走。
//
// 生效：/reload

ServerEvents.recipes(event => {
  // 熔炉捷径（EnderIO 合金炉的熔炼模式共享这条）
  event.remove({ id: 'thermal:smelting/cured_rubber_from_smelting' })
  event.remove({ type: 'minecraft:smelting', output: 'thermal:cured_rubber' })

  // 感应炉：2 橡胶 + 1 硫 -> 4 个
  event.remove({ id: 'thermal:machines/smelter/smelter_cured_rubber' })
  event.remove({ type: 'thermal:smelter', output: 'thermal:cured_rubber' })

  console.info('[PLB] cured rubber: furnace shortcut + thermal smelter recipe removed; sulfur route now goes through the bottler')
})
