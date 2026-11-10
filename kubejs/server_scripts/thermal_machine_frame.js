// priority: 100
// 改造 thermal:machine_frame 的工作台配方
// 环境：MC 1.20.1 / Forge / KubeJS 6.x
// 生效：游戏内执行 /reload（server_scripts 不需要重启游戏）

ServerEvents.recipes(event => {
  // 1) 让原配方失效
  //    原配方文件：data/thermal/recipes/machine_frame.json，ID 为 thermal:machine_frame
  //    形状：IGI / GTG / IGI —— 4x 铁锭(tag)、4x 玻璃(tag)、1x 锡齿轮(tag)
  event.remove({ id: 'thermal:machine_frame' })
  // 兜底：若其他数据包用别的 ID 重新注册了同名工作台配方，一并清除
  // （限定 crafting_shaped，避免误删格雷等其他机器产出的 machine_frame）
  event.remove({ output: 'thermal:machine_frame', type: 'minecraft:crafting_shaped' })

  // 2) 用 Mekanism 材料按原形状重建
  event.shaped('thermal:machine_frame', [
    'IGI',
    'GAG',
    'IGI'
  ], {
    I: 'mekanism:alloy_infused',                      // 灌注合金（替换铁锭）
    G: '#mekanismadditions:plastic_blocks/transparent', // 任意颜色透明塑料块（替换玻璃）
    A: 'mekanism:advanced_control_circuit'            // 高级控制电路（替换锡齿轮）
  }).id('kubejs:thermal_machine_frame')
})
