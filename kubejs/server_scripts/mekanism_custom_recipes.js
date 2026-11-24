// priority: 0
// 本整合包自加的 Mekanism 配方
//
// 1) 紫水晶簇 → 3 紫水晶碎片（富集室 mekanism:enrichment_chamber）
//   富集室配方类型是 mekanism:enriching，格式：input.ingredient + output{item,count}。
//   包里原本没有紫水晶簇的富集配方（只有 Thermal 结晶器那一条），不会重复。
//
// 2) 紫水晶碎片 → 1 紫水晶粉（粉碎机 mekanism:crusher）
//   与 Thermal 粉碎机那条（custom_recipes.js 的 kubejs:pulverizer/amethyst_shard_to_dust）
//   原料与产物完全一致，只是换了一台机器，两条配方并存。
//   粉碎机配方类型是 mekanism:crushing，格式：input.ingredient + output{item,count}。
//   已确认全整合包没有涉及紫水晶的 mekanism:crushing 配方，不会重复。
//
// 3) 硫磺 → 1 硫粉（粉碎机 mekanism:crusher）
//   原料 thermal:sulfur（Thermal 的硫磺结晶），产物 thermal:sulfur_dust。
//   Thermal 原本只有「地球电荷」那条一次性配方（earth_charge/sulfur_dust_from_sulfur，1:1），
//   这里补一条可自动化的机器途径，比例保持一致（1 硫磺 → 1 硫粉）。
//   已确认全整合包没有硫相关的 mekanism:crushing 配方，不会重复。
//
// 4) 加压反应室 mekanism:pressurized_reaction_chamber（类型 mekanism:reaction）一条
//   1000 mB 氯化氢气体 + 1000 mB 水 + 1 粗铂粉 → 1 脏铂粉
//   给 kubejs:crude_platinum_dust 接上 Mekanism 的五倍线（脏铂粉 → 富集 → 铂粉）。
//   reaction 的 JSON 结构：itemInput{ingredient[,amount]} / fluidInput{amount,fluid|tag} /
//   gasInput{amount,gas} / energyRequired（可选）/ duration（必填）/
//   itemOutput{item[,count]} / gasOutput{amount,gas}。
//   **三个输入字段 itemInput / fluidInput / gasInput 是「必须都存在」的**：
//   序列化器用 GsonHelper.isArrayNode + getAsJsonObject/getAsJsonArray 无条件取节点，
//   字段缺失会直接抛异常导致整条配方加载失败（不是「省略即无输入」）。用不上的输入
//   只能填一个名义上的最小消耗。
//   **注意 hydrogen_chloride 是「气体」不是流体**，写 gasInput。
//   Mekanism 的 JEI 对空输入有过滤（getRepresentations + allMatch），不会崩。
//   （原先还有一条「水 + 盐水蒸气 → 气态盐水」的 PRC 配方，已按需求删除，
//     改由化学溶解室承担，见下面第 6 条。）
//
// 4b) 加压反应室：铱产线的两级氯化（与铂那条同构，配方在文件末尾）
//   · 1000 mB 氯化氢 + 1000 mB 水 + 1 粗铱粉 → 1 氯化铱粉
//   · 1000 mB 水 + 1000 mB 氢气 + 1 氯化铱粉 → 1 污浊铱粉（alltheores:dirty_iridium_dust）
//   前置：铱矿 / 粗铱 先经富集、锤子、熔炼变成粗铱粉，
//   见 alltheores_iridium_dust_to_chloride.js。
//
// 5) 化学结晶器 mekanism:chemical_crystallizer：气态盐水 → 盐，消耗 15 mB 改为 1000 mB
//   原配方：data/mekanism/recipes/crystallizing/salt.json
//     {"type":"mekanism:crystallizing","chemicalType":"gas",
//      "input":{"amount":15,"gas":"mekanism:brine"},"output":{"item":"mekanism:salt"}}
//   输入是化学品不是物品，replaceInput 改不到 -> remove + 用原 ID 重建。
//
// 6) 化学溶解室 mekanism:chemical_dissolution_chamber：1000 mB 水蒸气 + 1 盐 → 1000 mB 气态盐水
//   dissolution 的 JSON 结构：itemInput{ingredient} / gasInput{amount,gas} /
//   output{chemicalType,amount,<gas|slurry|infuse_type|pigment>}。
//   输出类型由 output.chemicalType 决定，机器输出槽是 MergedChemicalTank（能装气体），
//   所以这里可以直接产出 gas 而不是浆液。配方只有两个输入，不像 reaction 那样强制三输入。
//   **注意 gasInput.amount 是每 tick 注入量**：机器固定 100 tick，
//   总消耗 = amount × 100，JEI 显示的也是乘过 100 的总量。想耗 1000 mB 就写 amount 10。
//
// 7) 加压反应室：250 mB 液态松香 + 100 mB 乙烯 + 1 基片
//                 → 1 个 industrialforegoing:plastic + 10 mB 氢气
//   给 IF 塑料开新来源（原来只有「干橡胶烧塑料」，随橡胶链一起被禁用）。
//   ethene / hydrogen 都是 gas，写 gasInput / gasOutput；液态松香是自加流体，走 fluidInput。
//
// 8) 硝酸链（气体在 custom_gases.js，液体在 custom_fluids.js）
//   · 加压反应室：2 肥料 + 10 mB 水 + 100 mB 氧气 → 1 生物燃料 + 100 mB 氨气
//   · 化学混合器：1 mB 氨气 + 2 mB 氧气 → 1 mB 氮氧化物
//   · 化学混合器：1 mB 氮氧化物 + 1 mB 水蒸气 → 1 mB 气体硝酸
//   · 旋转冷凝器：1 mB 气体硝酸 → 1 mB 液体硝酸（rotary 只写单向就不会反向气化）
//
// 9) 旋转冷凝器：氨气 ↔ 液态氨（双向，1 mB : 1 mB）
//   rotary 的四个字段全写即双向：冷凝模式 气→液、蒸发模式 液→气。
//   kubejs:ammonia 见 startup_scripts/custom_gases.js，
//   kubejs:liquid_ammonia 见 startup_scripts/custom_fluids.js。
//
// ── 关于「耗能」──
// Mekanism 所有配方序列化器里**只有** PressurizedReactionRecipeSerializer 有
// energyRequired 字段（其余 enriching / crushing / crystallizing / dissolution /
// chemical_infusing / rotary / injecting / metallurgic_infusing 一律没有，
// 能量由机器固定每 tick 消耗）。所以本文件里只有 reaction 配方能写能耗，
// 都取 1000 J/次：100 tick 摊下来是额外 10 J/t，叠加机器自身的基础耗能。
// 参照物：Mekanism 自带的 reaction/substrate/ethene_oxygen 就是 duration 60 + energyRequired 1000；
// 而「2 生物燃料 + 10 mB 水 + 100 mB 氢气 → 基片 + 100 mB 乙烯」那条没写 energyRequired（=0）。
//   基片要不要消耗由附属模组 plb_addon 决定（标签 kubejs:prc_catalysts 里的物品在 PRC 里不消耗）。
//
// 生效：/reload

