// priority: 100
// 末影珍珠粉去重：只保留 thermal:ender_pearl_dust，关掉 ae2:ender_dust
//
// ── 现状 ──
// forge:dusts/ender_pearl 标签下同时挂着两种粉：
//   ae2:ender_dust            （AE2 的末影粉）
//   thermal:ender_pearl_dust  （Thermal 的末影珍珠粉）
// 两者是同一个东西的两种注册，分别由 AE2 和 Thermal 提供，需要收敛成一种。
//
// ── 处理 ──
// 1) 断掉 ae2:ender_dust 的产出路径：
//    全整合包只有一条配方能产出它——
//      ae2:inscriber/ender_dust（刻印机：1 末影珍珠 → 1 ae2:ender_dust）
//    删掉后 ae2:ender_dust 无法再被制作。
//
// 2) 把它从共同标签里摘掉，使它无法参与任何配方：
//    引用 forge:dusts/ender_pearl 的配方共 3 条：
//      ae2:network/wireless_booster        无线增幅卡（工作台）
//      ae2:transform/entangled_singularity 纠缠奇点（ae2:transform）
//      thermal:machines/smelter/smelter_alloy_enderium
//        （这条已由 thermal_smelter_endgame_alloys.js 删除，不生效）
//    剩下的两条会自动改用标签里仅存的 thermal:ender_pearl_dust，配方不会断。
//
//    另：全包没有任何配方把 ae2:ender_dust 当物品 ID 硬写，所以不需要
//    replaceInput 兜底——只处理标签即可彻底隔离。
//
// 3) 显式补一条标签成员，防止 AE2 那条移除后标签意外变空：
//    thermal:ender_pearl_dust 本来就在标签里（CoFH 运行时注入），
//    这里再 add 一次是幂等的，纯属保险。
//
// ── 配套 ──
// thermal:ender_pearl_dust 的获取方式见 mekanism_custom_recipes.js
//   （粉碎机：1 末影珍珠 → 1 末影珍珠粉）。
//
// 生效：/reload

ServerEvents.recipes(event => {
  event.remove({ id: 'ae2:inscriber/ender_dust' })
})

ServerEvents.tags('item', event => {
  event.remove('forge:dusts/ender_pearl', 'ae2:ender_dust')
  event.add('forge:dusts/ender_pearl', 'thermal:ender_pearl_dust')
})
