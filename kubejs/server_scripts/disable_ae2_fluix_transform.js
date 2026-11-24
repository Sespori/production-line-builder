// priority: 90
// 禁用 ae2:fluix_crystal 的「水中世界交互」配方
//
// 被禁用（data/ae2/recipes/transform/fluix_crystal.json）：
//   type         = ae2:transform
//   circumstance = { "type": "fluid", "tag": "minecraft:water" }   必须把物品丢进水里
//   ingredients  = ae2:charged_certus_quartz_crystal + ae2:fluix_dust
//   result       = ae2:fluix_crystal × 1
//
// 保留（同目录下另一条，不在本次范围内）：
//   data/ae2/recipes/transform/fluix_crystals.json
//     charged_certus_quartz_crystal + minecraft:redstone + minecraft:quartz
//     → fluix_crystal × 2
//   这里按 ID 精确删除，只干掉 fluix_dust 那一条，「红石 + 石英」那条仍然可用。
//
// 说明：ae2:transform 是普通数据包配方（TransformRecipe + TransformRecipeSerializer，
//   类型注册在 AERecipeTypes.TRANSFORM），由 RecipeManager 统一管理；
//   TransformLogic 通过 getAllRecipesFor(AERecipeTypes.TRANSFORM) 查询，
//   所以按 ID 删除之后世界里就合不出来了，不需要额外拦截。
//   注意不要用 { type: 'ae2:transform', output: ... } 过滤，那样会把上面那条
//   「红石 + 石英 → 2 个」也一起删掉。
// 生效：/reload

ServerEvents.recipes(event => {
  event.remove({ id: 'ae2:transform/fluix_crystal' })
})
