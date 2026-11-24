// priority: 60
// 末影粉工作台配方改造（产物在 JEI 里显示为 alltheores:enderium_dust）
//   ① #forge:dusts/diamond  -> alltheores:platinum_dust            （此前需求）
//   ② 两个末影格子          -> 只接受 thermal:ender_pearl_dust      （本次需求，不再接受 minecraft:ender_pearl）
//
// 原配方（已从实例 jar 里核对过原文）：
//   thermal_foundation.jar!/META-INF/jarjar/thermal_core-1.20.1-11.0.6.24.jar
//     :: data/thermal/recipes/enderium_dust_2.json      id = thermal:enderium_dust_2
//   type      = minecraft:crafting_shapeless, category = misc
//   ingredients:
//     { "tag": "forge:dusts/lead" }    ×3
//     { "tag": "forge:dusts/diamond" }
//     [ { "tag": "forge:ender_pearls" }, { "tag": "forge:dusts/ender_pearl" } ]   ← 「或」复合配料
//     [ { "tag": "forge:ender_pearls" }, { "tag": "forge:dusts/ender_pearl" } ]   ← 「或」复合配料
//   result    = 2 × thermal:enderium_dust（Almost Unified 优先级把 alltheores 排在 thermal 前面，故显示 alltheores）
//
// 为什么之前只换掉钻石粉、末影珍珠一直留着：
//   这两个末影格子是「复合配料」——一个 ingredient 里塞了两个 tag 的数组。
//   replaceInput 是按配方格子比对的，复合配料不是单个 tag，匹配不上；
//   只有 {tag: forge:dusts/diamond} 那种单 tag 格子才吃 replaceInput。
//   => 想让末影珍珠消失，只能把整条配方删掉重写。
//
// 本脚本做法：
//   A. 按 ID 删除 thermal:enderium_dust_2
//   B. 按「产物 + 输入含末影珍珠」删除（input 过滤器会展开标签，不限配方类型）
//   C. 按「产物 + 工作台类配方类型」整类删除（crafting / crafting_shapeless / crafting_shaped 三种写法都试）
//   D. 兜底：如果还有残留配方，用 replaceInput 把钻石粉换铂粉、末影珍珠换珍珠粉
//   E. 重建：3 铅粉 + 1 铂粉 + 2 末影珍珠粉 -> 2 末影粉，ID 沿用原 ID
//
// 诊断：/reload 后 logs/kubejs/server.log 里应出现 [PLB] 两行标记。
//
// 生效：/reload

ServerEvents.recipes(event => {
  const RECIPE_ID = 'thermal:enderium_dust_2'
  const DUSTS = ['alltheores:enderium_dust', 'thermal:enderium_dust']
  const CRAFT_TYPES = ['minecraft:crafting', 'minecraft:crafting_shapeless', 'minecraft:crafting_shaped']

  console.info('[PLB] enderium dust recipe: start')

  DUSTS.forEach(dust => {
    // A. 精确 ID
    event.remove({ id: RECIPE_ID })

    // B. 产物是末影粉、输入带末影珍珠的整类配方（含标签展开）
    event.remove({ output: dust, input: 'minecraft:ender_pearl' })
    event.remove({ output: dust, input: '#forge:ender_pearls' })

    // C. 工作台类配方按类型清除
    CRAFT_TYPES.forEach(type => event.remove({ output: dust, type: type }))
  })

  // D. 兜底替换（对已删除的配方无副作用）
  DUSTS.forEach(dust => {
    event.replaceInput({ output: dust }, '#forge:dusts/diamond', 'alltheores:platinum_dust')
    event.replaceInput({ output: dust }, 'minecraft:ender_pearl', 'thermal:ender_pearl_dust')
    event.replaceInput({ output: dust }, '#forge:ender_pearls', 'thermal:ender_pearl_dust')
    event.replaceInput({ output: dust }, '#forge:dusts/ender_pearl', 'thermal:ender_pearl_dust')
  })

  // E. 重建：六个格子逐一写出（不用 "3x #tag" 的计数+标签写法，避免解析歧义）
  event.shapeless('2x alltheores:enderium_dust', [
    '#forge:dusts/lead',
    '#forge:dusts/lead',
    '#forge:dusts/lead',
    'alltheores:platinum_dust',
    'thermal:ender_pearl_dust',
    'thermal:ender_pearl_dust'
  ]).id(RECIPE_ID)

  console.info('[PLB] enderium dust recipe: done')
})
