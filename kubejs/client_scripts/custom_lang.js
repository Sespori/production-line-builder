// priority: 0
// 本整合包自加物品与流体的译名
//
// KubeJS 注册物品/流体时会自动生成 item.<ns>.<path> = "<path>" 的默认名，
// 必须在 ClientEvents.lang 里覆盖才能显示中文，写法与 tf_lang.js 一致。
// 流体同时写 block.* / fluid_type.* / fluid.* 三套键，避免取键路径差异。
// 生效：/reload

ClientEvents.lang('zh_cn', event => {
  event.add('item.kubejs.dust_mana_base', '魔力粉基底')
  event.add('item.kubejs.amethyst_dust', '紫水晶粉')
  event.add('item.kubejs.hot_enderium_ingot', '热末影锭')
  event.add('item.kubejs.hot_signalum_ingot', '热信素锭')
  event.add('item.kubejs.hot_lumium_ingot', '热流明锭')
  event.add('item.kubejs.hot_mithril_ingot', '热蕴魔秘银锭')
  event.add('item.kubejs.hot_netherite_ingot', '热下界合金锭')
  event.add('item.kubejs.hot_allthemodium_ingot', '热ATM锭')
  event.add('item.thermal.ender_pearl_dust', '末影珍珠粉')
  event.add('item.kubejs.resonant_source_gem', '共振魔源宝石')
  event.add('item.kubejs.crude_platinum_dust', '粗铂粉')
  event.add('item.kubejs.crude_iridium_dust', '粗铱粉')
  event.add('item.kubejs.iridium_chloride_dust', '氯化铱粉')
  event.add('item.kubejs.dust_platinum_iridium_osmium', '铂铱锇合金粉')
  event.add('item.kubejs.ingot_platinum_iridium_osmium', '铂铱锇合金锭')
  event.add('item.kubejs.hot_platinum_iridium_osmium_ingot', '热铂铱锇合金锭')
  event.add('item.kubejs.airtight_alloy_billet', '气密合金板坯')
  event.add('item.kubejs.airtight_alloy_plate', '气密合金板')
  event.add('item.kubejs.netherite_scrap_dust', '下界合金碎片粉')
  event.add('item.kubejs.crude_allthemodium_dust', '粗ATM粉')
  event.add('item.kubejs.allthemodium_metal_dust', 'ATM金属粉')
  event.add('item.kubejs.allthemodium_ammonium_dust', '含杂ATM粉')
  event.add('item.kubejs.reprecipitated_allthemodium_dust', '精制ATM粉')

  event.add('block.kubejs.molten_lapis', '熔融青金石')
  event.add('item.kubejs.molten_lapis_bucket', '熔融青金石桶')
  event.add('fluid_type.kubejs.molten_lapis', '熔融青金石')
  event.add('fluid.kubejs.molten_lapis', '熔融青金石')

  event.add('block.kubejs.molten_rosin', '液态松香')
  event.add('item.kubejs.molten_rosin_bucket', '液态松香桶')
  event.add('fluid_type.kubejs.molten_rosin', '液态松香')
  event.add('fluid.kubejs.molten_rosin', '液态松香')

  // 气体（Mekanism 的键是 gas.<ns>.<path>）
  event.add('gas.kubejs.ammonia', '氨气')
  event.add('gas.kubejs.nitrogen_oxide', '氮氧化物')
  event.add('gas.kubejs.nitric_acid', '气态硝酸')

  // 液体硝酸（与气体同名，键不同）
  event.add('block.kubejs.nitric_acid', '硝酸')
  event.add('item.kubejs.nitric_acid_bucket', '硝酸桶')
  event.add('fluid_type.kubejs.nitric_acid', '硝酸')
  event.add('fluid.kubejs.nitric_acid', '硝酸')

  // 液态氨（与氨气同一色调，键不同）
  event.add('block.kubejs.liquid_ammonia', '液态氨')
  event.add('item.kubejs.liquid_ammonia_bucket', '液态氨桶')
  event.add('fluid_type.kubejs.liquid_ammonia', '液态氨')
  event.add('fluid.kubejs.liquid_ammonia', '液态氨')

  // 富ATM氨（化学气体，与氨气同一套键）
  event.add('gas.kubejs.rich_allthemodium_ammonia', '富ATM氨')

  // AllTheOres 自带的 zh_cn.json 漏翻了「铱」这一组（其余 12 种金属都有），
  // 会在物品栏/JEI 里退回英文。这里按同族译法补齐。
  //   dirty_<m>_dust -> 污浊<m>粉   _shard -> 碎片   _crystal -> 晶体   _clump -> 碎块
  event.add('item.alltheores.dirty_iridium_dust', '污浊铱粉')
  event.add('item.alltheores.iridium_shard', '铱碎片')
  event.add('item.alltheores.iridium_crystal', '铱晶体')
  event.add('item.alltheores.iridium_clump', '铱碎块')
  // 同一份文件里连铱的两条浆液也漏了，一并补上
  event.add('slurry.alltheores.dirty_iridium', '污浊铱浆液')
  event.add('slurry.alltheores.clean_iridium', '纯净铱浆液')
})

