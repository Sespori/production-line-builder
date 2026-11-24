// priority: 0
// 本整合包自己加的物品（不属于 Thermal 1.12.2 移植范围）
//
// 1) 魔力粉基底 kubejs:dust_mana_base
//   材质取自移植回来的魔力粉（kubejs:dust_mana），只取静态部分——
//   魔力粉是 16×176 的 11 帧纵向动画，这里裁出第 1 帧做成 16×16 静态图，
//   所以基底本身不会流动/闪烁，用来区分“原料”和“成品”。
//   贴图：kubejs/assets/kubejs/textures/item/dust_mana_base.png
//
// 2) 紫水晶粉 kubejs:amethyst_dust
//   沿用 Thermal 的命名法（iron_dust / tin_dust：材质在前、dust 在后）。
//   贴图由 Thermal 的蓝宝石粉（sapphire_dust）重映射亮度到紫水晶色阶得到，
//   与其它粉保持同一套像素结构。
//   贴图：kubejs/assets/kubejs/textures/item/amethyst_dust.png
//
// 3) 热锭四件套：kubejs:hot_enderium_ingot / hot_signalum_ingot / hot_lumium_ingot
//    / hot_mithril_ingot（热蕴魔秘银锭）
//   刚出炉、尚未冷却的合金锭，是「合金粉 → 普通锭」之间的中间产物。
//   贴图取对应锭的原图，把亮度重映射到炽热色阶（焦红 → 橙 → 黄白），
//   像素形状不变，所以一眼能看出是哪块锭烧红了。
//   具体做法：先对原图不透明像素的亮度做 min-max 归一化，再取 t**0.62 提亮，
//   然后按 8 段量化到同一套色板（与三块热合金锭完全共用）：
//     0x66140C / 0xD46A26 / 0xFF9239 / 0xFFB16B /
//     0xFFD5A6 / 0xFFE9C7 / 0xFFF5DA / 0xFFFEE8
//   秘银锭的原图（kubejs:ingot_mithril）是 1.12 移植过来的多色阶贴图，
//   量化后同样落到这 8 色上，与热末影 / 热信素 / 热流明一眼同源。
//   贴图：kubejs/assets/kubejs/textures/item/hot_<metal>_ingot.png
//
// 4) 共振魔源宝石 kubejs:resonant_source_gem
//    Ars Nouveau 的魔源宝石（ars_nouveau:source_gem）经七种精华灌注后的"高浓度"形态，
//    粉碎回 9 个魔力粉基底，用来把 Ars 的魔源体系接到 Thermal 的魔力粉线上。
//   贴图：直接复用 Ars 的 source_gem 原图（16×16），
//        附魔光效由 ItemBuilder.glow(true) 提供 —— KubeJS 的 ItemMixin 重写了 Item#isFoil
//        去读 ItemBuilder.glow 字段，所以和原版附魔物品是同一套光效，不需要额外贴图。
//   贴图：kubejs/assets/kubejs/textures/item/resonant_source_gem.png
//
// 5) 粗铂粉 kubejs:crude_platinum_dust
//   铂矿 / 粗铂 / 粗铂块直接加工出来的未提纯粉，与精制铂粉（alltheores:platinum_dust）区分。
//   只有「铂锭粉碎」「脏铂粉富集」两条路线仍直接产出精制铂粉，
//   其余原本产铂粉的配方（富集仓、粉碎机、锤子）产物统一改成它。
//   贴图：按 GTCEu 粗铂（gtceu:platinum_raw_dust）的材质复现 ——
//        GT 用 METALLIC 材质集的两层灰度图 + 材料色 tint 实时上色，
//        这里取 metallic/dust.png × 0xA09A7B 叠加 metallic/dust_secondary.png × 0x4E4E45
//        （两个色值取自 GTMaterials 里 PlatinumRaw 的 color / secondaryColor）离线合成好。
//   贴图：kubejs/assets/kubejs/textures/item/crude_platinum_dust.png
//
// 译名：kubejs/client_scripts/custom_lang.js
// 生效：重启游戏（startup 脚本无法 /reload）

