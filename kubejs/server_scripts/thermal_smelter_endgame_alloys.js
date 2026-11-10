// priority: 60
// 禁用 thermal:machine_smelter（感应炉）中产出以下三种锭的全部配方：
//   alltheores:enderium_ingot / lumium_ingot / signalum_ingot
//
// 实际命中的 9 条（thermal_expansion :: data/thermal/recipes/machines/smelter/）：
//   合金合成：smelter_alloy_enderium  3 铅(锭/粉) + 1 钻石粉 + 2 末影珍珠 -> 2 末影锭   16000 RF
//             smelter_alloy_lumium    3 锡(锭/粉) + 1 银(锭/粉) + 2 荧石粉 -> 4 流明锭   12000 RF
//             smelter_alloy_signalum  3 铜(锭/粉) + 1 银(锭/粉) + 4 红石粉 -> 4 信素锭   12000 RF
//   粉尘回炉：smelter_enderium_dust / smelter_lumium_dust / smelter_signalum_dust
//   板材回炉：smelter_enderium_plate_to_ingot / _lumium_ / _signalum_
//
// 保留的通路（未动）：
//   · 熔炉 / 高炉烧合金粉 -> 锭（alltheores:*_ingot_from_dust / _blasting）
//   · 合金粉本身的工作台合成：thermal:enderium_dust_2 / lumium_dust_4 / signalum_dust_4
//     （都在 thermal_foundation 的内嵌 jar 里；末影粉那条已另按需求改成铂粉）
//
// 未波及：smelter_glass_enderium / _lumium_ / _signalum_（这三条是「锭 -> 玻璃」，属于消耗方）
//
// 实现：先按「类型 + 产物」过滤兜底（不依赖 ID，也不依赖命名空间 —— Almost Unified 可能已把
// 产物从 thermal:*_ingot 改写成 alltheores:*_ingot），再按 ID 精确删一遍。
// 限定 type 为 thermal:smelter，避免误伤工作台的锭块互转、粒块互转等配方。
//
// 生效：/reload

ServerEvents.recipes(event => {
  const ALLOYS = ['enderium', 'lumium', 'signalum']

  ALLOYS.forEach(material => {
    // ① 类型 + 产物过滤（两个命名空间都试）
    event.remove({ type: 'thermal:smelter', output: `thermal:${material}_ingot` })
    event.remove({ type: 'thermal:smelter', output: `alltheores:${material}_ingot` })

    // ② 按 ID 精确兜底
    event.remove({ id: `thermal:machines/smelter/smelter_alloy_${material}` })
    event.remove({ id: `thermal:machines/smelter/smelter_${material}_dust` })
    event.remove({ id: `thermal:machines/smelter/smelter_${material}_plate_to_ingot` })
  })
})
