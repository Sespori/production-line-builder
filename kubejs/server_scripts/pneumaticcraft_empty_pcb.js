// priority: 0
// 空电路板（pneumaticcraft:empty_pcb）：改成压力室配方（电路 + 富集金 + 塑料）
//
// ── 原配方 ──
//   pneumaticcraft:pressure_chamber/empty_pcb
//     2 红石火把（minecraft:redstone_torch）
//     3 导线（#pneumaticcraft:wiring）
//     1 塑料（pneumaticcraft:plastic）
//     pressure 1.5
//     -> 3 空电路板
//
// ── 新配方 ──
//   2 高级控制电路（mekanism:advanced_control_circuit）
//   1 富集金（mekanism:enriched_gold）
//   1 塑料（pneumaticcraft:plastic）
//   pressure 1.5（沿用原值）
//   -> 2 空电路板
//
// ── 写法依据 ──
//   与 pneumaticcraft_etching_acid.js 同一套：
//   输入侧 {"type":"pneumaticcraft:stacked_item","count":N}，输出侧 {"count":N,"item":...}。
//   原配方里 count 为 1 的规格（塑料）本来就不写 count，这里沿用。
//
// ── 影响面 ──
//   empty_pcb 的下游不受影响：assembly/unassembled_pcb（装配激光器，空板 -> 未组装板）
//   与 empty_pcb_from_failed_pcb（高炉，废板 -> 空板）都只认物品 ID，不认来路。
//
// 生效：/reload

ServerEvents.recipes(event => {
  const ID = 'pneumaticcraft:pressure_chamber/empty_pcb'
  event.remove({ id: ID })

  event.custom({
    type: 'pneumaticcraft:pressure_chamber',
    inputs: [
      { type: 'pneumaticcraft:stacked_item', count: 2, item: 'mekanism:advanced_control_circuit' },
      { item: 'mekanism:enriched_gold' },
      { item: 'pneumaticcraft:plastic' }
    ],
    pressure: 1.5,
    results: [
      { count: 2, item: 'pneumaticcraft:empty_pcb' }
    ]
  }).id(ID)

  console.info('[PLB] empty pcb: pressure chamber = 2 advanced control circuits + 1 enriched gold ' +
    '+ 1 plastic -> 2 empty pcbs')
})
