// priority: 90
// 工业先锋 · 矿石激光钻基座（industrialforegoing:ore_laser_base）的取矿配方
//
// 本脚本负责三件事：
//   1) 原先出「粗矿（raw_materials）」的 12 条金属配方，产物统一换成**对应的矿石方块**；
//   2) 上一轮补的 zinc / apatite 两条，zinc 同样换成矿石；
//   3) 新增 AllTheModium 三种矿石（allthemodium / vibranium / unobtainium），权重 1。
// 另外保留上一轮的改动：所有「带白名单」的配方，白名单里都补了 ATM 采矿维度群系
// （allthemodium:mining），让这些限定群系的矿在采矿维度也能挖到。
//
// ─────────────────────────────────────────────────────────────────────────────
// 写法：KubeJS Industrial Foregoing（kjsindustrialforegoing-1.0）注册的 schema：
//   event.recipes.industrialforegoing.laser_drill_ore(output, catalyst, rarity[, pointer])
// 键序 = output, rarity, catalyst, pointer(optional 0)；位置参数顺序是 output, catalyst, rarity。
//
// ⚠ output 的类型是 KubeJS 的 OutputItem（内部就是 ItemStack），**写不了 {tag: ...}**，
//   所以原来用标签输出的配方全部写成具体物品。
//
// ─────────────────────────────────────────────────────────────────────────────
// 一、为什么统一用「不带维度前缀」的 _ore
//
//   AllTheOres 给同一种金属准备了 5 套方块：
//     <metal>_ore            主世界（石头层）
//     deepslate_<metal>_ore  主世界（深板岩层）
//     nether_<metal>_ore     下界
//     end_<metal>_ore        末地
//     other_<metal>_ore      ATM 采矿维度的远古石层
//   它们的世界生成是同一份 configured_feature 按目标方块自动挑的
//   （targets 里都写全了，靠 block_match / tag_match 命中）。
//   激光钻产出的只是「一块矿石」这个物品，与机器所在维度无关，
//   所以统一取基础的 <metal>_ore；维度变体只留给世界生成。
//   原版三种金属（iron / copper / gold）AllTheOres 没有对应方块，直接给 minecraft:*_ore。
//
// 二、粗矿 → 矿石的对照（12 条 + zinc）
//
//   raw_materials/iron      -> minecraft:iron_ore
//   raw_materials/copper    -> minecraft:copper_ore
//   raw_materials/gold      -> minecraft:gold_ore
//   raw_materials/aluminum  -> alltheores:aluminum_ore
//   raw_materials/lead      -> alltheores:lead_ore
//   raw_materials/nickel    -> alltheores:nickel_ore
//   raw_materials/osmium    -> alltheores:osmium_ore
//   raw_materials/platinum  -> alltheores:platinum_ore
//   raw_materials/silver    -> alltheores:silver_ore
//   raw_materials/tin       -> alltheores:tin_ore
//   raw_materials/uranium   -> alltheores:uranium_ore
//   raw_materials/iridium   -> alltheores:iridium_ore
//   kubejs/.../zinc         -> alltheores:zinc_ore
//
//   其余 Ores 类配方（peridot / ruby / sapphire / cinnabar / niter / sulfur / fluorite）
//   本来出的就是矿石方块，不动。
//   出矿权重、深度、透镜（catalyst）全部沿用原配方，只换产物。
//
// 三、新增的 AllTheModium 三条（权重均为 1，对应「很稀有」）
//
//   产物                         群系（白名单）                     深度
//   allthemodium:allthemodium_ore  minecraft:deep_dark                -64..10
//                                  allthemodium:mining                65..129
//   allthemodium:vibranium_ore     下界五群系 + allthemodium:mining    64..127
//   allthemodium:unobtainium_ore   minecraft:end_highlands + mining    0..128
//
//   依据（AllTheModium 2.5.8 的世界生成数据）：
//     allthemodium_ore  —— biome_modifier/allthemodium.json 挂 minecraft:deep_dark，
//                          placed_feature 高度 above_bottom 0 → absolute 10（主世界即 -64..10）；
//                          采矿维度另有一份 allthemodium_mining，高度 65..129。
//     vibranium_ore     —— biome_modifier/vibranium.json 挂 #minecraft:is_nether，
//                          高度 above_bottom 64 → absolute 127。
//     unobtainium_ore   —— biome_modifier/unobtainium.json 挂 minecraft:end_highlands，
//                          高度 above_bottom 0 → absolute 128。
//   注意 IF 的 getValidRarity 是「按顺序取第一条同时满足 深度 与 群系 的 rarity」，
//   所以同一条配方里多条 rarity 能分别在不同维度/高度命中。
// ─────────────────────────────────────────────────────────────────────────────

