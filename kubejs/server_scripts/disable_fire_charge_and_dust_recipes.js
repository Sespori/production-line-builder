// priority: 50
// 本脚本做两件事，均为「只删除、不重建」：
//
// ① 禁用所有以 minecraft:fire_charge 为输入材料的配方
//    thermal_foundation 里有 4 条「金属粉尘/锭 + 火焰弹 → 合金锭」的无机器合成：
//      thermal:fire_charge/bronze_ingot_4      -> 4x thermal:bronze_ingot
//      thermal:fire_charge/constantan_ingot_2  -> 2x thermal:constantan_ingot
//      thermal:fire_charge/electrum_ingot_2    -> 2x thermal:electrum_ingot
//      thermal:fire_charge/invar_ingot_3       -> 3x thermal:invar_ingot
//    先用 input 过滤器整类清除（今后任何模组/数据包再用火焰弹做材料也会一并失效），
//    再按 ID 精确兜底一次，防止个别配方因结构特殊而未被 input 过滤器匹配到。
//    注：火焰弹本身的合成配方（火药 + 烈焰粉 + 煤炭）不受影响。
//
// ② 禁用 alltheores 为 4 种合金粉尘添加的「锤子手工搅拌」配方
//      alltheores:enderium_dust_from_alloy_blending  -> 4x alltheores:enderium_dust
//      alltheores:lumium_dust_from_alloy_blending    -> 4x alltheores:lumium_dust
//      alltheores:signalum_dust_from_alloy_blending  -> 4x alltheores:signalum_dust
//      alltheores:steel_dust_from_alloy_blending     -> 1x alltheores:steel_dust
//    这里只按 ID 删除，不用 output 过滤器 —— Almost Unified 可能已把 thermal:pulverizer
//    的产物改写成 alltheores:*_dust，按产物删会连带误删粉碎机配方。
//
// 生效：/reload

ServerEvents.recipes(event => {
  // ── ① 火焰弹参与的配方 ────────────────────────────────────────────────
  event.remove({ input: 'minecraft:fire_charge' })

  const FIRE_CHARGE_RECIPES = [
    // thermal_foundation 内嵌 jar（data/thermal/recipes/*.json）
    'thermal:enderium_ingot_2',
    'thermal:lumium_ingot_4',
    'thermal:signalum_ingot_4',
    'thermal:enderium_glass_2',
    'thermal:lumium_glass_2',
    'thermal:signalum_glass_2',
    'thermal:obsidian_glass_2',
    // thermal_foundation 外层（data/thermal/recipes/fire_charge/*.json）
    'thermal:fire_charge/bronze_ingot_4',
    'thermal:fire_charge/constantan_ingot_2',
    'thermal:fire_charge/electrum_ingot_2',
    'thermal:fire_charge/invar_ingot_3'
  ]

  FIRE_CHARGE_RECIPES.forEach(id => event.remove({ id: id }))

  // ── ② AllTheOres 的合金粉尘手工搅拌配方 ─────────────────────────────
  const ALLOY_DUST_RECIPES = [
    'alltheores:enderium_dust_from_alloy_blending',
    'alltheores:lumium_dust_from_alloy_blending',
    'alltheores:signalum_dust_from_alloy_blending',
    'alltheores:steel_dust_from_alloy_blending'
  ]

  ALLOY_DUST_RECIPES.forEach(id => event.remove({ id: id }))
})
