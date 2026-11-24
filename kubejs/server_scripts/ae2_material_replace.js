// priority: 70
// Applied Energistics 2（含 ExtendedAE）合成配方的材料替换
//
//   铁   -> alltheores:steel_ingot          钢锭
//   铜   -> mekanism:alloy_infused          灌注合金
//   红石 -> mekanism:enriched_redstone      富集红石
//
// 覆盖范围：
//   - 直接写 minecraft:iron_ingot / copper_ingot / redstone 的配方
//   - 通过通用标签引用的配方（forge:ingots/iron、forge:ingots/copper、
//     forge:dusts/redstone），一并换成上面三种具体物品
//
// 未处理：
//   - minecraft:iron_block / redstone_torch / redstone_lamp 等衍生品
//   - forge:nuggets/iron、forge:nuggets/copper（粒，不是锭）
//   - 三条处理器刻印配方 ae2:inscriber/{logic,calculation,engineering}_processor：
//     红石此前已按要求换成 mekanism:advanced_control_circuit，由
//     ae2_inscriber_processors.js 维护，本脚本跳过，不覆盖
//
// 写法：工作台配方用 replaceInput 逐条精确替换（ID、group、产出均不变）；
//       ae2:transform 是自定义序列化器，replaceInput 改不到，改由 remove + event.custom 重建。
// 生效：/reload

