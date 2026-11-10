// priority: 100
// 齿轮配方改造：4 个角放 #forge:rods/<材料>，4 条边放 #forge:plates/<材料>，中心留空
//
//   R P R
//   P . P
//   R P R
//
// 覆盖范围：当前实例内全部 47 条工作台齿轮配方中，材料同时具备
// forge:rods/<材料> 与 forge:plates/<材料> 的 42 条。
// 跳过 5 条（材料没有对应的杆/板标签）：
//   thermal:parts/emerald_gear / lapis_gear / netherite_gear / quartz_gear / rose_gold_gear
// 另外 thermal:ruby_gear、thermal:sapphire_gear 只有物品、没有工作台配方，无需处理。
//
// 注意：thermal 的配方数据在 thermal_foundation.jar 内嵌的 jarjar(thermal_core) 里，
// 常规（非递归）扫描看不到，本表由递归扫描全部 jar（含嵌套）生成。
// 生效：/reload

ServerEvents.recipes(event => {
  // 这 7 个齿轮除本脚本外还残留其它来源（Thermal Series）的配方，按产出物整类清除。
  // 注意：remove({output}) 会移除所有产出该物品的配方，包括机器配方；
  // 本脚本随后会补回工作台配方，压印机配方由 thermal_press_gears.js（priority 200）补齐。
  const PURGE = [
    'alltheores:iron_gear',
    'alltheores:gold_gear',
    'alltheores:diamond_gear',
    'alltheores:copper_gear',
    'alltheores:enderium_gear',
    'alltheores:lumium_gear',
    'alltheores:signalum_gear'
  ]
  PURGE.forEach(gear => event.remove({ output: gear }))

  // [原配方 ID, 产物, 材料]
  const GEARS = [
    ['allthemodium:allthemodium_gear', 'allthemodium:allthemodium_gear', 'allthemodium'],
    ['allthemodium:unobtainium_gear', 'allthemodium:unobtainium_gear', 'unobtainium'],
    ['allthemodium:vibranium_gear', 'allthemodium:vibranium_gear', 'vibranium'],
    ['alltheores:aluminum_gear', 'alltheores:aluminum_gear', 'aluminum'],
    ['alltheores:brass_gear', 'alltheores:brass_gear', 'brass'],
    ['alltheores:bronze_gear', 'alltheores:bronze_gear', 'bronze'],
    ['alltheores:constantan_gear', 'alltheores:constantan_gear', 'constantan'],
    ['alltheores:copper_gear', 'alltheores:copper_gear', 'copper'],
    ['alltheores:diamond_gear', 'alltheores:diamond_gear', 'diamond'],
    ['alltheores:electrum_gear', 'alltheores:electrum_gear', 'electrum'],
    ['alltheores:enderium_gear', 'alltheores:enderium_gear', 'enderium'],
    ['alltheores:gold_gear', 'alltheores:gold_gear', 'gold'],
    ['alltheores:invar_gear', 'alltheores:invar_gear', 'invar'],
    ['alltheores:iridium_gear', 'alltheores:iridium_gear', 'iridium'],
    ['alltheores:iron_gear', 'alltheores:iron_gear', 'iron'],
    ['alltheores:lead_gear', 'alltheores:lead_gear', 'lead'],
    ['alltheores:lumium_gear', 'alltheores:lumium_gear', 'lumium'],
    ['alltheores:nickel_gear', 'alltheores:nickel_gear', 'nickel'],
    ['alltheores:osmium_gear', 'alltheores:osmium_gear', 'osmium'],
    ['alltheores:platinum_gear', 'alltheores:platinum_gear', 'platinum'],
    ['alltheores:signalum_gear', 'alltheores:signalum_gear', 'signalum'],
    ['alltheores:silver_gear', 'alltheores:silver_gear', 'silver'],
    ['alltheores:steel_gear', 'alltheores:steel_gear', 'steel'],
    ['alltheores:tin_gear', 'alltheores:tin_gear', 'tin'],
    ['alltheores:uranium_gear', 'alltheores:uranium_gear', 'uranium'],
    ['alltheores:zinc_gear', 'alltheores:zinc_gear', 'zinc'],
    ['thermal:parts/bronze_gear', 'thermal:bronze_gear', 'bronze'],
    ['thermal:parts/constantan_gear', 'thermal:constantan_gear', 'constantan'],
    ['thermal:parts/copper_gear', 'thermal:copper_gear', 'copper'],
    ['thermal:parts/diamond_gear', 'thermal:diamond_gear', 'diamond'],
    ['thermal:parts/electrum_gear', 'thermal:electrum_gear', 'electrum'],
    ['thermal:parts/enderium_gear', 'thermal:enderium_gear', 'enderium'],
    ['thermal:parts/gold_gear', 'thermal:gold_gear', 'gold'],
    ['thermal:parts/invar_gear', 'thermal:invar_gear', 'invar'],
    ['thermal:parts/iron_gear', 'thermal:iron_gear', 'iron'],
    ['thermal:parts/lead_gear', 'thermal:lead_gear', 'lead'],
    ['thermal:parts/lumium_gear', 'thermal:lumium_gear', 'lumium'],
    ['thermal:parts/nickel_gear', 'thermal:nickel_gear', 'nickel'],
    ['thermal:parts/signalum_gear', 'thermal:signalum_gear', 'signalum'],
    ['thermal:parts/silver_gear', 'thermal:silver_gear', 'silver'],
    ['thermal:parts/steel_gear', 'thermal:steel_gear', 'steel'],
    ['thermal:parts/tin_gear', 'thermal:tin_gear', 'tin']
  ]

  GEARS.forEach(([id, output, material]) => {
    event.remove({ id: id })
    event.shaped(output, [
      'RPR',
      'P P',
      'RPR'
    ], {
      R: `#forge:rods/${material}`,
      P: `#forge:plates/${material}`
    }).id(id)
  })
})
