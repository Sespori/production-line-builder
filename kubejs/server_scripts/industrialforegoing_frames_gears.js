// priority: 80
// Industrial Foregoing 四张机器框架（pity / simple / advanced / supreme）
// 所在配方里的齿轮换档
//
//   #forge:gears/iron    -> alltheores:signalum_gear    （信素齿轮）
//   #forge:gears/gold    -> alltheores:enderium_gear    （末影齿轮）
//   #forge:gears/diamond -> kubejs:gear_mithril         （蕴魔秘银齿轮）
//
// 同一批配方里的「锭」按同样的三档逻辑替换：
//   #forge:ingots/iron   -> alltheores:signalum_ingot   （信素锭）
//   #forge:ingots/gold   -> alltheores:enderium_ingot   （末影锭）
// 第三档材料（钻石）对齐钻石齿轮那一档，换成秘银：
//   #forge:gems/diamond  -> kubejs:ingot_mithril        （蕴魔秘银锭）
//   minecraft:diamond    -> kubejs:ingot_mithril        （蕴魔秘银锭）
// 另：machine_frame_simple 的溶解室配方里两块下界砖换成流明锭：
//   minecraft:nether_brick -> alltheores:lumium_ingot   （流明锭，×2）
// 该配方的液体输入也换掉：
//   250 mB industrialforegoing:latex -> 1000 mB kubejs:mana （元始魔力）
// 注：#forge:ores/iron（ore_laser_base 的铁矿原矿）仍保持原样——原矿既不是锭也不是宝石。
//     minecraft:diamond_pickaxe 是工具，不参与材料换档。
//
// 范围：配方里出现 machine_frame（物品或 industrialforegoing:machine_frame/* 标签）的
// 那一批，共 44 条 —— 40 条原版有序合成 + 4 条溶解室（simple / advanced / supreme 框架
// 与菌丝反应器）。IF 里带齿轮的配方都带机器框架，所以等价于「IF 的齿轮配方」。
//
// 写法：
//   · 40 条 crafting_shaped 原文都包在 forge:conditional 里（条件只是 item_exists，恒真），
//     KubeJS 的 replaceInput 看不到 conditional 内部的类型，所以 remove + event.shaped 重建，
//     ID 沿用原 ID，不再保留 conditional 包装。
//   · 4 条 industrialforegoing:dissolution_chamber 用 KubeJS Industrial Foregoing 插件注册的
//     schema 重建：event.recipes.industrialforegoing.dissolution_chamber(input[], inputFluid, output, time)。
//     只替换 input 数组里的齿轮项；inputFluid 传 { fluid, amount } 对象，
//     插件的 input_fluid 组件写出时会转成 IF 要的 SNBT（{Amount:..,FluidName:".."}）。
//   · 齿轮标签只在这 44 条里换，不动全包的 #forge:gears/*。
//
// 生效：/reload

