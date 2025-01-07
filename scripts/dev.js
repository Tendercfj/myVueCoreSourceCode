// 这个文件会帮我们打包packages下的模块，最终打包出js文件

// node dev.js (要打包的名字 -f 打包的文件格式) === argv.slice(2)
import minimist from "minimist";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import esbuild from "esbuild";

// 获取命令行参数 process.argv
const args = minimist(process.argv.slice(2));
const __filename = fileURLToPath(import.meta.url); // 获取当前文件的绝对路径  file:
const __dirname = dirname(__filename); // 获取当前文件的目录
const require = createRequire(import.meta.url); // 获取当前文件的require方法

const target = args._[0]; //打包哪个项目
const format = args.f || "iife"; //打包的格式,默认为iife(立即执行函数)

console.log(target, format);

// node中esm模块没有 __dirname,

const entry = resolve(__dirname, `../packages/${target}/src/index.ts`); // 打包的入口文件
const pkg = require(`../packages/${target}/package.json`); // 打包的包的package.json
// 根据需要进行打包

esbuild
  .context({
    entryPoints: [entry], // 入口文件
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`), //出口文件
    bundle: true, // 打包 reactivity -> shared 会打包到一起
    platform: "browser", // 打包浏览器环境
    sourcemap: true, // 可以调试源码
    format, // 打包格式 cjs:moudle.exports = xxx, esm:import xxx from 'xxx', iife:立即执行函数
    globalName: pkg.buildOptions?.name,
  })
  .then((ctx) => {
    console.log(`打包${target}成功`);

    return ctx.watch(); // 监听入口文件持续打包
  });
