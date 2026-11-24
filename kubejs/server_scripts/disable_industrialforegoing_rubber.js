// priority: 90
// 禁用 Industrial Foregoing 的橡胶链（抽液机 + 乳胶处理机 + 干橡胶）
//
// ── 一、四个物品：既不能做出来，也不能参与任何配方 ──
//   industrialforegoing:fluid_extractor         流体提取机（机器）
//   industrialforegoing:latex_processing_unit   乳胶处理机（机器）
//   industrialforegoing:tinydryrubber           小干橡胶
//   industrialforegoing:dryrubber               干橡胶
//
//   每个物品删三遍：
//     { id }     同名配方（机器的合成配方文件就叫 fluid_extractor.json / latex_processing_unit.json，
//                而且外面包了一层 forge:conditional —— type 过滤器看不到里面的类型，按 ID 删最稳）
//     { output } 一切产出它的配方
//     { input }  一切拿它当材料的配方（小干橡胶 x9 -> 干橡胶、干橡胶烧塑料都会被这条带走）
//
// ── 二、机器内运行的配方 ──
//   industrialforegoing:fluid_extractor 类型共 7 条（6 种原木 + default），
//   这里先按类型全删，再把 7 个 ID 逐个兜一遍，防止类型过滤器失效。
//
//   latex_processing_unit **没有数据包配方类型**：它的「乳胶 + 水 -> 干橡胶」是写死在
//   LatexProcessingUnitTile 里的（字节码里直接读 ModuleCore.LATEX_PROCESSING 与
//   ModuleCore.DRY_RUBBER，走的是 config 的 AMOUNT_LATEX，不经 RecipeManager）。
//   所以没有任何 JSON 可以删。实际效果靠上面第一条：机器本身做不出来，
//   连同 fluid_extractor 一起，整条橡胶链从"没有机器"这一端就断了。
//   已经摆在存档里的旧机器仍然会转 —— 这是配方层做不到的部分。
//
// ── 三、连带影响（已向用户说明）──
//   干橡胶一断，industrialforegoing:plastic 的熔炼配方（dryrubber -> plastic）也随之失效，
//   而 IF 的三张机器框架（simple / advanced / supreme）是溶解室用 plastic 做的，
//   因此中后期 IF 机器会一起断供。
//
// 生效：/reload

ServerEvents.recipes(event => {
  // ── 一、四个物品 ──
  const BAN = [
    'industrialforegoing:fluid_extractor',
    'industrialforegoing:latex_processing_unit',
    'industrialforegoing:tinydryrubber',
    'industrialforegoing:dryrubber'
  ]

  BAN.forEach(id => {
    event.remove({ id: id })
    event.remove({ output: id })
    event.remove({ input: id })
  })

  // ── 二、流体提取机内运行的配方 ──
  event.remove({ type: 'industrialforegoing:fluid_extractor' })

  const EXTRACT = ['default', 'oak', 'spruce', 'birch', 'jungle', 'acacia', 'dark_oak']
  EXTRACT.forEach(wood => {
    event.remove({ id: 'industrialforegoing:fluid_extractor/' + wood })
  })

  console.info('[PLB] industrial foregoing rubber chain disabled')
})
