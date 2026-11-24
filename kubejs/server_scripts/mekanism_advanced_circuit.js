// priority: 80
// 高级控制电路（mekanism:advanced_control_circuit）配方调整
//
// 原配方只有一行「ACA」：
//
//   A C A        A = #mekanism:alloys/infused    灌注合金
//   . . .        C = #forge:circuits/basic       基础电路
//   . . .
//
// 现在保留原「ACA」这一行，只在它上面和下面两行的中间格各放 1 个富集红石
//
//   . R .        R = mekanism:enriched_redstone  富集红石
//   A C A        A = 灌注合金，C = 基础电路
//   . R .
//
// 说明：其余材料不变（灌注合金仍 2 个、基础电路 1 个），只新增 2 个富集红石。
// 配方 ID 沿用 mekanism:control_circuit/advanced，产出数量不变。
// 生效：/reload

ServerEvents.recipes(event => {
  event.remove({ id: 'mekanism:control_circuit/advanced' })

  event.shaped('mekanism:advanced_control_circuit', [
    ' R ',
    'ACA',
    ' R '
  ], {
    A: '#mekanism:alloys/infused',
    C: '#forge:circuits/basic',
    R: 'mekanism:enriched_redstone'
  }).id('mekanism:control_circuit/advanced')
})
