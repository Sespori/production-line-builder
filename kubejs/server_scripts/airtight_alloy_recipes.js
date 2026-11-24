// priority: 0
// 气密合金（Airtight Alloy）产线
//
// 1) 板坯：工作台有序合成（3x3，中列竖排）
//      第 1 行第 2 格：压缩铁锭  pneumaticcraft:ingot_iron_compressed
//      第 2 行第 2 格：粉色史莱姆锭 industrialforegoing:pink_slime_ingot（板坯的颜色来源）
//      第 3 行第 2 格：压缩铁锭
//      => 1 气密合金板坯
// 2) 板：压印机 thermal:machine_press，1 板坯 -> 3 板，7200 RF
//
// 物品本体在 startup_scripts/custom_items.js 注册，译名在 client_scripts/custom_lang.js。
// 生效：/reload

ServerEvents.recipes(event => {
  const BILLET = 'kubejs:airtight_alloy_billet'
  const PLATE = 'kubejs:airtight_alloy_plate'

  // ── 1) 板坯：压缩铁锭 / 粉色史莱姆锭 / 压缩铁锭，纵向排列 ──
  //   空位用空格占位，保证第二列居中。
  event.shaped(BILLET, [
    ' C ',
    ' P ',
    ' C '
  ], {
    C: 'pneumaticcraft:ingot_iron_compressed',
    P: 'industrialforegoing:pink_slime_ingot'
  }).id('kubejs:crafting/airtight_alloy_billet')

  // ── 2) 压印机：1 板坯 -> 3 板，7200 RF ──
  //   与 thermal 自带的 press_*_ingot_to_plate 一致：单输入用 ingredient（不是 ingredients 数组），
  //   且不需要压印模具；产物用 result 数组，带 count。
  event.custom({
    type: 'thermal:press',
    ingredient: { item: BILLET },
    result: [{ item: PLATE, count: 3 }],
    energy: 7200
  }).id('kubejs:press/airtight_alloy_plate')

  console.info('[PLB] Airtight alloy: crafting billet (compressed iron / pink slime / compressed iron); ' +
    'press 1 billet -> 3 plates @ 7200 RF')
})
