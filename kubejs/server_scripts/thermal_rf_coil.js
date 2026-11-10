// priority: 100
// 改造 thermal:rf_coil 的配方
// 原配方：pattern "  R" / " I " / "R  " —— 2x 红石粉(tag) + 1x 金锭(tag)
// 新配方：2x 灌注合金 + 1x alltheores 金齿轮
// 生效：/reload

ServerEvents.recipes(event => {
  // 红石粉 -> 灌注合金（配方里有两个 R，所以是 2 个）
  event.replaceInput({ id: 'thermal:rf_coil' }, '#forge:dusts/redstone', 'mekanism:alloy_infused')
  // 金锭 -> 金齿轮
  event.replaceInput({ id: 'thermal:rf_coil' }, '#forge:ingots/gold', 'alltheores:gold_gear')
})
