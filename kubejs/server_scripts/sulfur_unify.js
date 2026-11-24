// priority: 0
// 统一“硫”这一材料：让整合包里只用 Thermal 的硫粉（thermal:sulfur_dust）与硫磺（thermal:sulfur），
// Mekanism 的 mekanism:dust_sulfur 不再参与任何配方。
//
// 背景：
//   · Mekanism 的硫粉（mekanism:dust_sulfur）和 Thermal 的硫粉（thermal:sulfur_dust）是两种物品，
//     Thermal 的硫磺（thermal:sulfur，结晶产物）又是第三种，并存会让 JEI 里出现两套“硫”。
//
// 本脚本负责两处：
//   1) forge:dusts/sulfur 标签只保留 thermal:sulfur_dust —— 一次性覆盖 5 条按标签写的配方：
//        mekanism:enriching/conversion/sulfur_to_gunpowder   硫粉 → 火药
//        mekanism:gas_conversion/sulfur_to_sulfuric_acid     硫粉 → 硫酸
//        mekanism:oxidizing/sulfur_dioxide                   硫粉 → 二氧化硫
//        thermal:crystallizer/crystallizer_sulfur            硫粉 + 水 → 硫磺
//        thermal:smelter/smelter_cured_rubber                硫粉 + 乳胶 → 硫化橡胶
//   2) mekanism:injecting/gunpowder_to_sulfur 直接产出 thermal:sulfur_dust。
//      这条是 Mekanism 自定义类型，物品输出嵌在 output 里，replaceOutput 改不到，只能删除重建。
//
// 另外三条 coal_gasification 反应（煤 / 煤粉 / 煤块 → 硫粉）已经在
// mekanism_tag_input_fix.js 里统一重建（那个脚本要处理水标签），其 itemOutput 已改为
// thermal:sulfur_dust，这里不再重复。
//
// 生效：/reload

// ── 1. 标签只保留 Thermal 硫粉 ──
ServerEvents.tags('item', event => {
  event.removeAll('forge:dusts/sulfur')
  event.add('forge:dusts/sulfur', 'thermal:sulfur_dust')
})

// ── 2. 火药 + 氯化氢 → 硫粉 ──
ServerEvents.recipes(event => {
  event.remove({ id: 'mekanism:injecting/gunpowder_to_sulfur' })
  event.custom({
    type: 'mekanism:injecting',
    chemicalInput: { amount: 1, gas: 'mekanism:hydrogen_chloride' },
    itemInput: { ingredient: { tag: 'forge:gunpowder' } },
    output: { item: 'thermal:sulfur_dust' }
  }).id('mekanism:injecting/gunpowder_to_sulfur')
})
