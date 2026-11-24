// priority: 0
// 下界合金线的原料改造
//
// 1) 禁用 alltheores:netherite_dust 的既有配方
//    AllTheOres 只给了一条：data/alltheores/recipes/netherite_dust_from_hammer_crushing.json
//    （shapeless：1 下界合金锭 + 任意锤子 → 1 下界合金粉）。
//    用 output 过滤而不是按 ID 删，这样将来别的模组再塞同类配方也一并挡掉。
//
// 2) 禁用「远古残骸 → 下界合金碎片」的烧炼
//    原版两条：minecraft:netherite_scrap（熔炉 200t）与
//    minecraft:netherite_scrap_from_blasting（高炉 100t）。
//    改用 input + output 双条件过滤，一次覆盖所有配方类型。
//
// 3) 加压反应室：氯化氢 + 硝酸 把污浊下界合金碎片洗成「下界合金碎片粉」
//
// 4) 工作台：2 碎片粉 + 2 金粉 → 1 alltheores:netherite_dust
//
// 生效：/reload

ServerEvents.recipes(event => {
  // ── 1) 清掉原有的下界合金粉配方 ──
  event.remove({ output: 'alltheores:netherite_dust' })

  // ── 2) 清掉远古残骸直接产碎片的路子（按内容过滤，覆盖所有配方类型）──
  //   · 原版 smelting / blasting
  //   · Thermal 感应炉 smelter_ancient_debris（2 碎片 + 20% rich_slag）
  //   · 集成动力 挤压机 / 机械挤压机 netherrite_scrap（1 碎片 + 75% 追加）
  //   · EnderIO 合金炉的「熔炼模式」读的是原版熔炼缓存 RecipeCaches.SMELTING，
  //     原版 smelting 一删它就跟着没了（alloy_smelting 目录 47 个配方里没有
  //     ancient_debris，已逐个查过）
  event.remove({
    input: 'minecraft:ancient_debris',
    output: 'minecraft:netherite_scrap'
  })

  //   Mekanism 富集仓那条的输入不是物品而是 tag，过滤不到，单独删：
  //   mekanism:processing/netherite/ancient_debris_to_scrap
  //   （input 为 #forge:ores/netherite_scrap，产出 2 个碎片）
  event.remove({ id: 'mekanism:processing/netherite/ancient_debris_to_scrap' })
  event.remove({
    input: '#forge:ores/netherite_scrap',
    output: 'minecraft:netherite_scrap'
  })

  // ── 2b) 补按 ID 删一遍，防止上面 filter 对某些配方类型匹配不到 ──
  event.remove({ id: 'thermal:machines/smelter/smelter_ancient_debris' })
  event.remove({ id: 'integrateddynamics:squeezer/ore/netherrite_scrap' })
  event.remove({ id: 'integrateddynamics:mechanical_squeezer/ore/netherrite_scrap' })


  // ── 3) 加压反应室：洗掉污浊下界合金碎片上的杂质 ──
  //   300 mB 氯化氢（gas）+ 100 mB 硝酸（我们自加的流体 kubejs:nitric_acid）
  //   + 1 个 mekanism:dirty_netherite_scrap → 1 个 kubejs:netherite_scrap_dust
  //   三个输入字段齐全（itemInput / fluidInput / gasInput），energyRequired 按本包
  //   其它 PRC 配方的惯例取 1000 J/次。
  //   注：PRC 的产物字段只有 itemOutput（ItemStack）与 gasOutput（GasStack），
  //       配方体系里不存在浆液（slurry）输出位，所以「污浊金浆液」无法挂在这条配方上。
  event.custom({
    type: 'mekanism:reaction',
    duration: 100,
    energyRequired: 1000,
    itemInput: { ingredient: { item: 'mekanism:dirty_netherite_scrap' } },
    fluidInput: { amount: 100, fluid: 'kubejs:nitric_acid' },
    gasInput: { amount: 300, gas: 'mekanism:hydrogen_chloride' },
    itemOutput: { count: 1, item: 'kubejs:netherite_scrap_dust' }
  }).id('kubejs:reaction/netherite_scrap_dust_from_dirty_scrap')

  // ── 4) 下界合金粉：2 碎片粉 + 2 金粉（无序合成，2×2 也摆得下） ──
  event.shapeless('alltheores:netherite_dust', [
    'kubejs:netherite_scrap_dust',
    'kubejs:netherite_scrap_dust',
    'alltheores:gold_dust',
    'alltheores:gold_dust'
  ]).id('kubejs:netherite_dust_from_scrap_dust')

  // ── 5) 切断「碎片 → 下界合金锭 / 下界合金粉」的所有直接路径 ──
  //    碎片只能先洗成碎片粉，再走 碎片粉 + 金粉 → 下界合金粉 → 烧成锭。
  //
  //    a) 原版工作台：4 碎片 + 4 金锭 → 1 下界合金锭
  //       id 就是 minecraft:netherite_ingot（块↔锭那两条 id 不同，不会误删）
  event.remove({ id: 'minecraft:netherite_ingot' })
  event.remove({
    input: 'minecraft:netherite_scrap',
    output: 'minecraft:netherite_ingot'
  })

  //    b) 冶金灌注机：4 碎片 + 40 金灌注 → mekanism:dust_netherite
  //       （产物是 **mekanism 的** dust_netherite，不是 alltheores:netherite_dust）
  //       这条配方同时出现在 mekanism_tag_input_fix.js 的重建清单里，那边已经把它
  //       移出清单并单独 remove —— 必须两处一起动：KubeJS 的删除统一在新增之前应用，
  //       只要清单里还留着它，重建出来的配方就会把这里的删除"救活"。
  event.remove({ id: 'mekanism:processing/netherite/scrap_to_dust' })
  //    这里只按 ID 删，不再用 {type, output:'mekanism:dust_netherite'} 过滤 ——
  //    下面第 7 段会把所有产 mekanism:dust_netherite 的配方重定向成 alltheores 粉，
  //    两种机制的执行先后不确定，按 output 过滤可能刚好落空。

  //    c) 感应炉（合金模式）：4 金锭/金粉 + 4 碎片 → 1 下界合金锭
  //       （thermal:machines/smelter/smelter_alloy_netherite，800 RF）
  //       只删这一条；smelter_netherite_plate_to_ingot（板 → 锭）保留。
  event.remove({ id: 'thermal:machines/smelter/smelter_alloy_netherite' })
  event.remove({
    type: 'thermal:smelter',
    input: 'minecraft:netherite_scrap',
    output: 'minecraft:netherite_ingot'
  })

  // ── 7) 「下界合金粉」统一到 AllTheOres ──────────────────────────────────
  //   本包里叫「下界合金粉」的物品有三个，ID 各不相同：
  //     kubejs 保留目标：alltheores:netherite_dust
  //     要淘汰的 1：mekanism:dust_netherite   （Mekanism，lang item.mekanism.dust_netherite）
  //     要淘汰的 2：thermal:netherite_dust    （Thermal Series，pulverizer 把下界合金锭磨成的粉）
  //   做法分两层：
  //   (a) 先对「原版类型」的配方做通用替换（smelting / crafting 之类，KubeJS 有 schema）；
  //   (b) Mekanism / Thermal 的自定义配方 **replaceInput / replaceOutput 改不动** ——
  //       KubeJS 6.5 的 RecipesEventJS.replaceOutput 走 forEachRecipeAsync ->
  //       RecipeJS.replaceOutput，而 JsonRecipeJS（没有内置 schema 的类型）没有输出字段
  //       的概念，遍历完等于没改（日志里 modified 计数也不会涨）。
  //       所以下面把实际存在的 3 条「产粉」配方逐条删掉、用原 ID 重建。
  ;['mekanism:dust_netherite', 'thermal:netherite_dust'].forEach(id => {
    event.replaceInput({}, id, 'alltheores:netherite_dust')
    event.replaceOutput({}, id, 'alltheores:netherite_dust')
  })

  const NETHERITE_DUST = 'alltheores:netherite_dust'

  //   全 jar 扫描结果：产出这两个旧粉的配方只有下面三条，没有「以它们为输入」的配方。
  //   另有两条按 tag（#forge:dusts/netherite）吃粉的配方，tag 里只登记了 mekanism 粉：
  //     · ingot_from_dust_smelting / _blasting —— 已在第 8 段删掉；
  //     · dust_to_ancient_debris（融合机 Combiner）—— 在下面第 3 条单独迁移。

  //    1. Mekanism 粉碎机：任意 #forge:ingots/netherite → 下界合金粉
  event.remove({ id: 'mekanism:processing/netherite/ingot_to_dust' })
  event.custom({
    type: 'mekanism:crushing',
    input: { ingredient: { tag: 'forge:ingots/netherite' } },
    output: { item: NETHERITE_DUST }
  }).id('mekanism:processing/netherite/ingot_to_dust')

  //    2. Thermal 粉碎机：下界合金锭 → 下界合金粉
  event.remove({ id: 'thermal:machines/pulverizer/pulverizer_netherite_ingot_to_dust' })
  event.custom({
    type: 'thermal:pulverizer',
    ingredient: { tag: 'forge:ingots/netherite' },
    result: [{ item: NETHERITE_DUST, count: 1 }],
    energy_mod: 0.5
  }).id('thermal:machines/pulverizer/pulverizer_netherite_ingot_to_dust')

  //    3. Thermal 粉碎机：下界合金板 → 下界合金粉
  event.remove({ id: 'thermal:machines/pulverizer/pulverizer_netherite_plate_to_dust' })
  event.custom({
    type: 'thermal:pulverizer',
    ingredient: { tag: 'forge:plates/netherite' },
    result: [{ item: NETHERITE_DUST, count: 1 }],
    energy_mod: 0.5
  }).id('thermal:machines/pulverizer/pulverizer_netherite_plate_to_dust')

  //    4. Mekanism 融合机（Combiner）：2 份下界合金粉 + 1 玄武岩 → 1 古代残骸
  //       原配方的 mainInput 是 tag（#forge:dusts/netherite，里面只有 mekanism 粉），
  //       tag 改不动具体指向，所以整条重建，直接写死 alltheores:netherite_dust。
  //       注意这是个「粉 → 残骸」的回流配方（2 粉换 1 残骸），成本高于收益，
  //       保留它是为了让旧配方体系完整，不构成刷物品漏洞。
  event.remove({ id: 'mekanism:processing/netherite/dust_to_ancient_debris' })
  event.custom({
    type: 'mekanism:combining',
    extraInput: { ingredient: { item: 'minecraft:basalt' } },
    mainInput: { amount: 2, ingredient: { item: NETHERITE_DUST } },
    output: { item: 'minecraft:ancient_debris' }
  }).id('mekanism:processing/netherite/dust_to_ancient_debris')

  // ── 8) 粉直接烧成锭的两条（Mekanism 的原版熔炉/高炉配方）──
  //   input 都是 #forge:dusts/netherite 这个 tag，而该 tag 里原本**只有**
  //   mekanism:dust_netherite（Mekanism 自己的 data/forge/tags/items/dusts/netherite.json）。
  //   粉已经被重定向，玩家拿不到它；这里再按 ID 删掉，保证「粉必须走热锭链」没有缺口。
  event.remove({ id: 'mekanism:processing/netherite/ingot_from_dust_smelting' })
  event.remove({ id: 'mekanism:processing/netherite/ingot_from_dust_blasting' })
})
