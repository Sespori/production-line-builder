// priority: 80
// AE2 三种处理器在刻印机中的配方：把红色石头换成高级控制电路
//
//   原（logic / calculation / engineering 三条同构）:
//     top    = ae2:printed_<type>_processor   压印模板
//     middle = minecraft:redstone            红石粉  -> 改为 mekanism:advanced_control_circuit
//     bottom = ae2:printed_silicon           硅模板
//     mode   = press
//
// 说明：ExtendedAE 的 ex_inscriber（扩展刻印机）**没有自己的配方类型**，它通过
//   appeng.blockentity.misc.InscriberRecipes 直接复用 ae2:inscriber 的配方
//   （TileExInscriber / InscriberThread 里引用的就是 appeng.recipes.handlers.InscriberRecipe）。
//   所以改这三条，普通刻印机与扩展刻印机同时生效，不需要为 ex_inscriber 另写一套。
//
// 写法：ae2:inscriber 的 ingredients 是 {top, middle, bottom} 的具名对象，不是数组，
//   KubeJS 的 replaceInput 只能处理列表型输入，对这类结构会静默失效，因此整条重建。
//   除 middle 外全部字段与原子一致，配方 ID 也保持原样。
// 生效：/reload

ServerEvents.recipes(event => {
  // [配方 ID, 产物, 压印模板]
  const RECIPES = [
    ['ae2:inscriber/logic_processor', 'ae2:logic_processor', 'ae2:printed_logic_processor'],
    ['ae2:inscriber/calculation_processor', 'ae2:calculation_processor', 'ae2:printed_calculation_processor'],
    ['ae2:inscriber/engineering_processor', 'ae2:engineering_processor', 'ae2:printed_engineering_processor']
  ]

  RECIPES.forEach(([id, output, printed]) => {
    event.remove({ id: id })
    event.custom({
      type: 'ae2:inscriber',
      ingredients: {
        bottom: { item: 'ae2:printed_silicon' },
        middle: { item: 'mekanism:advanced_control_circuit' },
        top: { item: printed }
      },
      mode: 'press',
      result: { item: output }
    }).id(id)
  })
})
