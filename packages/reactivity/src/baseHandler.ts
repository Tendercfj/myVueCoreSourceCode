import { activeEffect } from "./effect"
import { track, trigger } from "./reactiveEffect"

// 用于标记响应式对象
export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive"
}
// Proxy 需要搭配 Reflect 使用
export const mutableHandles:ProxyHandler<any> = {
  get(target,key,receiver){ // receiver 就是 proxy 代理对象
    if(key === ReactiveFlags.IS_REACTIVE){
      return true
    }
    // debugger

    // TODO:依赖收集
    track(target,key) //收集这个对象上的属性，和effect关联在一起
    // console.log(activeEffect,key)

    return Reflect.get(target,key,receiver)
    // 当取值的时候  应该让响应式属性和effect映射起来
  },
  set(target,key,value,receiver){
    // 找到属性，让对应的effect重新执行

    let oldValue = target[key]

    let result = Reflect.set(target,key,value,receiver)
    if(oldValue !== value){
      // 触发更新
      trigger(target,key,value,oldValue)
    }

    // TODO:触发更新
    return result
    
  }
} 