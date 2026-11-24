// priority: 50
// Pylons 模组四座塔的合成配方改造
//
// 原配方（expulsion / harvester / infusion / interdiction 四个塔结构完全相同）：
//
//   q q q        q = minecraft:quartz_slab              石英台阶
//   i d i        i = minecraft:iron_bars                铁栏杆
//   b b b        d = 各塔核心方块                        b = minecraft:polished_blackstone  磨制黑石
//
// 改造后：
//
//   q c q        c = mekanism:advanced_control_circuit   高级控制电路（第一排居中）
//   g d g        g = minecraft:glass                     玻璃（第二排左右两格）
//   b b b        b = mekanism:alloy_infused              灌注合金（整排替换磨制黑石）
//
// 说明：
//   - polished_blackstone 只出现在 b 键，即第三排三格，全部换成 mekanism:alloy_infused
//   - quartz_slab 原本占满第一排三格，这里只把居中那一格换成高级控制电路，
//     左右两格仍是石英台阶，因此新增 c 键、pattern 由 qqq 改为 qcq
//   - 铁栏杆原本在第二排左右两格，现在换成普通玻璃（minecraft:glass），
//     键名同步由 i 改为 g 以对应新的物品含义（只是键名，不影响配方结构）
//   - 各塔核心 d 键保持不变：diamond_block / hay_block / emerald_block / netherite_block
//   - 配方 ID 沿用原 ID（pylons:<塔名>），产出数量仍为 1，合成书分组仍为 pylons
// 生效：/reload

ServerEvents.recipes(event => {
  const TOWERS = [
    { id: 'pylons:expulsion_pylon',   core: 'minecraft:diamond_block' },
    { id: 'pylons:harvester_pylon',   core: 'minecraft:hay_block' },
    { id: 'pylons:infusion_pylon',    core: 'minecraft:emerald_block' },
    { id: 'pylons:interdiction_pylon', core: 'minecraft:netherite_block' }
  ]

  TOWERS.forEach(tower => {
    event.remove({ id: tower.id })

    event.shaped(tower.id, [
      'qcq',
      'gdg',
      'bbb'
    ], {
      q: 'minecraft:quartz_slab',
      c: 'mekanism:advanced_control_circuit',
      g: 'minecraft:glass',
      d: tower.core,
      b: 'mekanism:alloy_infused'
    }).group('pylons').id(tower.id)
  })
})
