// priority: 200
// 为 #forge:gears 补齐 thermal:machine_press（压印机）配方
//
// 参照 thermal:press_tin_ingot_to_gear：
//   ingredients: [ { tag: "forge:ingots/tin", count: 4 }, { item: "thermal:press_gear_die" } ]
//   result:      [ { item: "thermal:tin_gear" } ]
//   不写 energy 字段 => 使用 press 默认耗能，与锡齿轮那条完全一致
//
// 只补 Thermal *没有* 内置压印齿轮配方的材料，避免出现重复配方。
// Thermal 自带的 17 种（勿重复添加）：bronze, constantan, copper, electrum, enderium, gold,
//   invar, iron, lead, lumium, netherite, nickel, rose_gold, signalum, silver, steel, tin
// 生效：/reload

ServerEvents.recipes(event => {
  // [输入材料标签, 产出齿轮]
  const PRESS = [
    ['forge:ingots/allthemodium', 'allthemodium:allthemodium_gear'],
    ['forge:ingots/aluminum', 'alltheores:aluminum_gear'],
    ['forge:ingots/brass', 'alltheores:brass_gear'],
    ['forge:gems/diamond', 'alltheores:diamond_gear'],
    ['forge:ingots/iridium', 'alltheores:iridium_gear'],
    ['forge:ingots/osmium', 'alltheores:osmium_gear'],
    ['forge:ingots/platinum', 'alltheores:platinum_gear'],
    ['forge:ingots/unobtainium', 'allthemodium:unobtainium_gear'],
    ['forge:ingots/uranium', 'alltheores:uranium_gear'],
    ['forge:ingots/vibranium', 'allthemodium:vibranium_gear'],
    ['forge:ingots/zinc', 'alltheores:zinc_gear'],

  ]

  PRESS.forEach(([materialTag, gear]) => {
    const material = materialTag.split('/')[1]

    event.custom({
      type: 'thermal:press',
      ingredients: [
        { tag: materialTag, count: 4 },
        { item: 'thermal:press_gear_die' }
      ],
      result: [{ item: gear }]
    }).id(`kubejs:press_${material}_to_gear`)
  })
})
