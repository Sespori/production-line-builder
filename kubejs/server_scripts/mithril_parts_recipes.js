// priority: 0
// 蕴魔秘银板 / 蕴魔秘银齿轮的配方
//
// 这两个物品是 1.12.2 ThermalFoundation 移植过来的材料（kubejs:plate_mithril、
// kubejs:gear_mithril），移植阶段只注册了物品本身，没有给配方，这里补齐。
//
// ── 参考对象 ──
// 板：Thermal 压印机（thermal:machine_press）的锭 -> 板
//     data/thermal/recipes/machines/press/press_signalum_ingot_to_plate.json
//       { type: "thermal:press", ingredient: { tag: "forge:ingots/signalum" },
//         result: [ { item: "thermal:signalum_plate" } ] }
//     注意板这条**不写模具、不写 energy**，机器会按默认值跑。
// 板：AllTheOres 的手工板（锤子 + 锭）
//     data/alltheores/recipes/aluminum_plate.json
//       key: a = #forge:ingots/aluminum, h = #alltheores:ore_hammers
//       pattern: ["ha ", "a  ", "   "]
// 齿轮：压印机（4 锭 + 齿轮模具）
//     thermal_press_gears.js 里的写法（照 Thermal 自带 press_<metal>_ingot_to_gear）
//       ingredients: [ { tag: ..., count: 4 }, { item: "thermal:press_gear_die" } ]
//     本包先前改写过的齿轮工作台配方是「四角杆 + 四边板」（RPR / P RPR），
//     但秘银**没有对应的杆物品**（移植清单里只有 dust / ingot / nugget / plate / gear），
//     所以这里不给工作台版，只走压印机。
//
// ── 本文件三条 ──
//   ① 压印机：1 秘银锭 -> 1 秘银板            kubejs:press/mithril_ingot_to_plate
//   ② 工作台：锤子 + 秘银锭 -> 1 秘银板        kubejs:crafting/mithril_plate
//   ③ 压印机：4 秘银锭 + 齿轮模具 -> 1 秘银齿轮 kubejs:press_mithril_to_gear
//
// 生效：/reload

ServerEvents.recipes(event => {
  // ── ① 压印机：1 秘银锭 → 1 秘银板 ──
  event.custom({
    type: 'thermal:press',
    ingredient: { item: 'kubejs:ingot_mithril' },
    result: [{ item: 'kubejs:plate_mithril' }]
  }).id('kubejs:press/mithril_ingot_to_plate')

  // ── ② 工作台：锤子 + 秘银锭 → 1 秘银板（AllTheOres 手工板写法）──
  event.shaped('kubejs:plate_mithril', [
    'ha ',
    'a  ',
    '   '
  ], {
    h: '#alltheores:ore_hammers',
    a: 'kubejs:ingot_mithril'
  }).id('kubejs:crafting/mithril_plate')

  // ── ③ 压印机：4 秘银锭 + 齿轮模具 → 1 秘银齿轮 ──
  event.custom({
    type: 'thermal:press',
    ingredients: [
      { item: 'kubejs:ingot_mithril', count: 4 },
      { item: 'thermal:press_gear_die' }
    ],
    result: [{ item: 'kubejs:gear_mithril' }]
  }).id('kubejs:press_mithril_to_gear')
})