ServerEvents.recipes(event => {
  // ── 常量 ──
  const MINING = 'allthemodium:mining'
  const BIOME_TYPE = 'minecraft:worldgen/biome'

  const NETHER_BIOMES = [
    'minecraft:nether_wastes',
    'minecraft:basalt_deltas',
    'minecraft:crimson_forest',
    'minecraft:warped_forest',
    'minecraft:soul_sand_valley'
  ]
  const END_BIOMES = [
    'minecraft:the_end',
    'minecraft:the_void',
    'minecraft:small_end_islands',
    'minecraft:end_barrens',
    'minecraft:end_highlands',
    'minecraft:end_midlands'
  ]

  // rarity 的 whitelist / blacklist 是插件自定义的 resource_key 组件：
  // 写入时 type 取数组第一个 ResourceKey 的注册表名，values 是 id 数组；空数组写成 {}。
  // rarity 的 5 个键（whitelist / blacklist / depth_min / depth_max / weight）都是必填。
  const biomeSet = values => ({ type: BIOME_TYPE, values: values })

  // 主世界型：白名单留空、只把末地拉黑（IF 的默认写法）
  const notEnd = (weight, min, max) => ({
    whitelist: biomeSet([]),
    blacklist: biomeSet(END_BIOMES),
    depth_min: min,
    depth_max: max,
    weight: weight
  })

  // 限定群系型：只在这些群系生效（白名单非空时黑名单被忽略）
  const inBiomes = (weight, min, max, values) => ({
    whitelist: biomeSet(values),
    blacklist: biomeSet([]),
    depth_min: min,
    depth_max: max,
    weight: weight
  })

  // 统一写法：先按 ID 删掉原配方，再用同 ID 重建
  // （原配方多数被 forge:conditional 包着，type 过滤看不到内层类型，只能按 ID 删）
  const laser = (id, output, lens, rarity) => {
    event.remove({ id: id })
    event.recipes.industrialforegoing.laser_drill_ore(output, lens, rarity).id(id)
  }

  // ══════════════════════════════════════════════════════════════════════
  // 1) 原本带白名单的 7 条：白名单补 ATM 采矿维度 + 产物改矿石
  //    （产物、透镜、权重、深度沿用原配方）
  // ══════════════════════════════════════════════════════════════════════

  // 下界五群系 —— 采矿维度对应层也能采
  laser('industrialforegoing:laser_drill_ore/ancient_debris',
    'minecraft:ancient_debris',
    'industrialforegoing:laser_lens12',
    [inBiomes(1, 1, 20, NETHER_BIOMES.concat([MINING]))])

  laser('industrialforegoing:laser_drill_ore/glowstone',
    'minecraft:glowstone',
    'industrialforegoing:laser_lens4',
    [inBiomes(8, 7, 117, NETHER_BIOMES.concat([MINING])), notEnd(1, 0, 255)])

  laser('industrialforegoing:laser_drill_ore/quartz',
    'minecraft:nether_quartz_ore',
    'industrialforegoing:laser_lens0',
    [inBiomes(12, 7, 117, NETHER_BIOMES.concat([MINING])), notEnd(1, 0, 255)])

  // 铀：原配方就是下界白名单
  laser('industrialforegoing:laser_drill_ore/raw_materials/uranium',
    'alltheores:uranium_ore',
    'industrialforegoing:laser_lens5',
    [inBiomes(5, 5, 29, NETHER_BIOMES.concat([MINING])), notEnd(1, 0, 255)])

  // 铱：原配方是末地六群系白名单。权重由原 8 下调到 3（铱在 AllTheOres 里只有山地生成，
  //     激光钻这条本来就在末地，两者叠起来过强，压一档）
  laser('industrialforegoing:laser_drill_ore/raw_materials/iridium',
    'alltheores:iridium_ore',
    'industrialforegoing:laser_lens0',
    [inBiomes(3, 5, 68, END_BIOMES.concat([MINING])), notEnd(1, 0, 255)])

  // 绿宝石：原配方只认 windswept_gravelly_hills（原文件重复写了两行，这里去重）
  laser('industrialforegoing:laser_drill_ore/emerald',
    'minecraft:emerald_ore',
    'industrialforegoing:laser_lens5',
    [inBiomes(8, 5, 29, ['minecraft:windswept_gravelly_hills', MINING]), notEnd(1, 0, 255)])

  // 金：恶地权重 16，另有两条主世界兜底
  laser('industrialforegoing:laser_drill_ore/raw_materials/gold',
    'minecraft:gold_ore',
    'industrialforegoing:laser_lens4',
    [
      inBiomes(16, 32, 80, ['minecraft:badlands', 'minecraft:eroded_badlands', MINING]),
      notEnd(6, 5, 32),
      notEnd(1, 0, 255)
    ])

  // ══════════════════════════════════════════════════════════════════════
  // 2) 原本没有重建过、但同样出粗矿的 9 条：产物改矿石
  //    这几条是「空白名单 + 末地黑名单」，采矿维度本来就不在黑名单里，不用再补群系。
  // ══════════════════════════════════════════════════════════════════════

  laser('industrialforegoing:laser_drill_ore/raw_materials/iron',
    'minecraft:iron_ore',
    'industrialforegoing:laser_lens12',
    [notEnd(20, 5, 68), notEnd(3, 0, 255)])

  laser('industrialforegoing:laser_drill_ore/raw_materials/copper',
    'minecraft:copper_ore',
    'industrialforegoing:laser_lens1',
    [notEnd(10, 35, 65), notEnd(2, 0, 255)])

  laser('industrialforegoing:laser_drill_ore/raw_materials/aluminum',
    'alltheores:aluminum_ore',
    'industrialforegoing:laser_lens12',
    [notEnd(5, 68, 84), notEnd(1, 0, 255)])

  laser('industrialforegoing:laser_drill_ore/raw_materials/lead',
    'alltheores:lead_ore',
    'industrialforegoing:laser_lens10',
    [notEnd(6, 10, 40), notEnd(1, 0, 255)])

  laser('industrialforegoing:laser_drill_ore/raw_materials/nickel',
    'alltheores:nickel_ore',
    'industrialforegoing:laser_lens12',
    [notEnd(4, 5, 68), notEnd(1, 0, 255)])

  laser('industrialforegoing:laser_drill_ore/raw_materials/osmium',
    'alltheores:osmium_ore',
    'industrialforegoing:laser_lens8',
    [notEnd(8, 5, 36), notEnd(1, 0, 255)])

  laser('industrialforegoing:laser_drill_ore/raw_materials/platinum',
    'alltheores:platinum_ore',
    'industrialforegoing:laser_lens3',
    [notEnd(3, 5, 16), notEnd(1, 0, 255)])

  laser('industrialforegoing:laser_drill_ore/raw_materials/silver',
    'alltheores:silver_ore',
    'industrialforegoing:laser_lens7',
    [notEnd(5, 10, 40), notEnd(1, 0, 255)])

  laser('industrialforegoing:laser_drill_ore/raw_materials/tin',
    'alltheores:tin_ore',
    'industrialforegoing:laser_lens8',
    [notEnd(8, 64, 96), notEnd(2, 0, 255)])

  // ══════════════════════════════════════════════════════════════════════
  // 3) 上一轮补的两种矿物：锌（改矿石）、磷灰石（本来就是矿石）
  // ══════════════════════════════════════════════════════════════════════

  // 锌（AllTheOres）：主世界生成 count 3 × size 24、y -64..126
  laser('kubejs:laser_drill_ore/zinc',
    'alltheores:zinc_ore',
    'industrialforegoing:laser_lens12',
    [notEnd(6, 5, 126), notEnd(1, 0, 255)])

  // 磷灰石（Thermal）：只有主世界形态，Thermal 的宝石类一贯给矿石方块
  laser('kubejs:laser_drill_ore/apatite',
    'thermal:apatite_ore',
    'industrialforegoing:laser_lens8',
    [notEnd(6, 5, 96), notEnd(1, 0, 255)])

  // ══════════════════════════════════════════════════════════════════════
  // 4) 新增 AllTheModium 三种矿石（权重 1）
  //    三种都只在各自自然生成的群系 + ATM 采矿维度生效，没有 0..255 兜底，
  //    保证「稀有 + 位置受限」，不会被主世界任意高度的泛用条目抢走。
  // ══════════════════════════════════════════════════════════════════════

  // allthemodium：主世界 deep_dark（y -64..10）；采矿维度 y 65..129
  laser('kubejs:laser_drill_ore/allthemodium',
    'allthemodium:allthemodium_ore',
    'industrialforegoing:laser_lens4',
    [
      inBiomes(1, -64, 10, ['minecraft:deep_dark']),
      inBiomes(1, 65, 129, [MINING])
    ])

  // 振金：下界（y 64..127）；采矿维度的下界岩层同高度可采
  laser('kubejs:laser_drill_ore/vibranium',
    'allthemodium:vibranium_ore',
    'industrialforegoing:laser_lens9',
    [inBiomes(1, 64, 127, NETHER_BIOMES.concat([MINING]))])

  // 难得素：末地高原（y 0..128）；采矿维度的末地石层可采
  laser('kubejs:laser_drill_ore/unobtainium',
    'allthemodium:unobtainium_ore',
    'industrialforegoing:laser_lens10',
    [inBiomes(1, 0, 128, ['minecraft:end_highlands', MINING])])

  console.info('[PLB] ore_laser_base：13 条金属配方产物改为矿石方块；新增 allthemodium / vibranium / unobtainium 三条（权重 1）')
})
