import { activeEffect, trackEffect, triggerEffects } from "./effect"

const targetMap = new WeakMap() // 存放effect函数和对应的target


export const createDep = (cleanup,key) =>{
  const dep = new Map() as any // 自定义的Map类型，用来存放effect函数
  dep.cleanup = cleanup
  dep.name = key // 自定义的为了表示这个映射表是给哪个属性服务的
  return dep
}

export const track= (target,key) => {
  // activeEffect 有这个属性，说明当前正在执行 effect 函数，这个key是在effect函数中访问的
  if(activeEffect){
    // console.log(key,activeEffect)

    let despMap = targetMap.get(target) 
    if(!despMap){
      targetMap.set(target,(despMap = new Map()))
    } // 说明target没有对应的effect函数，需要初始化  ---新增
    let dep = despMap.get(key)
    if(!dep){
      despMap.set(
        key,
        dep=createDep(()=>despMap.delete(key),key)
        // 新增一个dep，并传入一个清理函数，清理函数在dep被删除时执行
      )
    } 
    trackEffect(activeEffect,dep) // 将当前的effect放入到dep(映射表)中，后续可以根据值的变化触发此dep中存放的effect函数
    console.log(targetMap)
  }
}

export const trigger= (target,key,newValue,oldValue) => {
  const despMap = targetMap.get(target)
  if(!despMap) return // 说明target没有对应的effect函数，不需要触发 直接return
  let dep = despMap.get(key)
  if(dep){ // 说明有对应的effect函数，需要触发
    triggerEffects(dep)
  }
}