ClientEvents.lang('en_us', event => {
  event.add('item.kubejs.dust_mana_base', 'Mana Dust Base')
  event.add('item.kubejs.amethyst_dust', 'Amethyst Dust')
  event.add('item.kubejs.hot_enderium_ingot', 'Hot Enderium Ingot')
  event.add('item.kubejs.hot_signalum_ingot', 'Hot Signalum Ingot')
  event.add('item.kubejs.hot_lumium_ingot', 'Hot Lumium Ingot')
  event.add('item.kubejs.hot_mithril_ingot', 'Hot Mithril Ingot')
  event.add('item.kubejs.hot_netherite_ingot', 'Hot Netherite Ingot')
  event.add('item.kubejs.hot_allthemodium_ingot', 'Hot Allthemodium Ingot')
  event.add('item.thermal.ender_pearl_dust', 'Ender Pearl Dust')
  event.add('item.kubejs.resonant_source_gem', 'Resonant Source Gem')
  event.add('item.kubejs.crude_platinum_dust', 'Crude Platinum Dust')
  event.add('item.kubejs.crude_iridium_dust', 'Crude Iridium Dust')
  event.add('item.kubejs.iridium_chloride_dust', 'Iridium Chloride Dust')
  event.add('item.kubejs.dust_platinum_iridium_osmium', 'Platinum-Iridium-Osmium Alloy Dust')
  event.add('item.kubejs.ingot_platinum_iridium_osmium', 'Platinum-Iridium-Osmium Alloy Ingot')
  event.add('item.kubejs.hot_platinum_iridium_osmium_ingot', 'Hot Platinum-Iridium-Osmium Alloy Ingot')
  event.add('item.kubejs.airtight_alloy_billet', 'Airtight Alloy Billet')
  event.add('item.kubejs.airtight_alloy_plate', 'Airtight Alloy Plate')
  event.add('item.kubejs.netherite_scrap_dust', 'Netherite Scrap Dust')
  event.add('item.kubejs.crude_allthemodium_dust', 'Crude Allthemodium Dust')
  event.add('item.kubejs.allthemodium_metal_dust', 'Allthemodium Metal Dust')
  event.add('item.kubejs.allthemodium_ammonium_dust', 'Impure Allthemodium Dust')
  event.add('item.kubejs.reprecipitated_allthemodium_dust', 'Refined Allthemodium Dust')

  event.add('block.kubejs.molten_lapis', 'Molten Lapis Lazuli')
  event.add('item.kubejs.molten_lapis_bucket', 'Molten Lapis Lazuli Bucket')
  event.add('fluid_type.kubejs.molten_lapis', 'Molten Lapis Lazuli')
  event.add('fluid.kubejs.molten_lapis', 'Molten Lapis Lazuli')

  event.add('block.kubejs.molten_rosin', 'Molten Rosin')
  event.add('item.kubejs.molten_rosin_bucket', 'Molten Rosin Bucket')
  event.add('fluid_type.kubejs.molten_rosin', 'Molten Rosin')
  event.add('fluid.kubejs.molten_rosin', 'Molten Rosin')

  event.add('block.kubejs.nitric_acid', 'Nitric Acid')
  event.add('item.kubejs.nitric_acid_bucket', 'Nitric Acid Bucket')
  event.add('fluid_type.kubejs.nitric_acid', 'Nitric Acid')
  event.add('fluid.kubejs.nitric_acid', 'Nitric Acid')

  event.add('block.kubejs.liquid_ammonia', 'Liquid Ammonia')
  event.add('item.kubejs.liquid_ammonia_bucket', 'Liquid Ammonia Bucket')
  event.add('fluid_type.kubejs.liquid_ammonia', 'Liquid Ammonia')
  event.add('fluid.kubejs.liquid_ammonia', 'Liquid Ammonia')

  event.add('gas.kubejs.rich_allthemodium_ammonia', 'Rich Allthemodium Ammonia')
})