ServerEvents.recipes(event => {

  // ========== 铁 -> 钢锭 ==========
  // minecraft:iron_ingot（1 条）
  event.replaceInput({ id: 'ae2:decorative/quartz_fixture' }, 'minecraft:iron_ingot', 'alltheores:steel_ingot')
  // #forge:ingots/iron（54 条）
  event.replaceInput({ id: 'ae2:materials/advancedcard' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:materials/basiccard' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/blocks/cell_workbench' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/blocks/crystal_processing_charger' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/blocks/crystal_processing_growth_accelerator' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/blocks/energy_energy_acceptor' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/blocks/energy_vibration_chamber' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/blocks/inscribers' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/blocks/interfaces_interface' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/blocks/io_condenser' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/blocks/io_port' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/blocks/pattern_providers_interface' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/blocks/quantum_ring' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/blocks/spatial_anchor' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/blocks/spatial_io_port' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/blocks/storage_chest' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/blocks/storage_drive' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/cells/item_cell_housing' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/cells/item_storage_cell_16k' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/cells/item_storage_cell_1k' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/cells/item_storage_cell_256k' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/cells/item_storage_cell_4k' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/cells/item_storage_cell_64k' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/cells/spatial_storage_cell_128_cubed' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/cells/spatial_storage_cell_16_cubed' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/cells/spatial_storage_cell_2_cubed' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/cells/view_cell' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/crafting/cpu_crafting_unit' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/crafting/molecular_assembler' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/crafting/patterns_blank' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/crystal_resonance_generator' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/parts/annihilation_plane_alt' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/parts/annihilation_plane_alt2' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/parts/export_bus' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/parts/formation_plane' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/parts/formation_plane_alt' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/parts/import_bus' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/parts/panels_semi_dark_monitor' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/parts/tunnels_me' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/wireless_booster' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:network/wireless_part' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:tools/certus_quartz_cutting_knife' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:tools/matter_cannon' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:tools/misctools_charged_staff' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:tools/misctools_entropy_manipulator' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:tools/nether_quartz_cutting_knife' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:tools/network_color_applicator' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'ae2:tools/network_memory_card' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'expatternprovider:assembler_matrix_frame' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'expatternprovider:circuit_cutter' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'expatternprovider:crystal_fixer' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'expatternprovider:ingredient_buffer' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'expatternprovider:tape' }, '#forge:ingots/iron', 'alltheores:steel_ingot')
  event.replaceInput({ id: 'expatternprovider:wireless_tool' }, '#forge:ingots/iron', 'alltheores:steel_ingot')

  // ========== 铜 -> 灌注合金 ==========
  // #forge:ingots/copper（13 条）
  event.replaceInput({ id: 'ae2:network/blocks/crank' }, '#forge:ingots/copper', 'mekanism:alloy_infused')
  event.replaceInput({ id: 'ae2:network/blocks/crystal_processing_charger' }, '#forge:ingots/copper', 'mekanism:alloy_infused')
  event.replaceInput({ id: 'ae2:network/blocks/energy_energy_acceptor' }, '#forge:ingots/copper', 'mekanism:alloy_infused')
  event.replaceInput({ id: 'ae2:network/blocks/energy_vibration_chamber' }, '#forge:ingots/copper', 'mekanism:alloy_infused')
  event.replaceInput({ id: 'ae2:network/blocks/inscribers' }, '#forge:ingots/copper', 'mekanism:alloy_infused')
  event.replaceInput({ id: 'ae2:network/blocks/storage_chest' }, '#forge:ingots/copper', 'mekanism:alloy_infused')
  event.replaceInput({ id: 'ae2:network/cells/fluid_cell_housing' }, '#forge:ingots/copper', 'mekanism:alloy_infused')
  event.replaceInput({ id: 'ae2:network/cells/fluid_storage_cell_16k' }, '#forge:ingots/copper', 'mekanism:alloy_infused')
  event.replaceInput({ id: 'ae2:network/cells/fluid_storage_cell_1k' }, '#forge:ingots/copper', 'mekanism:alloy_infused')
  event.replaceInput({ id: 'ae2:network/cells/fluid_storage_cell_256k' }, '#forge:ingots/copper', 'mekanism:alloy_infused')
  event.replaceInput({ id: 'ae2:network/cells/fluid_storage_cell_4k' }, '#forge:ingots/copper', 'mekanism:alloy_infused')
  event.replaceInput({ id: 'ae2:network/cells/fluid_storage_cell_64k' }, '#forge:ingots/copper', 'mekanism:alloy_infused')
  event.replaceInput({ id: 'ae2:network/crystal_resonance_generator' }, '#forge:ingots/copper', 'mekanism:alloy_infused')

  // ========== 红石 -> 富集红石 ==========
  // #forge:dusts/redstone（29 条）
  event.replaceInput({ id: 'ae2:materials/advancedcard' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:materials/basiccard' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cables/dense_smart_fluix' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cables/smart_fluix' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/fluid_cell_housing' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/fluid_storage_cell_16k' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/fluid_storage_cell_1k' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/fluid_storage_cell_256k' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/fluid_storage_cell_4k' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/fluid_storage_cell_64k' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/item_cell_housing' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/item_storage_cell_16k' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/item_storage_cell_1k' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/item_storage_cell_256k' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/item_storage_cell_4k' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/item_storage_cell_64k' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/item_storage_components_cell_1k_part' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/item_storage_components_cell_4k_part' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/spatial_storage_cell_128_cubed' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/spatial_storage_cell_16_cubed' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/spatial_storage_cell_2_cubed' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/cells/view_cell' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/parts/panels_semi_dark_monitor' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:network/parts/toggle_bus' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'ae2:tools/network_memory_card' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'expatternprovider:mod_export_bus' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'expatternprovider:mod_storage_bus' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'expatternprovider:tag_export_bus' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')
  event.replaceInput({ id: 'expatternprovider:tag_storage_bus' }, '#forge:dusts/redstone', 'mekanism:enriched_redstone')

  // ========== 自定义配方类型（整条重建） ==========
  event.remove({ id: 'ae2:transform/fluix_crystals' })
  event.custom({"type":"ae2:transform","circumstance":{"type":"fluid","tag":"minecraft:water"},"ingredients":[{"item":"ae2:charged_certus_quartz_crystal"},{"item":"mekanism:enriched_redstone"},{"item":"minecraft:quartz"}],"result":{"count":2,"item":"ae2:fluix_crystal"}}).id('ae2:transform/fluix_crystals')
})
