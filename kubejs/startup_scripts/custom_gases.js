// priority: 0
// Mekanism 气体（注册表 mekanism:gas）：氨气、氮氧化物、气体硝酸、富ATM氨
//
// ── 为什么用 createCustom ──
// KubeJS 只内置了 item / block / fluid 等原版注册表的 builder 类型，没有 mekanism:gas
// 的 BuilderType。但 StartupEvents.registry('mekanism:gas') 仍然是可用的：
//   · 事件侧：EventHandler 会把字符串解析成 ResourceKey（mekanism:gas），
//     RegistryInfo.of() 按需新建一个 RegistryInfo（MAP 里按 key 缓存）；
//   · 注册侧：KubeJSForge.initRegistries 在 Forge 的 RegisterEvent 里
//     用同一个 RegistryInfo.of(event.getRegistryKey()) 拿回同一个实例，
//     再把它收集到的对象注册进去。
// 所以只要给 createCustom 一个「返回 Gas 实例」的 supplier 就能注册，不需要 BuilderType。
//
// ── 材质 ──
// 三个气体的贴图都取自 GTCEu 1.20.1-7.5.3（参考文件/gtceu-1.20.1-7.5.3.jar）：
//   氨气 / 氮氧化物：block/material_sets/dull/gas.png，GT 的气体底图是纯白 + alpha170 的
//     方块，颜色完全靠 tint。这里原样搬过来，tint 用 GTMaterials 里对应 material 的
//     color() 立即数：Ammonia 0x4465A2、NitrogenDioxide 0x85FCFF。
//   气体硝酸：取 block/material_sets/dull/liquid.png 的第一帧（GT 硝酸的液体底图），
//     tint 用 nitric_acid 的 0xCCCC00 向白色淡化 35% → 0xDDDD59。
// 贴图文件：kubejs/assets/kubejs/textures/gas/*.png
//
// ── 为什么要额外写一份 blocks 图集定义 ──
// Mekanism 的 Chemical#getIcon() 只是一个 ResourceLocation，渲染时由
// MekanismRenderer.getSprite() 去 minecraft:textures/atlas/blocks.png 里 apply，
// 拿不到就退回紫黑缺失贴图。而 blocks 图集只会收录「被 atlas 定义列出」或
// 「被某个模型引用」的贴图 —— 气体图标两样都不是，所以必须显式声明。
//
// KubeJS 虽然有个 ClientEvents.atlasSpriteRegistry 事件，但 2001.6.5-build.26 里
// 它是个空壳：EventHandler 只有 listenJava，整个 jar 中没有任何 post 调用点，
// 注册过的 handler 永远不会执行（所以之前那版 custom_atlas.js 写了也没用）。
//
// 正确做法：自己提供一份 assets/minecraft/atlases/blocks.json。
// SpriteResourceLoader.load() 读这个文件用的是 ResourceManager#getResourceStack，
// 会取到所有资源包里的同名文件并依次 addAll —— 也就是说它是「多包合并」的，
// 我们只写自己这几条不会覆盖 Mekanism / IntegratedDynamics 的同名文件。
// 见 kubejs/assets/minecraft/atlases/blocks.json。
//
// 生效：重启游戏（startup 脚本无法 /reload）

const $Gas = Java.loadClass('mekanism.api.chemical.gas.Gas')
const $GasBuilder = Java.loadClass('mekanism.api.chemical.gas.GasBuilder')
const $ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')

// id 由注册器决定，这里只负责「贴图 + 颜色」
function kjsGas(texturePath, tint) {
  return new $Gas($GasBuilder.builder(new $ResourceLocation('kubejs', texturePath)).tint(tint))
}

StartupEvents.registry('mekanism:gas', event => {
  // 氨气 NH3
  event.createCustom('kubejs:ammonia', () => kjsGas('gas/ammonia', 0x4465A2))

  // 氮氧化物（材质取 GT 的二氧化氮）
  event.createCustom('kubejs:nitrogen_oxide', () => kjsGas('gas/nitrogen_oxide', 0x85FCFF))

  // 气体硝酸（与流体 kubejs:nitric_acid 同名，不同注册表，互不冲突）
  event.createCustom('kubejs:nitric_acid', () => kjsGas('gas/nitric_acid', 0xDDDD59))

  // 富ATM氨（ATM 湿法冶金的中段化学品，氨浸出后的富液以气体形式表示）
  //   颜色取 allthemodium_dust 的主导色 (255,199,12) 与灰 (150,150,150) 混 30% → 0xE0B835
  //   底图与氨气同一张 GT gas 模板（gas/rich_allthemodium_ammonia 是 ammonia.png 的副本）
  event.createCustom('kubejs:rich_allthemodium_ammonia',
    () => kjsGas('gas/rich_allthemodium_ammonia', 0xE0B835))
})
