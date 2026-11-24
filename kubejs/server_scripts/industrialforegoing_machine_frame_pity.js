// priority: 50
// Industrial Foregoing 的「简易机器框架」machine_frame_pity 合成改造
//
// 原配方（industrial-foregoing-1.20.1-3.5.22.jar :: data/industrialforegoing/recipes/machine_frame_pity.json）：
//   类型是 forge:conditional 包一层 minecraft:crafting_shaped：
//     W I W      I = #forge:ingots/iron
//     I R I      R = #forge:storage_blocks/redstone
//     W I W      W = #minecraft:logs
//
// 改造后（普通有序合成，3×3 全部九格都被占用）：
//     S O S      S = alltheores:signalum_ingot   信素锭（四个角）
//     O E O      O = thermal:obsidian_glass       黑曜石玻璃（四条边）
//     S O S      E = alltheores:enderium_gear     末影齿轮（正中）
//
// 说明：
//   - 原配方外面套了 forge:conditional，KubeJS 的 type 过滤器匹配不到，所以按 ID 删除，
//     另外补一条按产物删除的兜底（conditional 若被展开成别的 ID 也能清掉）。
//   - 重建时不再保留 conditional 包装，直接写普通 shaped；配方 ID 沿用原 ID。
//   - 三个材料都确认存在：alltheores:enderium_gear / alltheores:signalum_ingot
//     在 alltheores jar，thermal:obsidian_glass 在 thermal_foundation 内嵌的 thermal_core jar。
//
// 生效：/reload

ServerEvents.recipes(event => {
  // 按 ID 删除原 conditional 配方
  event.remove({ id: 'industrialforegoing:machine_frame_pity' })
  // 兜底：万一 conditional 内部配方以其它 ID 注册，按产物再删一次
  event.remove({ output: 'industrialforegoing:machine_frame_pity' })

  event.shaped('industrialforegoing:machine_frame_pity', [
    'SOS',
    'OEO',
    'SOS'
  ], {
    S: 'alltheores:signalum_ingot',   // 四角
    O: 'thermal:obsidian_glass',      // 四边
    E: 'alltheores:enderium_gear'     // 正中
  }).id('industrialforegoing:machine_frame_pity')
})
