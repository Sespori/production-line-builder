// priority: 0
// 铂铱锇合金（Pt-Ir-Os）产线 + 粉色史莱姆锭配方的原料改造
//
// 1) 合金粉：工作台无序合成，铂粉 + 铱粉 + 锇粉 各 1 → 1 铂铱锇合金粉
// 2) 热锭：感应炉 炽焱粉 + 合金粉 各 1 → 1 热铂铱锇合金锭，20000 RF
// 3) 冷却（两条并存，与 hot_ingots.js 的写法一致）：
//      · 普通版：1 热锭 + 1000 mB 水        → 1 铂铱锇合金锭，10000 RF
//      · 高效版：1 热锭 + 500 mB 极寒之凛冰 → 1 铂铱锇合金锭，1000 RF
// 4) industrialforegoing:pink_slime_ingot 的溶解室配方：
//      原：4 铁锭 + 4 金锭 + 1000 mB 粉红史莱姆 -> 1 锭（300 tick）
//      新：1 蕴魔秘银锭 + 1 铂铱锇合金锭 + 500 mB 粉红史莱姆 -> 1 锭（300 tick）
//
// 热锭配方的统一写法（自本条起生效，见 hot_ingots.js 末尾的「热ATM锭」同款）：
//   炽焱粉 + 合金粉 + 可选附加材料；没有特别说明时不留附加材料。
//   本条原带 1 个萤石粉，已按该逻辑删去。
// 生效：/reload（新物品与贴图需要重启）

ServerEvents.recipes(event => {
  const DUST = 'kubejs:dust_platinum_iridium_osmium'
  const INGOT = 'kubejs:ingot_platinum_iridium_osmium'
  const HOT = 'kubejs:hot_platinum_iridium_osmium_ingot'

  // ── 1) 合金粉：3 种金属粉各 1 ──
  event.shapeless(DUST, [
    'alltheores:platinum_dust',
    'alltheores:iridium_dust',
    'alltheores:osmium_dust'
  ]).id('kubejs:crafting/platinum_iridium_osmium_dust')

  // ── 2) 感应炉：炽焱粉 + 合金粉 → 热锭，20000 RF ──
  //   顺序固定为「炽焱粉 + 合金粉 (+ 可选附加材料)」；本条无附加材料。
  event.custom({
    type: 'thermal:smelter',
    ingredients: [
      { item: 'kubejs:dust_pyrotheum', count: 1 },
      { item: DUST, count: 1 }
    ],
    result: [{ item: HOT, count: 1 }],
    energy: 20000
  }).id('kubejs:smelter/hot_platinum_iridium_osmium_ingot')

  // ── 3a) 致冷器·普通版：热锭 + 1000 mB 水 → 合金锭，10000 RF ──
  //   必须带流体输入：Thermal 的 ChillerRecipeCategory 直接取 fluidInputs.get(0)，
  //   纯物品配方会在 JEI 注册时被跳过（机器能跑但看不到）。
  event.custom({
    type: 'thermal:chiller',
    ingredients: [
      { fluid: 'minecraft:water', amount: 1000 },
      { item: HOT, count: 1 }
    ],
    result: [{ item: INGOT, count: 1 }],
    energy: 10000
  }).id('kubejs:chiller/platinum_iridium_osmium_ingot')

  // ── 3b) 致冷器·高效版：热锭 + 500 mB 极寒之凛冰 → 合金锭，1000 RF ──
  event.custom({
    type: 'thermal:chiller',
    ingredients: [
      { fluid: 'kubejs:cryotheum', amount: 500 },
      { item: HOT, count: 1 }
    ],
    result: [{ item: INGOT, count: 1 }],
    energy: 1000
  }).id('kubejs:chiller/platinum_iridium_osmium_ingot_cryotheum')

  // ── 4) 粉色史莱姆锭：原料改为蕴魔秘银锭 + 铂铱锇合金锭，流体减半 ──
  //   用 kjsindustrialforegoing 的 schema 重建（input 是字符串数组，
  //   inputFluid 必须传对象，传 SNBT 字符串会被当成流体 ID 解析失败）。
  const PS_ID = 'industrialforegoing:dissolution_chamber/pink_slime_ingot'
  event.remove({ id: PS_ID })

  event.recipes.industrialforegoing.dissolution_chamber(
    ['kubejs:ingot_mithril', INGOT],
    { fluid: 'industrialforegoing:pink_slime', amount: 500 },
    'industrialforegoing:pink_slime_ingot',
    300
  ).id(PS_ID)

  console.info('[PLB] Pt-Ir-Os alloy: dust / hot ingot / 2 chiller recipes; ' +
    'pink_slime_ingot now needs mithril + Pt-Ir-Os ingot with 500 mB pink slime')
})
