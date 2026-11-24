// priority: 60
// 锻造升级模板的「用材料方块代替模板本身」替代配方
//
// 原配方（两者结构完全一致，9 格布局如下）：
//
//   # S #        S = 模板本身（作为种子）
//   # C #        C = 中间催化剂方块
//   # # #        # = 四周填充材料
//   产出 2 个模板
//
//   原版下界合金升级模板： # = minecraft:diamond        C = minecraft:netherrack
//   ATM 升级模板：         # = minecraft:netherite_ingot C = minecraft:deepslate
//
// 本脚本「额外新增」两个配方，原有配方保持不变：
//   把 S 从「模板本身」换成对应的材料方块，并把产出数量从 2 降到 1
//
//   下界合金： 7 钻石 + 1 下界岩   + 1 下界合金块  -> 1 个下界合金升级模板
//   ATM：      7 下界合金锭 + 1 深板岩 + 1 ATM 块   -> 1 个 ATM 升级模板
//
// 说明：
//   - 键名由 #/C/S 改成 D/C/S、N/C/S，只是避开 # 这个特殊键名，配方结构不变
//   - 使用新 ID（kubejs:...），不会覆盖原配方，两个配方并存
// 生效：/reload

ServerEvents.recipes(event => {
  // 下界合金升级模板：下界合金块替代模板本身，产出 1
  event.shaped(Item.of('minecraft:netherite_upgrade_smithing_template', 1), [
    'DSD',
    'DCD',
    'DDD'
  ], {
    D: 'minecraft:diamond',
    C: 'minecraft:netherrack',
    S: 'minecraft:netherite_block'
  }).id('kubejs:netherite_upgrade_smithing_template_from_block')

  // ATM 升级模板：ATM 块替代模板本身，产出 1
  event.shaped(Item.of('allthemodium:allthemodium_upgrade_smithing_template', 1), [
    'NSN',
    'NCN',
    'NNN'
  ], {
    N: 'minecraft:netherite_ingot',
    C: 'minecraft:deepslate',
    S: 'allthemodium:allthemodium_block'
  }).id('kubejs:allthemodium_upgrade_smithing_template_from_block')
})