StartupEvents.registry('item', event => {
  event.create('kubejs:dust_mana_base').maxStackSize(64)
  event.create('kubejs:amethyst_dust').maxStackSize(64)

  event.create('kubejs:hot_enderium_ingot').maxStackSize(64)
  event.create('kubejs:hot_signalum_ingot').maxStackSize(64)
  event.create('kubejs:hot_lumium_ingot').maxStackSize(64)

  // 热蕴魔秘银锭：秘银粉 + 炽焱粉 + 魔力粉 在感应炉里烧出的中间产物，
  // 再进致冷器冷却成 kubejs:ingot_mithril（见 server_scripts/hot_ingots.js）
  event.create('kubejs:hot_mithril_ingot').maxStackSize(64)

  // 热下界合金锭：下界合金粉 + 炽焱粉 + 萤石粉 在感应炉里烧出的中间产物，
  // 再进致冷器冷却成 minecraft:netherite_ingot（见 server_scripts/hot_ingots.js）
  event.create('kubejs:hot_netherite_ingot').maxStackSize(64)

  // 热ATM锭：炽焱粉 + ATM粉 在感应炉里烧出的中间产物（24000 RF），
  // 再进致冷器冷却成 allthemodium:allthemodium_ingot（见 server_scripts/hot_ingots.js）
  // 贴图：由 allthemodium:allthemodium_ingot 的 16×16 原图按热锭色板转换
  //   （8 档灼热色，亮度 min-max 归一 → t^0.9 → 量化 8 段），形状逐像素保留
  event.create('kubejs:hot_allthemodium_ingot').maxStackSize(64)

  // 共振魔源宝石：带原版附魔光效（glow -> Item#isFoil）
  event.create('kubejs:resonant_source_gem').maxStackSize(64).glow(true)

  // 粗铂粉：铂矿直接加工的未提纯粉
  event.create('kubejs:crude_platinum_dust').maxStackSize(64)

  // 粗铱粉 / 氯化铱粉：铱产线的两级中间产物
  //   铱矿 / 粗铱 ->（富集、锤子、熔炼）粗铱粉 ->（PRC：氯化氢 + 水）氯化铱粉
  //   ->（PRC：水 + 氢气）alltheores:iridium_dust
  //   贴图取自 GTCEu 的 iridium_metal_residue / iridium_chloride（同款 dust 模板 + 颜色）
  event.create('kubejs:crude_iridium_dust').maxStackSize(64)
  event.create('kubejs:iridium_chloride_dust').maxStackSize(64)

  // 铂铱锇合金三件套（Pt-Ir-Os）
  //   粉：工作台 铂粉 + 铱粉 + 锇粉 合成
  //   热锭：感应炉 炽焱粉 + 合金粉 + 萤石粉，20000 RF
  //   锭：致冷器冷却热锭（10000 / 1000 RF），见 server_scripts/platinum_iridium_osmium_alloy.js
  //   贴图：锭 / 粉参考 GTCEu 的 osmiridium（铱锇合金，套用同款 dust/ingot 模板 + 该材料色），
  //         热锭由上一步的锭贴图按热锭色板转换（gamma 0.9，原锭偏亮，与热下界合金同档）
  event.create('kubejs:dust_platinum_iridium_osmium').maxStackSize(64)
  event.create('kubejs:ingot_platinum_iridium_osmium').maxStackSize(64)
  event.create('kubejs:hot_platinum_iridium_osmium_ingot').maxStackSize(64)

  // 气密合金（Airtight Alloy）
  //   板坯：锭形轮廓，上 / 中 / 下三段分别取压缩铁锭、粉红史莱姆锭、压缩铁锭的颜色
  //   板：参考 GTCEu 的 battery_alloy（电池合金）板
  //   配方见 server_scripts/airtight_alloy_recipes.js
  event.create('kubejs:airtight_alloy_billet').maxStackSize(64)
  event.create('kubejs:airtight_alloy_plate').maxStackSize(64)

  // 下界合金碎片粉：加压反应室用氯化氢 + 硝酸处理 mekanism:dirty_netherite_scrap 得到，
  // 再与金粉合成 alltheores:netherite_dust（见 server_scripts/netherite_dust_recipes.js）。
  // 贴图：直接用原版 minecraft:netherite_scrap 的 16×16 图（assets/kubejs/textures/item/netherite_scrap_dust.png）
  event.create('kubejs:netherite_scrap_dust').maxStackSize(64)

  // ATM（allthemodium）加工链的四种粉（配方见 server_scripts/allthemodium_chain.js）
  //   贴图全部以 allthemodium:allthemodium_dust 的 16×16 原图为底，逐像素改色：
  //     粗ATM粉       较深 + 加黑（×0.68，再与 (10,8,6) 混 35%）
  //     ATM金属粉     较浅 + 加黑（提亮 30%，再与黑混 18%）
  //     含杂ATM粉     较深 + 加灰（×0.62，再与 (150,150,150) 混 50%）
  //     精制ATM粉     较浅 + 加灰（提亮 22%，再与灰混 55%）
  //   形状与原图逐像素一致，只换色阶。
  //   ID 说明：后两个保留了最初注册时的 ammonium / reprecipitated 命名，只改了显示名。
  event.create('kubejs:crude_allthemodium_dust').maxStackSize(64)
  event.create('kubejs:allthemodium_metal_dust').maxStackSize(64)
  event.create('kubejs:allthemodium_ammonium_dust').maxStackSize(64)
  event.create('kubejs:reprecipitated_allthemodium_dust').maxStackSize(64)
})
