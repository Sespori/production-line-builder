// priority: 100
// 把 Thermal Expansion 机器外壳里的玻璃换成 Mekanism 透明塑料（任意颜色）
// 原配方中玻璃都写作 "Y": { "tag": "forge:glass" }，每台机器 2 个
// 生效：/reload

ServerEvents.recipes(event => {
  const machines = [
    'thermal:machine_bottler',
    'thermal:machine_brewer',
    'thermal:machine_chiller',
    'thermal:machine_crucible',
    'thermal:machine_insolator',
    'thermal:machine_refinery'
  ]

  machines.forEach(id => {
    event.replaceInput(
      { id: id },
      '#forge:glass',
      '#mekanismadditions:plastic_blocks/transparent'
    )
  })
})
