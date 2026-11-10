// priority: 60
// 修改 thermal:enderium_dust_2 的输入：forge:dusts/diamond -> alltheores:platinum_dust
//
// 原配方（thermal_foundation 内嵌 jarjar :: data/thermal/recipes/enderium_dust_2.json）：
//   minecraft:crafting_shapeless
//   [ 3x #forge:dusts/lead, 1x #forge:dusts/diamond,
//     1x (#forge:ender_pearls | #forge:dusts/ender_pearl),
//     1x (#forge:ender_pearls | #forge:dusts/ender_pearl) ]
//   -> 2x thermal:enderium_dust   （经 Almost Unified 统一后显示为 alltheores:enderium_dust）
//
// 说明：
//  · 这条是当前实例中唯一「产出末影粉」的工作台配方（alltheores 自带的那条
//    enderium_dust_from_alloy_blending 已按要求禁用），所以改这一条即可。
//  · 配方 ID 保持不变（thermal:enderium_dust_2），产物数量仍为 2，只换一项材料。
//  · 同时用「产物」再过滤一遍，防止这条配方被其他数据包以别的 ID 重新注册时漏改。
//
// 生效：/reload

ServerEvents.recipes(event => {
  const FILTERS = [
    { id: 'thermal:enderium_dust_2' },
    { output: 'thermal:enderium_dust' },
    { output: 'alltheores:enderium_dust' }
  ]

  FILTERS.forEach(filter => {
    event.replaceInput(filter, '#forge:dusts/diamond', 'alltheores:platinum_dust')
  })
})
