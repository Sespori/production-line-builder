// priority: 0
// 热锭体系：合金粉 → 热锭（感应炉）→ 合金锭（致冷器）
//
// ── 背景 ──
// 原本 alltheores 的三种合金锭可以直接把对应的粉丢进熔炉/高炉烧出来：
//   alltheores:enderium_dust  → alltheores:enderium_ingot
//   alltheores:signalum_dust  → alltheores:signalum_ingot
//   alltheores:lumium_dust    → alltheores:lumium_ingot
// 现在改成必须先熔成「热锭」，再用致冷器冷却成普通锭。
//
// ── 禁用的直接烧制路径 ──
// 1) alltheores 的熔炉与高炉配方（各 3 条，共 6 条）：
//      alltheores:<metal>_ingot_from_dust           (minecraft:smelting,  200 tick)
//      alltheores:<metal>_ingot_from_dust_blasting  (minecraft:blasting,  100 tick)
//    这是此前唯一还没堵住的「粉直接变锭」通路。
//
// 2) 感应炉里的「粉 → 锭」三条（thermal:machines/smelter/smelter_<metal>_dust）
//    已由 thermal_smelter_endgame_alloys.js 删掉，这里按 ID 再兜一次底，
//    防止那个脚本的「类型 + 产物」过滤因命名空间变化失效。
//
// ── 新增 ──
// 感应炉（thermal:machine_smelter）：
//   1 对应合金粉 + 1 炽焱粉 + 1 末影珍珠粉 / 红石粉 / 萤石粉 → 1 热锭
//   末影珍珠粉用 thermal:ender_pearl_dust（见 ender_pearl_dust_unify.js）
//   能耗：末影 18000 RF、信素 15000 RF、流明 12000 RF（显式绝对能量）
// 致冷器（thermal:machine_chiller）两条并存：
//   普通版：1 热锭 + 1000 mB 水（淬火）→ 1 普通合金锭，能耗为对应热锭的一半：
//           末影 9000 / 信素 7500 / 流明 6000 RF
//   高效版：1 热锭 + 500 mB 极寒之凛冰 → 1 普通合金锭，
//           能耗为普通版的 1/5（即感应炉的 1/20）：
//           末影 900 / 信素 750 / 流明 600 RF
//   水是必须的：Thermal 的致冷器 JEI 分类（ChillerRecipeCategory.setRecipe）
//   硬编码读取 fluidInputs.get(0)，纯物品配方会在注册时抛 IndexOutOfBoundsException
//   并被 JEI 跳过——配方能加载、机器能跑，但玩家在 JEI 里看不到。
//   物品输入本身是会被消耗的（resolveInputs 中除 thermal:machine_casts
//   模具标签外一律扣除），所以热锭会正常消失。
//
// ── 热蕴魔秘银锭（kubejs:hot_mithril_ingot）──
// 同一套逻辑的第四条，材料换成秘银线：
//   感应炉：1 秘银粉 kubejs:dust_mithril + 1 炽焱粉 kubejs:dust_pyrotheum
//           + 1 魔力粉 kubejs:dust_mana → 1 热蕴魔秘银锭，15000 RF
//   致冷器普通版：1 热锭 + 1000 mB 水 → 1 秘银锭 kubejs:ingot_mithril，7500 RF
//   致冷器高效版：1 热锭 + 500 mB 凛冰 → 1 秘银锭，750 RF
//   数值按热信素锭（同为 15000 RF 烧制）取值：水版 /2、凛冰版 /20。
//   秘银粉本身由灌装机「银粉 + 1000 mB 元始魔力」得到（见 custom_recipes.js）。
//
// ── 热锭配方的统一写法（约定，2026-11-22 起）──
//   感应炉里的输入顺序固定为：**炽焱粉 → 合金粉 → 可选附加材料**
//     · 第一位永远是 kubejs:dust_pyrotheum
//     · 第二位是被加热的粉（合金粉 / 金属粉）
//     · 第三位是附加材料，**没有特别说明就留空**（不要为了凑三元而塞萤石粉之类）
//   冷却沿用同一套比例：水版 = 烧制耗能的 1/2，凛冰版 = 烧制耗能的 1/20。
//   历史配方（末影 / 信素 / 流明 / 秘银）写的是「粉 + 炽焱粉 + 附加材料」的旧顺序，
//   暂未回改；铂铱锇与热ATM已按新顺序。
//
// 生效：/reload

