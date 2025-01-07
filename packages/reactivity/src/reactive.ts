import { isObject } from "@vue/shared"
import { mutableHandles,ReactiveFlags } from "./baseHandler"

// 用于缓存已经创建过的响应式对象，可以复用
const reactiveMap = new WeakMap()

const createReactiveObject = (target) => {
  // 统一做判断，如果不是对象，直接返回，响应式对象必须是对象
  if(!isObject(target)){
    return target
  }
  
  // 如果已经是响应式对象，直接返回
  if(target[ReactiveFlags.IS_REACTIVE]) return target

  // 如果已经创建过响应式对象，直接返回
  const existedProxy = reactiveMap.get(target)
  if(existedProxy) return existedProxy
  let proxy = new Proxy(target, mutableHandles) 
  // 根据对象缓存代理后的结果
  reactiveMap.set(target, proxy)
  return proxy
}


export const reactive = (target)=> {

  return createReactiveObject(target)
}