// priority: 0
// 本整合包自加的配方
//
// 1) 熔融青金石：熔岩炉（thermal:machine_crucible）1 个青金石 → 100 mB、2000 RF
//    参考 Thermal 自己熔融红石粉的做法，产量与耗能按需求定死
//    （耗能最初写 8000，后来统一降为本包其余熔岩炉配方的 1/4：2000）。
//
// 2) 紫水晶粉：粉碎机（thermal:machine_pulverizer）紫水晶碎片 → 1 个紫水晶粉
//    完全照搬 Thermal 的“锭 → 粉”写法（如 pulverizer_iron_ingot_to_dust.json）：
//    单项输入、产出 1 个、energy_mod 0.5（基础耗能的一半），不加副产物。
//
// 3) 魔力粉基底：灌装机（thermal:machine_bottler）
//    1 个紫水晶粉 + 400 mB 熔融青金石 → 1 个魔力粉基底，2000 RF
//    格式与 thermal 自己的 bottler_* 一致：ingredients 里物品与流体各一项，
//    result 是产物数组，energy 为单次总耗能。
//
// 4) 共振魔源宝石：粉碎机（thermal:machine_pulverizer）
//    1 个 → 9 个魔力粉基底，2000 RF（绝对耗能，写法同 pulverizer_logs.json）
//    物品由 startup_scripts/custom_items.js 注册，配方在灌装机那套魔力线之上，
//    等于把 Ars 的魔源宝石折算成一批魔力粉基底。
//
// 5) 秘银粉：灌装机（thermal:machine_bottler）
//    1 个 alltheores:silver_dust + 1000 mB kubejs:mana（元始魔力）→ 1 个 kubejs:dust_mithril，2000 RF
//    即"银粉用元始魔力灌注成秘银粉"，是秘银线的起点；
//    秘银粉再进感应炉烧成热蕴魔秘银锭（见 hot_ingots.js）。
//
// 6) 硫化橡胶：灌装机（thermal:machine_bottler）
//    1000 mB thermal:latex（植物胶乳）+ 1 个 thermal:sulfur_dust → 3 个 thermal:cured_rubber，2000 RF
//    它取代了感应炉那条「2 橡胶 + 1 硫 -> 4 个」（已被 thermal_cured_rubber_recipes.js 删除），
//    也是现在唯一"用硫"的硫化橡胶途径。
//
// 7) 液态松香：熔岩炉（thermal:machine_crucible）
//    1 个 thermal:rosin（松香）→ 250 mB kubejs:molten_rosin，2000 RF
//    流体由 startup_scripts/custom_fluids.js 注册，是 IF 塑料的新原料（见 mekanism_custom_recipes.js）。
//
// 生效：/reload

ServerEvents.recipes(event => {
  // ── 熔岩炉：青金石 → 熔融青金石 ──
  event.custom({
    type: 'thermal:crucible',
    ingredient: { item: 'minecraft:lapis_lazuli' },
    result: [{ fluid: 'kubejs:molten_lapis', amount: 100 }],
    energy: 2000
  }).id('kubejs:crucible/molten_lapis')

  // ── 粉碎机：紫水晶碎片 → 紫水晶粉 ──
  event.custom({
    type: 'thermal:pulverizer',
    ingredient: { item: 'minecraft:amethyst_shard' },
    result: [{ item: 'kubejs:amethyst_dust', count: 1 }],
    energy_mod: 0.5
  }).id('kubejs:pulverizer/amethyst_shard_to_dust')

  // ── 灌装机：紫水晶粉 + 熔融青金石 → 魔力粉基底 ──
  event.custom({
    type: 'thermal:bottler',
    ingredients: [
      { item: 'kubejs:amethyst_dust', count: 1 },
      { fluid: 'kubejs:molten_lapis', amount: 400 }
    ],
    result: [{ item: 'kubejs:dust_mana_base', count: 1 }],
    energy: 2000
  }).id('kubejs:bottler/dust_mana_base')

  // ── 粉碎机：共振魔源宝石 → 9 个魔力粉基底 ──
  event.custom({
    type: 'thermal:pulverizer',
    ingredient: { item: 'kubejs:resonant_source_gem' },
    result: [{ item: 'kubejs:dust_mana_base', count: 9 }],
    energy: 2000
  }).id('kubejs:pulverizer/resonant_source_gem')

  // ── 灌装机：1 银粉 + 1000 mB 元始魔力 → 1 秘银粉 ──
  //   格式同上面那条 bottler（ingredients 里物品与流体各一项，energy 为单次总耗能）。
  event.custom({
    type: 'thermal:bottler',
    ingredients: [
      { item: 'alltheores:silver_dust', count: 1 },
      { fluid: 'kubejs:mana', amount: 1000 }
    ],
    result: [{ item: 'kubejs:dust_mithril', count: 1 }],
    energy: 2000
  }).id('kubejs:bottler/dust_mithril')

  // ── 灌装机：1000 mB 植物胶乳 + 1 硫粉 → 3 个硫化橡胶 ──
  //   取代被删的感应炉配方（thermal:machines/smelter/smelter_cured_rubber）。
  event.custom({
    type: 'thermal:bottler',
    ingredients: [
      { item: 'thermal:sulfur_dust', count: 1 },
      { fluid: 'thermal:latex', amount: 1000 }
    ],
    result: [{ item: 'thermal:cured_rubber', count: 3 }],
    energy: 2000
  }).id('kubejs:bottler/cured_rubber')

  // ── 熔岩炉：1 松香 → 250 mB 液态松香 ──
  event.custom({
    type: 'thermal:crucible',
    ingredient: { item: 'thermal:rosin' },
    result: [{ fluid: 'kubejs:molten_rosin', amount: 250 }],
    energy: 2000
  }).id('kubejs:crucible/molten_rosin')
})