ServerEvents.recipes(event => {
  // [金属, 主题材料, 感应炉耗能 RF]
  const METALS = [
    ['enderium', 'thermal:ender_pearl_dust', 18000],  // 末影珍珠粉
    ['signalum', 'minecraft:redstone', 15000],     // 红石粉
    ['lumium', 'minecraft:glowstone_dust', 12000]  // 萤石粉
  ]

  METALS.forEach(m => {
    const metal = m[0]
    const extra = m[1]
    const energy = m[2]

    // 1) 禁用直接烧制
    event.remove({ id: 'alltheores:' + metal + '_ingot_from_dust' })
    event.remove({ id: 'alltheores:' + metal + '_ingot_from_dust_blasting' })
    event.remove({ id: 'thermal:machines/smelter/smelter_' + metal + '_dust' })

    // 2) 感应炉：粉 + 炽焱粉 + 主题材料 → 热锭
    event.custom({
      type: 'thermal:smelter',
      ingredients: [
        { item: 'alltheores:' + metal + '_dust', count: 1 },
        { item: 'kubejs:dust_pyrotheum', count: 1 },
        { item: extra, count: 1 }
      ],
      result: [{ item: 'kubejs:hot_' + metal + '_ingot', count: 1 }],
      energy: energy
    }).id('kubejs:smelter/hot_' + metal + '_ingot')

    // 3) 致冷器：热锭 + 水（淬火）→ 普通锭，能耗为上一半
    //    必须带流体输入：ChillerRecipeCategory.setRecipe 第 79 行直接取
    //    fluidInputs.get(0)，纯物品配方会抛 IndexOutOfBoundsException，
    //    整条配方在 JEI 里被跳过（机器能跑但玩家看不到）。
    event.custom({
      type: 'thermal:chiller',
      ingredients: [
        { fluid: 'minecraft:water', amount: 1000 },
        { item: 'kubejs:hot_' + metal + '_ingot', count: 1 }
      ],
      result: [{ item: 'alltheores:' + metal + '_ingot', count: 1 }],
      energy: energy / 2
    }).id('kubejs:chiller/' + metal + '_ingot')

    // 4) 致冷器·高效版：热锭 + 极寒之凛冰 → 普通锭
    //    用 500 mB 凛冰替代 1000 mB 水，能耗为普通版的 1/5：
    //    普通版是 energy / 2，再降为它的五分之一 = energy / 20。
    //    两条配方并存：机器按当前罐内液体自动匹配，接水走普通版、接凛冰走高效版。
    event.custom({
      type: 'thermal:chiller',
      ingredients: [
        { fluid: 'kubejs:cryotheum', amount: 500 },
        { item: 'kubejs:hot_' + metal + '_ingot', count: 1 }
      ],
      result: [{ item: 'alltheores:' + metal + '_ingot', count: 1 }],
      energy: energy / 20
    }).id('kubejs:chiller/' + metal + '_ingot_cryotheum')
  })

  // ══ 热蕴魔秘银锭（kubejs:hot_mithril_ingot）═══════════════════════════
  //   和上面三种合金同一套逻辑，但材料不是「合金粉 + 主题材料」，而是
  //   「秘银粉 + 炽焱粉 + 魔力粉」，冷却后得到 kubejs:ingot_mithril（秘银锭）。
  //   数值对齐热信素锭（那个也是 15000 RF 烧制）：水版 /2、凛冰版 /20。

  // 1) 感应炉：1 秘银粉 + 1 炽焱粉 + 1 魔力粉 → 1 热蕴魔秘银锭，15000 RF
  event.custom({
    type: 'thermal:smelter',
    ingredients: [
      { item: 'kubejs:dust_mithril', count: 1 },
      { item: 'kubejs:dust_pyrotheum', count: 1 },
      { item: 'kubejs:dust_mana', count: 1 }
    ],
    result: [{ item: 'kubejs:hot_mithril_ingot', count: 1 }],
    energy: 15000
  }).id('kubejs:smelter/hot_mithril_ingot')

  // 2) 致冷器·普通版：1 热锭 + 1000 mB 水 → 1 秘银锭，7500 RF（烧制的一半）
  event.custom({
    type: 'thermal:chiller',
    ingredients: [
      { fluid: 'minecraft:water', amount: 1000 },
      { item: 'kubejs:hot_mithril_ingot', count: 1 }
    ],
    result: [{ item: 'kubejs:ingot_mithril', count: 1 }],
    energy: 7500
  }).id('kubejs:chiller/mithril_ingot')

  // 3) 致冷器·高效版：1 热锭 + 500 mB 极寒之凛冰 → 1 秘银锭，750 RF（普通版的 1/5）
  event.custom({
    type: 'thermal:chiller',
    ingredients: [
      { fluid: 'kubejs:cryotheum', amount: 500 },
      { item: 'kubejs:hot_mithril_ingot', count: 1 }
    ],
    result: [{ item: 'kubejs:ingot_mithril', count: 1 }],
    energy: 750
  }).id('kubejs:chiller/mithril_ingot_cryotheum')

  // ══ 热下界合金锭（kubejs:hot_netherite_ingot）══════════════════════════
  //   同一条链的第五条，但材料份量不同：下界合金粉 + 炽焱粉 + 萤石粉。
  //   下界合金粉统一用 alltheores:netherite_dust（见 netherite_dust_recipes.js
  //   里把 thermal / mekanism 的粉全部重定向过来的部分）。
  //   萤石粉用原版 minecraft:glowstone_dust，与热流明锭那条的第三材料一致。
  //   冷却产物是原版 minecraft:netherite_ingot（AllTheOres 没有自己的下界合金锭）。

  // 1) 感应炉：1 下界合金粉 + 1 炽焱粉 + 1 萤石粉 → 1 热下界合金锭，18000 RF
  //    （与热末影锭同档，都是 18000 RF）
  event.custom({
    type: 'thermal:smelter',
    ingredients: [
      { item: 'alltheores:netherite_dust', count: 1 },
      { item: 'kubejs:dust_pyrotheum', count: 1 },
      { item: 'minecraft:glowstone_dust', count: 1 }
    ],
    result: [{ item: 'kubejs:hot_netherite_ingot', count: 1 }],
    energy: 18000
  }).id('kubejs:smelter/hot_netherite_ingot')

  // 2) 致冷器·普通版：1 热锭 + 1000 mB 水 → 1 下界合金锭，9000 RF（烧制的一半）
  //    与 hot_enderium_ingot 的冷却配方同参数。
  event.custom({
    type: 'thermal:chiller',
    ingredients: [
      { fluid: 'minecraft:water', amount: 1000 },
      { item: 'kubejs:hot_netherite_ingot', count: 1 }
    ],
    result: [{ item: 'minecraft:netherite_ingot', count: 1 }],
    energy: 9000
  }).id('kubejs:chiller/netherite_ingot')

  // 3) 致冷器·高效版：1 热锭 + 500 mB 极寒之凛冰 → 1 下界合金锭，900 RF（普通版的 1/5）
  event.custom({
    type: 'thermal:chiller',
    ingredients: [
      { fluid: 'kubejs:cryotheum', amount: 500 },
      { item: 'kubejs:hot_netherite_ingot', count: 1 }
    ],
    result: [{ item: 'minecraft:netherite_ingot', count: 1 }],
    energy: 900
  }).id('kubejs:chiller/netherite_ingot_cryotheum')

  // ══ 热ATM锭（kubejs:hot_allthemodium_ingot）════════════════════════════
  //   第七条，按新的统一写法：炽焱粉 + 合金粉，无附加材料。
  //   「合金粉」这一格用 allthemodium:allthemodium_dust（ATM 粉）——
  //   它是粗ATM粉经整条湿法链（离心 → 氨浸 → 沉淀 → 还原）得到的成品粉。
  //   冷却产物是 allthemodium:allthemodium_ingot。
  //   耗能 24000 RF（全包热锭最高一档）；冷却按同一套比例：
  //     水版 12000 RF（1/2）、凛冰版 1200 RF（1/20）。
  //   同时禁用「ATM粉直烧成锭」，与上面三种合金的处理一致：
  //   粉必须先进感应炉熔成热锭，再进致冷器冷却。

  // 0) 禁用直接烧制：allthemodium 自带的熔炉 / 高炉两条
  //      allthemodium:allthemodium_ingot_from_dust_smelting   (200 tick)
  //      allthemodium:allthemodium_ingot_from_dust_blasting   (200 tick)
  event.remove({ id: 'allthemodium:allthemodium_ingot_from_dust_smelting' })
  event.remove({ id: 'allthemodium:allthemodium_ingot_from_dust_blasting' })

  //    兜底：将来若别的模组（或本包后续脚本）再塞同类配方，按「输入是 ATM 粉、
  //    产物是 ATM 锭」一并挡掉；物品与 tag 各扫一遍（tag 写法扫不到物品 ID）。
  event.remove({
    input: 'allthemodium:allthemodium_dust',
    output: 'allthemodium:allthemodium_ingot'
  })
  event.remove({
    input: '#forge:dusts/allthemodium',
    output: 'allthemodium:allthemodium_ingot'
  })

  // 1) 感应炉：1 炽焱粉 + 1 ATM粉 → 1 热ATM锭，24000 RF
  event.custom({
    type: 'thermal:smelter',
    ingredients: [
      { item: 'kubejs:dust_pyrotheum', count: 1 },
      { item: 'allthemodium:allthemodium_dust', count: 1 }
    ],
    result: [{ item: 'kubejs:hot_allthemodium_ingot', count: 1 }],
    energy: 24000
  }).id('kubejs:smelter/hot_allthemodium_ingot')

  // 2) 致冷器·普通版：1 热锭 + 1000 mB 水 → 1 ATM锭，12000 RF
  event.custom({
    type: 'thermal:chiller',
    ingredients: [
      { fluid: 'minecraft:water', amount: 1000 },
      { item: 'kubejs:hot_allthemodium_ingot', count: 1 }
    ],
    result: [{ item: 'allthemodium:allthemodium_ingot', count: 1 }],
    energy: 12000
  }).id('kubejs:chiller/allthemodium_ingot')

  // 3) 致冷器·高效版：1 热锭 + 500 mB 极寒之凛冰 → 1 ATM锭，1200 RF
  event.custom({
    type: 'thermal:chiller',
    ingredients: [
      { fluid: 'kubejs:cryotheum', amount: 500 },
      { item: 'kubejs:hot_allthemodium_ingot', count: 1 }
    ],
    result: [{ item: 'allthemodium:allthemodium_ingot', count: 1 }],
    energy: 1200
  }).id('kubejs:chiller/allthemodium_ingot_cryotheum')
})
