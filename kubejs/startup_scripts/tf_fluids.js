// priority: 0
// 从 Thermal Foundation 1.12.2 移植回来的五种元素流体
//
//   飞扬之清风      Zephyrean Aerotheum
//   极寒之凛冰      Gelid Cryotheum
//   板块之层岩      Tectonic Petrotheum
//   烈焰之炽焱      Blazing Pyrotheum
//   元始魔力       Primal Mana
//
// 名称：中英文均取自 1.12.2 官方语言文件，并与 MC 百科 Thermal Foundation
//   词条（mcmod.cn/item/list/425-1.html）逐条核对一致——
//     飞扬之清风 Zephyrean Aerotheum    极寒之凛冰 Gelid Cryotheum
//     板块之层岩 Tectonic Petrotheum    烈焰之炽焱 Blazing Pyrotheum
//     元始魔力   Primal Mana
//   注意英文是「形容词 + 名词」的完整名，不是单独的 Aerotheum / Pyrotheum。
//
// 命名空间：全部注册在 kubejs: 下，不占用 thermal:。
//
// 流体材质：老包 assets/thermalfoundation/textures/blocks/fluid/ 的 <name>_still.png
//   与 <name>_flow.png，连同 .mcmeta 原样复制到
//   kubejs/assets/kubejs/textures/block/，因此方块与流体本身是动态材质
//   （纵向多帧 + interpolate）。
//
// 桶：KubeJS 注册流体时会自动调用 createAdditionalObjects() 造出同名桶物品，
//   其模型固定继承 kubejs:item/generated_bucket（layer0 空桶 + layer1 纯白液体遮罩），
//   液体层只吃 tint 颜色、没有纹理细节，遮罩还是五种流体共用的全局贴图，
//   因此桶内无法还原老版 still 的纹理。
//   这里用 bucketColor() 把液体层染成老版 still 首帧的平均色：
//     aerotheum #ADA77B  cryotheum #22BEFA  petrotheum #2F231D
//     pyrotheum #FEBB2F  mana      #004871
//   色调与老版本流体一致，也与整合包其它桶风格统一。
//
// 属性：亮度/密度/粘度/温度全部取自 1.12.2 TFFluids 的字节码，未做主观调整。
// 生效：重启游戏（startup 脚本无法 /reload）

StartupEvents.registry('fluid', event => {
  // 飞扬之清风  Zephyrean Aerotheum
  event.create('kubejs:aerotheum')
    .stillTexture('kubejs:block/aerotheum_still')
    .flowingTexture('kubejs:block/aerotheum_flow')
    .density(-800)
    .viscosity(100)
    .gaseous()
    .bucketColor(0xADA77B)

  // 极寒之凛冰  Gelid Cryotheum
  event.create('kubejs:cryotheum')
    .stillTexture('kubejs:block/cryotheum_still')
    .flowingTexture('kubejs:block/cryotheum_flow')
    .density(4000)
    .viscosity(4000)
    .temperature(50)
    .bucketColor(0x22BEFA)

  // 板块之层岩  Tectonic Petrotheum
  event.create('kubejs:petrotheum')
    .stillTexture('kubejs:block/petrotheum_still')
    .flowingTexture('kubejs:block/petrotheum_flow')
    .density(4000)
    .viscosity(1500)
    .temperature(350)
    .bucketColor(0x2F231D)

  // 烈焰之炽焱  Blazing Pyrotheum
  event.create('kubejs:pyrotheum')
    .stillTexture('kubejs:block/pyrotheum_still')
    .flowingTexture('kubejs:block/pyrotheum_flow')
    .luminosity(15)
    .density(2000)
    .viscosity(1200)
    .temperature(4000)
    .bucketColor(0xFEBB2F)

  // 元始魔力  Primal Mana
  event.create('kubejs:mana')
    .stillTexture('kubejs:block/mana_still')
    .flowingTexture('kubejs:block/mana_flow')
    .luminosity(15)
    .density(600)
    .viscosity(6000)
    .temperature(350)
    .bucketColor(0x004871)

})
