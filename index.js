import { registerMicroApps, start } from "qiankun";

registerMicroApps(WEBPACK_QIANKUN_SUBAPP_CONFIGS)  // 通过webpack runtime去收集子应用的qiankun配置
start()

console.log('qiankun start...', WEBPACK_QIANKUN_SUBAPP_CONFIGS)