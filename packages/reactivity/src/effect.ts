export const effect = (fn,options?)=> {
  // 创建一个响应式effect 数据变化后可以重新执行



  // 创建一个响应式effect 只要依赖的属性发生变化，就要执行回调
  const _effect = new ReactiveEffect(fn,()=>{
    _effect.run()
  })
  _effect.run() // 默认执行一次
}

export let activeEffect;


const preCleanEffects = (effect) => {
  effect._depsLength = 0 
  effect._trackId++ //每次执行 id都是+1， 如果当前同一个effect执行，id不会改变
}

const cleanDepEffect = (dep,effect) => {
  dep.delete(effect) // 删除依赖
  if(dep.size === 0){
    dep.cleanup() // 如果依赖为空，则清理掉
  }
}

const postCleanEffect = (effect) => {
  if(effect.deps.length > effect._depsLength){
    for(let i = effect._depsLength;i<effect.deps.length;i++){
      cleanDepEffect(effect.deps[i],effect) // 清理掉映射表中对应的effect
    }
    effect.deps.length=  effect._depsLength // 更新依赖长度
  }
}

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


      // 每次effect重新执行前，需要将上一次的依赖清空 effect.deps
      preCleanEffects(this)

      return this.fn() // 依赖收集 state.name state.age 等等
    }finally{
      postCleanEffect(this) // 依赖清理
      activeEffect = lastEffect // 恢复原来的激活effect
    }

  }
}

// 双向记忆


// 1._trackId 用于记录执行次数，(防止一个属性在当前的effect中多次被收集)，只收集一次
// 2.拿到上一次的依赖的最后一个和这次的比较


export const trackEffect = (effect,dep)=>{

  // 需要重新去收集依赖，将不需要的移除掉
  // dep.set(effect,effect._trackId)
  // 让effect记录自己依赖的dep
  // effect.deps[effect._depsLength++] = dep
  // console.log('effect',effect.deps)

  if(dep.get(effect) !== effect._trackId){
    dep.set(effect,effect._trackId) //更新id
  }

  let oldDep = effect.deps[effect._depsLength]

  // 如果没有存过
  if(oldDep !== dep){
    if(oldDep){
      // 之前有依赖，需要将之前的依赖清空
      cleanDepEffect(oldDep,effect)
    }
    // 记录新的依赖
    effect.deps[effect._depsLength++] = dep // 永远按照本次最新的存放
  }else{
    effect._depsLength++
  }


}

export const triggerEffects = (dep) => {
  for(const effect of dep.keys()){
    if(effect.scheduler){
      effect.scheduler() // 执行effect的回调
    }
  }
}