ServerEvents.recipes(event => {
  // animal_baby_separator
  event.remove({ id: 'industrialforegoing:animal_baby_separator' })
  event.shaped("industrialforegoing:animal_baby_separator", [
    "PAP",
    "CMC",
    "DGD",
  ], {
    A: "minecraft:golden_carrot",
    C: "minecraft:wheat",
    D: "#forge:dyes/purple",
    G: "alltheores:enderium_gear",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
  }).id('industrialforegoing:animal_baby_separator')

  // animal_feeder
  event.remove({ id: 'industrialforegoing:animal_feeder' })
  event.shaped("industrialforegoing:animal_feeder", [
    "PAP",
    "CMC",
    "DGD",
  ], {
    A: "minecraft:golden_apple",
    C: "minecraft:golden_carrot",
    D: "#forge:dyes/purple",
    G: "alltheores:signalum_gear",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
  }).id('industrialforegoing:animal_feeder')

  // animal_rancher
  event.remove({ id: 'industrialforegoing:animal_rancher' })
  event.shaped("industrialforegoing:animal_rancher", [
    "PPP",
    "SBS",
    "GMG",
  ], {
    B: "minecraft:bucket",
    G: "alltheores:enderium_gear",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
    S: "minecraft:shears",
  }).id('industrialforegoing:animal_rancher')

  // biofuel_generator
  event.remove({ id: 'industrialforegoing:biofuel_generator' })
  event.shaped("industrialforegoing:biofuel_generator", [
    "PDP",
    "SMS",
    "ASA",
  ], {
    A: "alltheores:enderium_gear",
    D: "minecraft:furnace",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
    S: "minecraft:piston",
  }).id('industrialforegoing:biofuel_generator')

  // bioreactor
  event.remove({ id: 'industrialforegoing:bioreactor' })
  event.shaped("industrialforegoing:bioreactor", [
    "PDP",
    "SMS",
    "ARA",
  ], {
    A: "minecraft:brick",
    D: "kubejs:gear_mithril",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
    R: "minecraft:sugar",
    S: "#forge:slimeballs",
  }).id('industrialforegoing:bioreactor')

  // black_hole_controller
  event.remove({ id: 'industrialforegoing:black_hole_controller' })
  event.shaped("industrialforegoing:black_hole_controller", [
    "PGP",
    "NEN",
    "PMP",
  ], {
    E: "#forge:chests/ender",
    G: "kubejs:gear_mithril",
    M: "#industrialforegoing:machine_frame/supreme",
    N: "minecraft:ender_eye",
    P: "#forge:plastic",
  }).id('industrialforegoing:black_hole_controller')

  // block_breaker
  event.remove({ id: 'industrialforegoing:block_breaker' })
  event.shaped("industrialforegoing:block_breaker", [
    "PGP",
    "IMD",
    "SRS",
  ], {
    D: "minecraft:iron_shovel",
    G: "alltheores:enderium_gear",
    I: "minecraft:iron_pickaxe",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
    R: "minecraft:redstone",
    S: "alltheores:signalum_gear",
  }).id('industrialforegoing:block_breaker')

  // common_black_hole_tank
  event.remove({ id: 'industrialforegoing:common_black_hole_tank' })
  event.shaped("industrialforegoing:common_black_hole_tank", [
    "PPP",
    "CEC",
    "CMC",
  ], {
    C: "minecraft:bucket",
    E: "alltheores:signalum_gear",
    M: "#industrialforegoing:machine_frame/pity",
    P: "alltheores:signalum_ingot",
  }).id('industrialforegoing:common_black_hole_tank')

  // common_black_hole_unit
  event.remove({ id: 'industrialforegoing:common_black_hole_unit' })
  event.shaped("industrialforegoing:common_black_hole_unit", [
    "PPP",
    "CEC",
    "CMC",
  ], {
    C: "#forge:chests/wooden",
    E: "alltheores:signalum_gear",
    M: "#industrialforegoing:machine_frame/pity",
    P: "alltheores:signalum_ingot",
  }).id('industrialforegoing:common_black_hole_unit')

  // dissolution_chamber
  event.remove({ id: 'industrialforegoing:dissolution_chamber' })
  event.shaped("industrialforegoing:dissolution_chamber", [
    "PCP",
    "BMB",
    "GDG",
  ], {
    B: "minecraft:bucket",
    C: "#forge:chests",
    D: "kubejs:gear_mithril",
    G: "alltheores:enderium_ingot",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
  }).id('industrialforegoing:dissolution_chamber')

  // dissolution_chamber/advanced_machine_frame（溶解室）
  // 写法：event.recipes.industrialforegoing.dissolution_chamber(input[], inputFluid, output, time)
  //   注意 inputFluid 这个自定义组件只在「从 JSON 反序列化」时才把字符串当 SNBT 解析；
  //   从 JS 传字符串会被当成流体 ID（报 Unable to cast ... to 'input_fluid'）。
  //   所以这里传对象 { fluid, amount }，组件写出时自己会转成 IF 要的 SNBT 字符串。
  event.remove({ id: 'industrialforegoing:dissolution_chamber/advanced_machine_frame' })
  event.recipes.industrialforegoing.dissolution_chamber([
    '#forge:plastic',
    '#industrialforegoing:machine_frame/simple',
    '#forge:plastic',
    'minecraft:netherite_scrap',
    'minecraft:netherite_scrap',
    'alltheores:enderium_ingot',
    'kubejs:gear_mithril',
    'alltheores:enderium_ingot'
  ], { fluid: 'industrialforegoing:pink_slime', amount: 500 },
    'industrialforegoing:machine_frame_advanced', 300)
    .id('industrialforegoing:dissolution_chamber/advanced_machine_frame')

  // dissolution_chamber/mycelial_reactor（溶解室）
  event.remove({ id: 'industrialforegoing:dissolution_chamber/mycelial_reactor' })
  event.recipes.industrialforegoing.dissolution_chamber([
    '#forge:plastic',
    '#industrialforegoing:machine_frame/supreme',
    '#forge:plastic',
    'minecraft:netherite_ingot',
    'minecraft:netherite_ingot',
    'kubejs:gear_mithril',
    'minecraft:nether_star',
    'kubejs:gear_mithril'
  ], { fluid: 'industrialforegoing:ether_gas', amount: 500 },
    'industrialforegoing:mycelial_reactor', 600)
    .id('industrialforegoing:dissolution_chamber/mycelial_reactor')

  // dissolution_chamber/simple_machine_frame（溶解室）
  event.remove({ id: 'industrialforegoing:dissolution_chamber/simple_machine_frame' })
  event.recipes.industrialforegoing.dissolution_chamber([
    '#forge:plastic',
    '#industrialforegoing:machine_frame/pity',
    '#forge:plastic',
    'alltheores:lumium_ingot',
    'alltheores:lumium_ingot',
    'alltheores:signalum_ingot',
    'alltheores:enderium_gear',
    'alltheores:signalum_ingot'
  ], { fluid: 'kubejs:mana', amount: 1000 },
    'industrialforegoing:machine_frame_simple', 300)
    .id('industrialforegoing:dissolution_chamber/simple_machine_frame')

  // dissolution_chamber/supreme_machine_frame（溶解室）
  event.remove({ id: 'industrialforegoing:dissolution_chamber/supreme_machine_frame' })
  event.recipes.industrialforegoing.dissolution_chamber([
    '#forge:plastic',
    '#industrialforegoing:machine_frame/advanced',
    '#forge:plastic',
    'minecraft:netherite_ingot',
    'minecraft:netherite_ingot',
    'kubejs:ingot_mithril',
    'kubejs:gear_mithril',
    'kubejs:ingot_mithril'
  ], { fluid: 'industrialforegoing:ether_gas', amount: 135 },
    'industrialforegoing:machine_frame_supreme', 300)
    .id('industrialforegoing:dissolution_chamber/supreme_machine_frame')

  // dye_mixer
  event.remove({ id: 'industrialforegoing:dye_mixer' })
  event.shaped("industrialforegoing:dye_mixer", [
    "PDP",
    "DMD",
    "PRP",
  ], {
    D: "#forge:dyes",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
    R: "alltheores:enderium_gear",
  }).id('industrialforegoing:dye_mixer')

  // enchantment_applicator
  event.remove({ id: 'industrialforegoing:enchantment_applicator' })
  event.shaped("industrialforegoing:enchantment_applicator", [
    "PPP",
    "BMB",
    "GBG",
  ], {
    B: "minecraft:anvil",
    G: "alltheores:enderium_gear",
    M: "#industrialforegoing:machine_frame/advanced",
    P: "#forge:plastic",
  }).id('industrialforegoing:enchantment_applicator')

  // enchantment_extractor
  event.remove({ id: 'industrialforegoing:enchantment_extractor' })
  event.shaped("industrialforegoing:enchantment_extractor", [
    "PSP",
    "BMB",
    "DGD",
  ], {
    B: "minecraft:book",
    D: "kubejs:ingot_mithril",
    G: "alltheores:enderium_gear",
    M: "#industrialforegoing:machine_frame/advanced",
    P: "#forge:plastic",
    S: "minecraft:nether_bricks",
  }).id('industrialforegoing:enchantment_extractor')

  // enchantment_sorter
  event.remove({ id: 'industrialforegoing:enchantment_sorter' })
  event.shaped("industrialforegoing:enchantment_sorter", [
    "PSP",
    "BME",
    "PGP",
  ], {
    B: "minecraft:book",
    E: "minecraft:enchanted_book",
    G: "kubejs:gear_mithril",
    M: "#industrialforegoing:machine_frame/advanced",
    P: "#forge:plastic",
    S: "minecraft:ender_pearl",
  }).id('industrialforegoing:enchantment_sorter')

  // fermentation_station
  event.remove({ id: 'industrialforegoing:fermentation_station' })
  event.shaped("industrialforegoing:fermentation_station", [
    "pwp",
    "wgw",
    "pbp",
  ], {
    b: "#industrialforegoing:machine_frame/simple",
    g: "alltheores:enderium_gear",
    p: "#forge:plastic",
    w: "#minecraft:logs",
  }).id('industrialforegoing:fermentation_station')

  // fluid_collector
  event.remove({ id: 'industrialforegoing:fluid_collector' })
  event.shaped("industrialforegoing:fluid_collector", [
    "PBP",
    "BMB",
    "SRS",
  ], {
    B: "minecraft:bucket",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
    R: "minecraft:redstone",
    S: "alltheores:signalum_gear",
  }).id('industrialforegoing:fluid_collector')

  // fluid_laser_base
  event.remove({ id: 'industrialforegoing:fluid_laser_base' })
  event.shaped("industrialforegoing:fluid_laser_base", [
    "pfp",
    "bmb",
    "grg",
  ], {
    b: "minecraft:bucket",
    f: "minecraft:diamond_pickaxe",
    g: "kubejs:gear_mithril",
    m: "#industrialforegoing:machine_frame/advanced",
    p: "#forge:plastic",
    r: "minecraft:redstone",
  }).id('industrialforegoing:fluid_laser_base')

  // fluid_placer
  event.remove({ id: 'industrialforegoing:fluid_placer' })
  event.shaped("industrialforegoing:fluid_placer", [
    "PBP",
    "BMB",
    "SRS",
  ], {
    B: "minecraft:water_bucket",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
    R: "minecraft:redstone",
    S: "alltheores:signalum_gear",
  }).id('industrialforegoing:fluid_placer')

  // fluid_sieving_machine
  event.remove({ id: 'industrialforegoing:fluid_sieving_machine' })
  event.shaped("industrialforegoing:fluid_sieving_machine", [
    "pcp",
    "ggg",
    "aba",
  ], {
    a: "alltheores:enderium_gear",
    b: "#industrialforegoing:machine_frame/advanced",
    c: "industrialforegoing:pink_slime",
    g: "minecraft:iron_bars",
    p: "#forge:plastic",
  }).id('industrialforegoing:fluid_sieving_machine')

  // hydroponic_bed
  event.remove({ id: 'industrialforegoing:hydroponic_bed' })
  event.shaped("industrialforegoing:hydroponic_bed", [
    "PDP",
    "SBS",
    "GMG",
  ], {
    B: "industrialforegoing:fertilizer",
    D: "minecraft:dirt",
    G: "alltheores:enderium_gear",
    M: "#industrialforegoing:machine_frame/simple",
    P: "#forge:plastic",
    S: "minecraft:iron_hoe",
  }).id('industrialforegoing:hydroponic_bed')

  // infinity_charger
  event.remove({ id: 'industrialforegoing:infinity_charger' })
  event.shaped("industrialforegoing:infinity_charger", [
    "ppp",
    "rcr",
    "omo",
  ], {
    c: "kubejs:gear_mithril",
    m: "#industrialforegoing:machine_frame/advanced",
    o: "minecraft:redstone_block",
    p: "#forge:plastic",
    r: "minecraft:repeater",
  }).id('industrialforegoing:infinity_charger')

  // laser_drill
  event.remove({ id: 'industrialforegoing:laser_drill' })
  event.shaped("industrialforegoing:laser_drill", [
    "pfp",
    "bmb",
    "grg",
  ], {
    b: "minecraft:piston",
    f: "kubejs:gear_mithril",
    g: "alltheores:enderium_gear",
    m: "#industrialforegoing:machine_frame/simple",
    p: "#forge:plastic",
    r: "minecraft:redstone",
  }).id('industrialforegoing:laser_drill')

  // marine_fisher
  event.remove({ id: 'industrialforegoing:marine_fisher' })
  event.shaped("industrialforegoing:marine_fisher", [
    "pfp",
    "bmb",
    "grg",
  ], {
    b: "minecraft:bucket",
    f: "minecraft:fishing_rod",
    g: "alltheores:signalum_gear",
    m: "#industrialforegoing:machine_frame/simple",
    p: "#forge:plastic",
    r: "minecraft:redstone",
  }).id('industrialforegoing:marine_fisher')

  // material_stonework_factory
  event.remove({ id: 'industrialforegoing:material_stonework_factory' })
  event.shaped("industrialforegoing:material_stonework_factory", [
    "pcp",
    "gmf",
    "aba",
  ], {
    a: "alltheores:enderium_gear",
    b: "industrialforegoing:pink_slime",
    c: "minecraft:crafting_table",
    f: "minecraft:furnace",
    g: "minecraft:diamond_pickaxe",
    m: "#industrialforegoing:machine_frame/advanced",
    p: "#forge:plastic",
  }).id('industrialforegoing:material_stonework_factory')

  // mob_crusher
  event.remove({ id: 'industrialforegoing:mob_crusher' })
  event.shaped("industrialforegoing:mob_crusher", [
    "PSP",
    "BMB",
    "GRG",
  ], {
    B: "minecraft:book",
    G: "alltheores:enderium_gear",
    M: "#industrialforegoing:machine_frame/advanced",
    P: "#forge:plastic",
    R: "minecraft:redstone",
    S: "minecraft:iron_sword",
  }).id('industrialforegoing:mob_crusher')

  // mob_slaughter_factory
  event.remove({ id: 'industrialforegoing:mob_slaughter_factory' })
  event.shaped("industrialforegoing:mob_slaughter_factory", [
    "PDP",
    "SMS",
    "ARA",
  ], {
    A: "minecraft:iron_axe",
    D: "alltheores:enderium_gear",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
    R: "minecraft:redstone",
    S: "minecraft:iron_sword",
  }).id('industrialforegoing:mob_slaughter_factory')

  // ore_laser_base
  event.remove({ id: 'industrialforegoing:ore_laser_base' })
  event.shaped("industrialforegoing:ore_laser_base", [
    "pfp",
    "bmb",
    "grg",
  ], {
    b: "#forge:ores/iron",
    f: "minecraft:diamond_pickaxe",
    g: "kubejs:gear_mithril",
    m: "#industrialforegoing:machine_frame/advanced",
    p: "#forge:plastic",
    r: "#forge:dusts/redstone",
  }).id('industrialforegoing:ore_laser_base')

  // plant_fertilizer
  event.remove({ id: 'industrialforegoing:plant_fertilizer' })
  event.shaped("industrialforegoing:plant_fertilizer", [
    "PBP",
    "LML",
    "GRG",
  ], {
    B: "minecraft:glass_bottle",
    G: "alltheores:signalum_gear",
    L: "minecraft:leather",
    M: "#industrialforegoing:machine_frame/simple",
    P: "#forge:plastic",
    R: "minecraft:redstone",
  }).id('industrialforegoing:plant_fertilizer')

  // plant_gatherer
  event.remove({ id: 'industrialforegoing:plant_gatherer' })
  event.shaped("industrialforegoing:plant_gatherer", [
    "PHP",
    "AMA",
    "GRG",
  ], {
    A: "minecraft:iron_axe",
    G: "alltheores:enderium_gear",
    H: "minecraft:iron_hoe",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
    R: "minecraft:redstone",
  }).id('industrialforegoing:plant_gatherer')

  // plant_sower
  event.remove({ id: 'industrialforegoing:plant_sower' })
  event.shaped("industrialforegoing:plant_sower", [
    "PBP",
    "LML",
    "GRG",
  ], {
    B: "minecraft:flower_pot",
    G: "alltheores:signalum_gear",
    L: "minecraft:piston",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
    R: "minecraft:redstone",
  }).id('industrialforegoing:plant_sower')

  // potion_brewer
  event.remove({ id: 'industrialforegoing:potion_brewer' })
  event.shaped("industrialforegoing:potion_brewer", [
    "PSP",
    "BMB",
    "GBG",
  ], {
    B: "alltheores:enderium_gear",
    G: "minecraft:repeater",
    M: "#industrialforegoing:machine_frame/advanced",
    P: "#forge:plastic",
    S: "minecraft:brewing_stand",
  }).id('industrialforegoing:potion_brewer')

  // resourceful_furnace
  event.remove({ id: 'industrialforegoing:resourceful_furnace' })
  event.shaped("industrialforegoing:resourceful_furnace", [
    "PBP",
    "LML",
    "PRP",
  ], {
    B: "minecraft:bucket",
    L: "minecraft:furnace",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
    R: "alltheores:enderium_gear",
  }).id('industrialforegoing:resourceful_furnace')

  // sewage_composter
  event.remove({ id: 'industrialforegoing:sewage_composter' })
  event.shaped("industrialforegoing:sewage_composter", [
    "PFP",
    "DMD",
    "BGB",
  ], {
    B: "minecraft:brick",
    D: "minecraft:piston",
    F: "minecraft:furnace",
    G: "alltheores:signalum_gear",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
  }).id('industrialforegoing:sewage_composter')

  // sewer
  event.remove({ id: 'industrialforegoing:sewer' })
  event.shaped("industrialforegoing:sewer", [
    "PEP",
    "BMB",
    "BGB",
  ], {
    B: "minecraft:brick",
    E: "minecraft:bucket",
    G: "alltheores:signalum_gear",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
  }).id('industrialforegoing:sewer')

  // simulated_hydroponic_bed
  event.remove({ id: 'industrialforegoing:simulated_hydroponic_bed' })
  event.shaped("industrialforegoing:simulated_hydroponic_bed", [
    "PDP",
    "SBS",
    "GMG",
  ], {
    B: "industrialforegoing:fertilizer",
    D: "industrialforegoing:hydroponic_simulation_processor",
    G: "alltheores:enderium_gear",
    M: "#industrialforegoing:machine_frame/simple",
    P: "#forge:plastic",
    S: "minecraft:iron_hoe",
  }).id('industrialforegoing:simulated_hydroponic_bed')

  // sludge_refiner
  event.remove({ id: 'industrialforegoing:sludge_refiner' })
  event.shaped("industrialforegoing:sludge_refiner", [
    "PBP",
    "LML",
    "GRG",
  ], {
    B: "minecraft:bucket",
    G: "alltheores:signalum_gear",
    L: "minecraft:furnace",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
    R: "alltheores:enderium_gear",
  }).id('industrialforegoing:sludge_refiner')

  // spores_recreator
  event.remove({ id: 'industrialforegoing:spores_recreator' })
  event.shaped("industrialforegoing:spores_recreator", [
    "PSP",
    "IMI",
    "PSP",
  ], {
    I: "#forge:mushrooms",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
    S: "alltheores:signalum_gear",
  }).id('industrialforegoing:spores_recreator')

  // stasis_chamber
  event.remove({ id: 'industrialforegoing:stasis_chamber' })
  event.shaped("industrialforegoing:stasis_chamber", [
    "sss",
    "gmg",
    "ipi",
  ], {
    g: "minecraft:ghast_tear",
    i: "alltheores:enderium_gear",
    m: "#industrialforegoing:machine_frame/advanced",
    p: "minecraft:piston",
    s: "minecraft:soul_sand",
  }).id('industrialforegoing:stasis_chamber')

  // washing_factory
  event.remove({ id: 'industrialforegoing:washing_factory' })
  event.shaped("industrialforegoing:washing_factory", [
    "pcp",
    "gmg",
    "aba",
  ], {
    a: "kubejs:gear_mithril",
    b: "minecraft:furnace",
    c: "industrialforegoing:meat_feeder",
    g: "#forge:plastic",
    m: "#industrialforegoing:machine_frame/advanced",
    p: "industrialforegoing:pink_slime_ingot",
  }).id('industrialforegoing:washing_factory')

  // water_condensator
  event.remove({ id: 'industrialforegoing:water_condensator' })
  event.shaped("industrialforegoing:water_condensator", [
    "PBP",
    "LML",
    "GRG",
  ], {
    B: "minecraft:water_bucket",
    G: "alltheores:signalum_gear",
    L: "minecraft:piston",
    M: "#industrialforegoing:machine_frame/pity",
    P: "#forge:plastic",
    R: "minecraft:redstone",
  }).id('industrialforegoing:water_condensator')
})
