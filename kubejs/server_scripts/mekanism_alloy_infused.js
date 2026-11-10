// priority: 100
// 改造 mekanism:alloy_infused（灌注合金）的配方
// 注意：它不是工作台配方，而是冶金灌注机配方（mekanism:metallurgic_infusing）
// 原始 JSON（data/mekanism/recipes/metallurgic_infusing/alloy/infused.json）：
//   type: mekanism:metallurgic_infusing
//   chemicalInput: { amount: 10, tag: "mekanism:redstone" }
//   itemInput:     { ingredient: { tag: "forge:ingots/iron" } }
//   output:        { item: "mekanism:alloy_infused" }
// 生效：/reload（机械灌注机是数据包配方，不需要重启）

ServerEvents.recipes(event => {
  // 删掉原配方（铁锭版）
  event.remove({ id: 'mekanism:metallurgic_infusing/alloy/infused' })

  // 用钢锭重建。这里必须走 event.custom：
  // 铁锭藏在嵌套的 itemInput.ingredient 里，replaceInput 匹配不到这种自定义配方结构。
  event.custom({
    type: 'mekanism:metallurgic_infusing',
    chemicalInput: { amount: 10, tag: 'mekanism:redstone' },
    itemInput: { ingredient: { item: 'alltheores:steel_ingot' } },
    output: { item: 'mekanism:alloy_infused' }
  }).id('mekanism:metallurgic_infusing/alloy/infused')
})
