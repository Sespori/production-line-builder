// priority: 90
// 禁用 ae2:sky_dust（天空粉尘）在刻印机里的制作配方
//
// 被禁用的配方（data/ae2/recipes/inscriber/sky_stone_dust.json）：
//
//   type    = ae2:inscriber
//   mode    = inscribe
//   middle  = ae2:sky_stone_block     天空石方块
//   result  = ae2:sky_dust            天空粉尘
//
// 说明：全实例 30 个模组核查，产出天空粉尘的配方只有两条——
//   1) 本文件禁用的这条刻印机配方；
//   2) data/mekanism/recipes/compat/ae2/sky_stone_to_dust.json（mekanism:crushing），
//      即 Mekanism 粉碎机把天空石方块磨成天空粉尘，未在本次要求范围内，保持可用。
//   因此禁用后天空粉尘仍可从粉碎机获得，不会彻底断供。
//   扩展刻印机（expatternprovider:ex_inscriber）复用 ae2:inscriber 配方类型，
//   所以这一条禁用对普通刻印机与扩展刻印机同时生效。
// 生效：/reload

ServerEvents.recipes(event => {
  event.remove({ id: 'ae2:inscriber/sky_stone_dust' })
})
