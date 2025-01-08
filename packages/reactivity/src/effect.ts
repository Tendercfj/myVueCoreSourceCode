export const effect = (fn,options?)=> {
  // 创建一个响应式effect 数据变化后可以重新执行



  // 创建一个响应式effect 只要依赖的属性发生变化，就要执行回调
  const _effect = new ReactiveEffect(fn,()=>{
    _effect.run()
  })
  _effect.run() // 默认执行一次
}

export let activeEffect;

class ReactiveEffect {
  _trackId = 0 // 记录当前effect执行了几次
  deps= []
  _depsLength = 0



  public active = true // 创建的effect是响应式的
  // fn 是用户传入的副作用函数
  // 如果fn中的属性发生变化，需要重新执行fn -> run()
  constructor(public fn,public scheduler) {
    
  }
  run(){
    // 执行fn
    if(!this.active){
      return this.fn() // 不是激活的，执行后，什么都不用做
    }
    let lastEffect = activeEffect
    try{
      activeEffect = this // 记录当前激活的effect
      // 激活的
      return this.fn() // 依赖收集 state.name state.age 等等
    }finally{
      activeEffect = lastEffect // 恢复原来的激活effect
    }

  }
}

// 双向记忆
export const trackEffect = (effect,dep)=>{
  dep.set(effect,effect._trackId)
  // 让effect记录自己依赖的dep
  effect.deps[effect._depsLength++] = dep
  // console.log('effect',effect.deps)
}