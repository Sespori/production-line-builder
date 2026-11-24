// priority: 0
// 从 Thermal Foundation 1.12.2（2.6.7.1）移植回来的材料物品
//
// 背景：1.20.1 版 Thermal Foundation 大幅精简，下列 16 种材料物品已不存在于
//   当前整合包（已核对 30 个模组与原版）。本脚本只注册物品本身，不迁移合成配方。
//
// 命名空间：全部注册在 kubejs: 下（不占用 thermal:，避免与模组自身物品 ID 冲突，
//   也便于一眼看出是整合包自加内容）。
//
// 已排除（中文译名与现有物品一致，视为同一物品，不重复注册）：
//   thermal:crystal_cinnabar
//   thermal:crystal_crude_oil
//   thermal:crystal_slag
//   thermal:crystal_slag_rich
//   thermal:dust_basalz
//   thermal:dust_bioblend
//   thermal:dust_bioblend_rich
//   thermal:dust_biomass
//   thermal:dust_biomass_rich
//   thermal:dust_blitz
//   thermal:dust_blizz
//   thermal:dust_charcoal
//   thermal:dust_coal
//   thermal:dust_niter
//   thermal:dust_obsidian
//   thermal:dust_sulfur
//   thermal:dust_wood
//   thermal:dust_wood_compressed
//   thermal:fuel_coke
//   thermal:gear_emerald
//   thermal:gear_stone
//   thermal:gear_wood
//   thermal:glob_rosin
//   thermal:glob_tar
//   thermal:nugget_diamond
//   thermal:nugget_emerald
//   thermal:part_drill_head
//   thermal:part_saw_blade
//   thermal:part_tool_casing
//   thermal:power_coil_gold
//   thermal:rod_basalz
//   thermal:rod_blitz
//   thermal:rod_blizz
//
// 命名说明：1.12.2 使用 metadata 体系（thermalfoundation:material + meta），
//   不存在现代意义上的独立物品 ID，因此按「老名称驼峰转下划线」注册为
//   kubejs:<snake_case>，纹理文件名与老版本 resources 中的名称一一对应。
//
// 纹理：由 kubejs/assets/kubejs/textures/item/ 提供。其中 8 项是动态材质
//   （纵向多帧 PNG + .mcmeta），已连同 .mcmeta 原样保留，游戏内正常播放动画。
// 堆叠上限：老版本 ItemMaterial 统一为 64，此处保持一致。
// 显示名：kubejs/client_scripts/tf_lang.js（ClientEvents.lang）。
// 生效：重启游戏（startup 脚本无法 /reload）

StartupEvents.registry('item', event => {
  event.create('kubejs:crystal_ender').maxStackSize(64)   // 谐振末影络合物   // 动态材质，保留动画
  event.create('kubejs:crystal_glowstone').maxStackSize(64)   // 充能络合物   // 动态材质，保留动画
  event.create('kubejs:crystal_redstone').maxStackSize(64)   // 不稳红石络合物   // 动态材质，保留动画
  event.create('kubejs:dust_aerotheum').maxStackSize(64)   // 清风粉   // 动态材质，保留动画
  event.create('kubejs:dust_cryotheum').maxStackSize(64)   // 凛冰粉   // 动态材质，保留动画
  event.create('kubejs:dust_mana').maxStackSize(64)   // 魔力粉   // 动态材质，保留动画
  event.create('kubejs:dust_mithril').maxStackSize(64)   // 蕴魔秘银粉
  event.create('kubejs:dust_petrotheum').maxStackSize(64)   // 地岩粉   // 动态材质，保留动画
  event.create('kubejs:dust_pyrotheum').maxStackSize(64)   // 炽焱粉   // 动态材质，保留动画
  event.create('kubejs:gear_mithril').maxStackSize(64)   // 蕴魔秘银齿轮
  event.create('kubejs:ingot_mithril').maxStackSize(64)   // 蕴魔秘银锭
  event.create('kubejs:nugget_mithril').maxStackSize(64)   // 蕴魔秘银粒
  event.create('kubejs:plate_mithril').maxStackSize(64)   // 蕴魔秘银板
  event.create('kubejs:power_coil_electrum').maxStackSize(64)   // 红石传导线圈
  event.create('kubejs:power_coil_silver').maxStackSize(64)   // 红石传输线圈
  event.create('kubejs:redstone_servo').maxStackSize(64)   // 红石伺服器
})
