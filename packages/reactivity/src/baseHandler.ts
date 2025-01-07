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

    return Reflect.get(target,key,receiver)
    // 当取值的时候  应该让响应式属性和effect映射起来
  },
  set(target,key,value,receiver){
    // 找到属性，让对应的effect重新执行

    // TODO:触发更新
    return Reflect.set(target,key,value,receiver)
    
  }
} 