ServerEvents.recipes(event => {
  // ── 富集室：紫水晶簇 → 3 紫水晶碎片 ──
  event.custom({
    type: 'mekanism:enriching',
    input: { ingredient: { item: 'minecraft:amethyst_cluster' } },
    output: { count: 3, item: 'minecraft:amethyst_shard' }
  }).id('kubejs:enriching/amethyst_cluster')

  // ── 粉碎机：紫水晶碎片 → 1 紫水晶粉 ──
  event.custom({
    type: 'mekanism:crushing',
    input: { ingredient: { item: 'minecraft:amethyst_shard' } },
    output: { count: 1, item: 'kubejs:amethyst_dust' }
  }).id('kubejs:crushing/amethyst_shard_to_dust')

  // ── 粉碎机：末影珍珠 → 1 末影珍珠粉 ──
  //   与 AE2 刻印机那条同物料（1 末影珍珠 → 1 粉），充当 thermal:ender_pearl_dust
  //   的获取途径。ae2:ender_dust 的产出已在 ender_pearl_dust_unify.js 里禁用。
  event.custom({
    type: 'mekanism:crushing',
    input: { ingredient: { item: 'minecraft:ender_pearl' } },
    output: { count: 1, item: 'thermal:ender_pearl_dust' }
  }).id('kubejs:crushing/ender_pearl_to_dust')

  // ── 粉碎机：硫磺 → 1 硫粉 ──
  //   thermal:sulfur 是 Thermal 的硫磺（结晶产物），磨成 thermal:sulfur_dust。
  //   与 Thermal 的地球电荷配方同比例（1:1）；sulfur_unify.js 已把
  //   forge:dusts/sulfur 收敛为 thermal:sulfur_dust，这里产物直接写物品 ID。
  event.custom({
    type: 'mekanism:crushing',
    input: { ingredient: { item: 'thermal:sulfur' } },
    output: { count: 1, item: 'thermal:sulfur_dust' }
  }).id('kubejs:crushing/sulfur_to_dust')

  // ── 加压反应室：1000 mB 氯化氢 + 1000 mB 水 + 1 粗铂粉 → 1 脏铂粉 ──
  //   接上 Mekanism 五倍线：脏铂粉 →（富集室）→ 精制铂粉 →（熔炼 / 高炉）→ 铂锭。
  //   hydrogen_chloride 同样是 gas；fluidInput 是强制字段，用水当作盐酸水溶液。
  //   alltheores:dirty_platinum_dust 是现成物品（#mekanism:dirty_dusts/platinum 的唯一成员），
  //   不需要注册。
  event.custom({
    type: 'mekanism:reaction',
    duration: 100,
    gasInput: { amount: 1000, gas: 'mekanism:hydrogen_chloride' },
    fluidInput: { amount: 1000, fluid: 'minecraft:water' },
    itemInput: { ingredient: { item: 'kubejs:crude_platinum_dust' } },
    itemOutput: { count: 1, item: 'alltheores:dirty_platinum_dust' }
  }).id('kubejs:reaction/dirty_platinum_from_crude_dust')

  // ── 加压反应室：1000 mB 氯化氢 + 1000 mB 水 + 1 粗铱粉 → 1 氯化铱粉 ──
  //   铱产线的氯化段（GT 的 Ir + 3HCl → IrCl3 + 3/2 H2）。
  //   与上面铂那条完全同构：gasInput 是氯化氢，fluidInput 用水当盐酸水溶液，
  //   PRC 的三个输入字段（item / fluid / gas）必须齐全。
  //   产物 kubejs:iridium_chloride_dust 见 startup_scripts/custom_items.js。
  event.custom({
    type: 'mekanism:reaction',
    duration: 100,
    gasInput: { amount: 1000, gas: 'mekanism:hydrogen_chloride' },
    fluidInput: { amount: 1000, fluid: 'minecraft:water' },
    itemInput: { ingredient: { item: 'kubejs:crude_iridium_dust' } },
    itemOutput: { count: 1, item: 'kubejs:iridium_chloride_dust' },
    energyRequired: 1000
  }).id('kubejs:reaction/iridium_chloride_from_crude_dust')

  // ── 加压反应室：1000 mB 水 + 1000 mB 氢气 + 1 氯化铱粉 → 1 污浊铱粉 ──
  //   氢气还原（IrCl3 + 3/2 H2 → Ir + 3HCl），水按用户要求作为液相介质。
  //   产物是 alltheores:dirty_iridium_dust（污浊铱粉）而不是成品铱粉：
  //   接着走 Mekanism 五倍线的富集段
  //   （alltheores:mek_processing/iridium/dust/from_dirty_dust：脏粉 → 1 铱粉）。
  //   这里 item / fluid / gas 三个输入都是真实投入，没有名义输入。
  event.custom({
    type: 'mekanism:reaction',
    duration: 100,
    fluidInput: { amount: 1000, fluid: 'minecraft:water' },
    gasInput: { amount: 1000, gas: 'mekanism:hydrogen' },
    itemInput: { ingredient: { item: 'kubejs:iridium_chloride_dust' } },
    itemOutput: { count: 1, item: 'alltheores:dirty_iridium_dust' },
    energyRequired: 1000
  }).id('kubejs:reaction/iridium_dust_from_chloride')

  // ── 化学结晶器：1000 mB 气态盐水 → 1 盐 ──
  //   原配方只吃 15 mB 盐水，相当于盐水几乎用不完，这里提到 1000 mB。
  event.remove({ id: 'mekanism:crystallizing/salt' })

  event.custom({
    type: 'mekanism:crystallizing',
    chemicalType: 'gas',
    input: { amount: 1000, gas: 'mekanism:brine' },
    output: { item: 'mekanism:salt' }
  }).id('mekanism:crystallizing/salt')

  // ── 化学溶解室：1000 mB 水蒸气 + 1 盐 → 1000 mB 气态盐水 ──
  //   溶解室输出槽是 MergedChemicalTank，能装气体，所以 chemicalType 写 gas 直接产盐水。
  //   **gasInput.amount 是「每 tick 注入量」，不是总量**：
  //   机器固定跑 BASE_TICKS_REQUIRED = 100 tick（未装速度升级时），
  //   总消耗 = amount × 100；JEI 里显示的也是把 amount 乘 100 之后的总量
  //   （ChemicalDissolutionRecipeCategory 的 lambda 里就是 new GasStack(stack, amount * 100)）。
  //   所以想消耗 1000 mB 就要写 10 —— 写 1000 会变成每次 100,000 mB。
  event.custom({
    type: 'mekanism:dissolution',
    itemInput: { ingredient: { item: 'mekanism:salt' } },
    gasInput: { amount: 10, gas: 'mekanism:water_vapor' },
    output: { chemicalType: 'gas', amount: 1000, gas: 'mekanism:brine' }
  }).id('kubejs:dissolution/brine_from_salt_steam')

  // ── 加压反应室：250 mB 液态松香 + 100 mB 乙烯 + 1 基片
  //                 → 1 个塑料 + 10 mB 氢气 ──
  //   IF 塑料的新来源：原路径「干橡胶 ->（烧）塑料」随橡胶链一起被禁用（见
  //   disable_industrialforegoing_rubber.js / thermal_cured_rubber_recipes.js），
  //   IF 的三张机器框架都靠它，所以在这里补一条工业化的。
  //   · 液态松香：kubejs:molten_rosin（熔岩炉 1 松香 -> 250 mB，见 custom_recipes.js）
  //   · 乙烯 ethene、氢气 hydrogen 都是 **gas**，分别走 gasInput / gasOutput
  //   · 基片 mekanism:substrate 是物品输入
  //   三个输入字段（itemInput / fluidInput / gasInput）齐全，符合 PRC 的强制要求。
  //   耗能 1000 J / 次（100 tick → 额外 10 J/t，叠加机器基础耗能）。
  event.custom({
    type: 'mekanism:reaction',
    duration: 100,
    energyRequired: 1000,
    fluidInput: { amount: 250, fluid: 'kubejs:molten_rosin' },
    gasInput: { amount: 100, gas: 'mekanism:ethene' },
    itemInput: { ingredient: { item: 'mekanism:substrate' } },
    itemOutput: { count: 1, item: 'industrialforegoing:plastic' },
    gasOutput: { amount: 10, gas: 'mekanism:hydrogen' }
  }).id('kubejs:reaction/plastic_from_rosin')

  // ══════════ 硝酸链：氨气 → 氮氧化物 → 气体硝酸 → 液体硝酸 ══════════
  // 气体 / 流体本身在 startup_scripts 里注册（custom_gases.js / custom_fluids.js），
  // 这里只写转化配方。注意「气体硝酸」和「液体硝酸」同名 kubejs:nitric_acid，
  // 靠 JSON 里 gas / fluid 字段区分，两者在不同注册表，不冲突。

  // ── 1) 加压反应室：2 肥料 + 10 mB 水 + 100 mB 氧气
  //                    → 1 生物燃料 + 100 mB 氨气 ──
  //   itemInput 的格式是 {ingredient:{...}, amount:N}（amount 缺省为 1）。
  //   耗能 1000 J / 次，与 Mekanism 自己那条「基片 + 乙烯 + 氧气 → HDPE 粒」同量级。
  event.custom({
    type: 'mekanism:reaction',
    duration: 100,
    energyRequired: 1000,
    itemInput: { ingredient: { item: 'industrialforegoing:fertilizer' }, amount: 2 },
    fluidInput: { amount: 10, fluid: 'minecraft:water' },
    gasInput: { amount: 100, gas: 'mekanism:oxygen' },
    itemOutput: { count: 1, item: 'mekanism:bio_fuel' },
    gasOutput: { amount: 100, gas: 'kubejs:ammonia' }
  }).id('kubejs:reaction/ammonia_from_fertilizer')

  // ── 2) 化学混合器：1 mB 氨气 + 2 mB 氧气 → 1 mB 氮氧化物 ──
  event.custom({
    type: 'mekanism:chemical_infusing',
    leftInput: { amount: 1, gas: 'kubejs:ammonia' },
    rightInput: { amount: 2, gas: 'mekanism:oxygen' },
    output: { amount: 1, gas: 'kubejs:nitrogen_oxide' }
  }).id('kubejs:infusing/nitrogen_oxide')

  // ── 3) 化学混合器：1 mB 氮氧化物 + 1 mB 水蒸气 → 1 mB 气体硝酸 ──
  event.custom({
    type: 'mekanism:chemical_infusing',
    leftInput: { amount: 1, gas: 'kubejs:nitrogen_oxide' },
    rightInput: { amount: 1, gas: 'mekanism:water_vapor' },
    output: { amount: 1, gas: 'kubejs:nitric_acid' }
  }).id('kubejs:infusing/nitric_acid')

  // ── 4) 旋转冷凝器：1 mB 气体硝酸 → 1 mB 液体硝酸 ──
  //   rotary 的 JSON 是「有哪一对就支持哪个方向」：只写 gasInput + fluidOutput
  //   就只注册「气 → 液」，不写 fluidInput + gasOutput 就不会反向气化。
  event.custom({
    type: 'mekanism:rotary',
    gasInput: { amount: 1, gas: 'kubejs:nitric_acid' },
    fluidOutput: { amount: 1, fluid: 'kubejs:nitric_acid' }
  }).id('kubejs:rotary/nitric_acid')

  // ── 5) 旋转冷凝器：氨气 ↔ 液态氨（双向）──
  //   与上面硝酸那条不同，这里四个字段全写：rotary 的 JSON「有哪一对就支持哪个方向」，
  //   同时写 gasInput/gasOutput 与 fluidInput/fluidOutput 就得到双向：
  //     冷凝模式  1 mB kubejs:ammonia（气） → 1 mB kubejs:liquid_ammonia
  //     蒸发模式  1 mB kubejs:liquid_ammonia → 1 mB kubejs:ammonia
  //   比例与 Mekanism 自带的 rotary/* 一致（1 mB : 1 mB，无损耗）。
  event.custom({
    type: 'mekanism:rotary',
    gasInput: { amount: 1, gas: 'kubejs:ammonia' },
    gasOutput: { amount: 1, gas: 'kubejs:ammonia' },
    fluidInput: { amount: 1, fluid: 'kubejs:liquid_ammonia' },
    fluidOutput: { amount: 1, fluid: 'kubejs:liquid_ammonia' }
  }).id('kubejs:rotary/ammonia')
})
