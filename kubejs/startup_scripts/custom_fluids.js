// priority: 0
// 本整合包自加的流体
//
// 熔融青金石 kubejs:molten_lapis
//   做法参考 Thermal 的「不稳红石」（thermal:redstone）：
//   熔岩炉里 1 个青金石 → 100 mB，8000 RF（配方在 server_scripts/custom_recipes.js）。
//   材质由老版 Thermal Foundation 的红石流体贴图 recolor 而来，保持同一套动画：
//     still 16×512（32 帧）、flow 32×1024（32 帧），.mcmeta 原样沿用
//   色阶：暗 #0E184E → 中 #2E54CD → 亮 #96B9FF，按原图亮度重新映射
//   贴图：kubejs/assets/kubejs/textures/block/molten_lapis_{still,flow}.png(.mcmeta)
//   译名：kubejs/client_scripts/custom_lang.js
//
// 液态松香 kubejs:molten_rosin
//   熔岩炉里 1 个 thermal:rosin（松香）→ 250 mB，2000 RF（配方在 custom_recipes.js）。
//   是 Industrial Foregoing 塑料的新原料：250 mB 液态松香 + 100 mB 乙烯 + 1 基片
//   → 1 个塑料 + 100 mB 氢气（加压反应室，见 mekanism_custom_recipes.js）。
//   材质直接取熔融青金石的整套动画帧做色阶重映射，保持 16×512 / 32×1024、.mcmeta 原样：
//     色阶：暗 #5A3208 → 中 #C8801F → 亮 #FFD98A（松香的琥珀色）
//   贴图：kubejs/assets/kubejs/textures/block/molten_rosin_{still,flow}.png(.mcmeta)
//   译名：kubejs/client_scripts/custom_lang.js
//
// 硝酸 kubejs:nitric_acid
//   气体的硝酸见 startup_scripts/custom_gases.js（同名不同注册表）。
//   这里注册的是冷凝后的液体：旋转冷凝器里 1 mB 气体硝酸 → 1 mB 液体硝酸
//   （配方在 server_scripts/mekanism_custom_recipes.js）。
//   材质取 GTCEu 的 block/material_sets/dull/liquid.png（16×320、20 帧，.mcmeta 原样沿用），
//   乘上 GT 硝酸的颜色 0xCCCC00；flow 由每帧 2×2 拼成 32×640，与 still 共用同一张 .mcmeta。
//   贴图：kubejs/assets/kubejs/textures/block/nitric_acid_{still,flow}.png(.mcmeta)
// 生效：重启游戏（startup 脚本无法 /reload）

StartupEvents.registry('fluid', event => {
  event.create('kubejs:molten_lapis')
    .stillTexture('kubejs:block/molten_lapis_still')
    .flowingTexture('kubejs:block/molten_lapis_flow')
    .luminosity(7)
    .density(2000)
    .viscosity(1500)
    .temperature(300)
    .bucketColor(0x18296C)

  event.create('kubejs:molten_rosin')
    .stillTexture('kubejs:block/molten_rosin_still')
    .flowingTexture('kubejs:block/molten_rosin_flow')
    .luminosity(3)
    .density(1200)
    .viscosity(2500)
    .temperature(320)
    .bucketColor(0xC8801F)

  // 硝酸（液体）
  event.create('kubejs:nitric_acid')
    .stillTexture('kubejs:block/nitric_acid_still')
    .flowingTexture('kubejs:block/nitric_acid_flow')
    .density(1500)
    .viscosity(1000)
    .temperature(293)
    .bucketColor(0xCCCC00)

  // 液态氨 kubejs:liquid_ammonia
  //   与氨气（custom_gases.js 里的 kubejs:ammonia，tint 0x4465A2）同一色调，
  //   这里直接用同一个颜色 0x4465A2（GT Ammonia 的 material color）。
  //   材质与硝酸同一套做法：取 GTCEu 的 block/material_sets/dull/liquid.png
  //   （16×320、20 帧），逐像素乘 0x4465A2；flow 由每帧 2×2 拼成 32×640，
  //   共用同一张 .mcmeta。已用 0xCCCC00 复现过硝酸贴图，5120/5120 像素完全一致。
  //   用途：液态氯桶 + 液态氨桶 在压力室里制蚀刻酸桶
  //         （见 server_scripts/pneumaticcraft_etching_acid.js）。
  event.create('kubejs:liquid_ammonia')
    .stillTexture('kubejs:block/liquid_ammonia_still')
    .flowingTexture('kubejs:block/liquid_ammonia_flow')
    .density(680)
    .viscosity(400)
    .temperature(240)
    .bucketColor(0x4465A2)
})
