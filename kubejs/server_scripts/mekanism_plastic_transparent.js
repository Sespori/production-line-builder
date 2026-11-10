// priority: 100
// MekanismAdditions 塑料方块产出数量调整
//
// 1) 透明塑料 #mekanismadditions:plastic_blocks/transparent：8 -> 2
//    原始 pattern ["###","#D#","###"]，8 个 HDPE 板 + 1 染料，result.count = 8
// 2) 普通塑料 #mekanismadditions:plastic_blocks/plastic：4 -> 1
//    原始 pattern [" # ","#D#"," # "]，4 个 HDPE 板 + 1 染料，result.count = 4
//
// 两个标签各有 18 个条目，但 aqua / dark_red 没有 HDPE 配方（只能颜料改色获得），
// 因此只处理真正可合成的 16 个颜色。
// 生效：/reload

ServerEvents.recipes(event => {
  const colors = [
    'white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink', 'gray',
    'light_gray', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black'
  ]

  // ---- 1) 透明塑料块：8 -> 2 ----
  colors.forEach(color => {
    const id = `mekanismadditions:plastic/transparent/${color}`

    event.remove({ id: id })
    event.shaped(Item.of(`mekanismadditions:${color}_plastic_transparent`, 2), [
      'HHH',
      'HDH',
      'HHH'
    ], {
      H: 'mekanism:hdpe_sheet',
      D: `#forge:dyes/${color}`
    }).id(id)
  })

  // ---- 2) 普通塑料块：4 -> 1 ----
  colors.forEach(color => {
    const id = `mekanismadditions:plastic/block/${color}`

    event.remove({ id: id })
    event.shaped(Item.of(`mekanismadditions:${color}_plastic`, 1), [
      ' H ',
      'HDH',
      ' H '
    ], {
      H: 'mekanism:hdpe_sheet',
      D: `#forge:dyes/${color}`
    }).id(id)
  })
})
