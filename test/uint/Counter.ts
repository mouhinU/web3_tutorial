// import { expect } from "chai";
// import hre from "hardhat";
// // import CounterModule from "../../ignition/modules/Counter.js";
// const { ethers,networkName } = await hre.network.connect();
// console.log("Counter Unit Test , Network name:", networkName);

// describe("Counter", function () {
//   it("Should emit the Increment event when calling the inc() function", async function () {
//     const connection = await hre.network.connect();
//     const { counter } = await connection.ignition.deploy(CounterModule);
   
//     const tx = await counter.inc();
//     const receipt = await tx.wait();
//     console.log(receipt)
//     // Ethers.js v6 推荐的事件获取方式
//     const incrementEvents = receipt?.logs?.filter((log: any) => {
//       try {
//         return counter.interface.parseLog(log)?.name === 'Increment';
//       } catch {
//         return false;
//       }
//     });
//     console.log("Increment events:", incrementEvents);
//     expect(incrementEvents?.length).to.be.greaterThan(0);
//     if (incrementEvents && incrementEvents.length > 0) {
//       const parsedLog = counter.interface.parseLog(incrementEvents[0]);
//       expect(parsedLog?.args[0]).to.equal(1n);
//     }
//   });

//   // it("Should emit the Increment event when calling the inc() function", async function () {
//   //   const counter = await ethers.deployContract("Counter");
//   //   await expect(counter.inc()).to.emit(counter, "Increment").withArgs(1n);
//   // });

//   it("The sum of the Increment events should match the current value", async function () {
//     // 1. 为测试设置更长的超时时间，以适应测试网的延迟
//     this.timeout(600000); // 10 分钟

//     const counter = await measureAsyncTime("部署 Counter 合约", () =>
//       ethers.deployContract("Counter")
//     );
//     const deployReceipt = await counter.deploymentTransaction()?.wait();
//     console.log("部署交易回执:", deployReceipt);
//     console.log("✅ 合约已部署至:", counter.target);

//     // 2. 确保从部署回执中获取准确的起始区块号
//     const deploymentBlockNumber = deployReceipt?.blockNumber;
//     if (!deploymentBlockNumber) {
//       throw new Error("未能获取部署区块号");
//     }
//     console.log("📖 部署区块号:", deploymentBlockNumber);

//     // 3. 改为串行发送交易，以避免测试网上的 nonce 冲突和 "replacement transaction underpriced" 错误
//     await measureAsyncTime("发送并确认10个增量交易", async () => {
//       for (let i = 1; i <= 10; i++) {
//         const tx = await counter.incBy(i);
//         // 核心改动：在循环内部等待每个交易被确认
//         const receipt = await tx.wait();
//         console.log(`  - 交易 ${i}/${10} 已在区块 ${receipt?.blockNumber} 确认`);
//       }
//     });

//     await new Promise(resolve => setTimeout(resolve, 30000)); // 20 秒
//     // 4. 使用轮询机制替代不稳定的 setTimeout，以健壮地等待事件索引
//     const events = await measureAsyncTime("轮询查询事件", async () => {
//       let foundEvents: any[] = [];
//       const maxRetries = 10;
//       const retryInterval = 8000; // 5 秒

//       for (let i = 0; i < maxRetries; i++) {
//         const currentBlock = await ethers.provider.getBlockNumber();
//         console.log(`[尝试 ${i + 1}/${maxRetries}] 正在查询区块 ${deploymentBlockNumber} 到 ${currentBlock} 的事件...`);
//         let queriedEvents: any[] = [];
//         try {
//           queriedEvents = await counter.queryFilter(
//             counter.filters.Increment(),
//             deploymentBlockNumber,
//             currentBlock
//           );
//         } catch (error) {
//           console.warn(`[尝试 ${i + 1}/${maxRetries}] 查询事件时出错:`, error);
//         }

//         if (queriedEvents.length >= 10) {
//           console.log(`🎉 成功找到 ${queriedEvents.length} 个事件!`);
//           foundEvents = queriedEvents;
//           break;
//         }

//         console.log(`  - 只找到 ${queriedEvents.length} 个事件，将在 ${retryInterval / 1000} 秒后重试...`);
//         if (i < maxRetries - 1) {
//           await new Promise(resolve => setTimeout(resolve, retryInterval));
//         }
//       }
      
//       if (foundEvents.length < 10) {
//           console.error(`❌ 在 ${maxRetries} 次重试后仍未能找到所有10个事件。`);
//       }
//       return foundEvents;
//     });

//     console.log(`📊 总共找到 ${events.length} 个 Increment 事件。`);
//     expect(events.length).to.be.at.least(10);

//     // 聚合事件数据并进行断言
//     let total = 0n;
//     for (const event of events) {
//      if ('args' in event && event.args) {
//         total += (event.args as any)[0] || 0n;
//      }
//     }
//     console.log(`🧮 事件聚合总数: ${total}`);

//     const contractValue = await counter.x();
//     console.log("🧾 合约当前计数值: ", contractValue.toString());
//     expect(contractValue).to.equal(total);
//   });
// });

// /**
//  * 异步时间输出函数 - 测量并输出异步操作的执行时间
//  * @param name 操作名称，用于日志输出
//  * @param fn 要执行的异步函数
//  * @returns 返回异步函数的执行结果
//  */
// async function measureAsyncTime<T>(name: string, fn: () => Promise<T>): Promise<T> {
//   const startTime = Date.now();
//   console.log(`🚀 [${name}] 开始执行...`);
  
//   try {
//     const result = await fn();
//     const endTime = Date.now();
//     const duration = endTime - startTime;
//     console.log(`✅ [${name}] 执行成功 | 耗时: ${(duration / 1000).toFixed(2)}s`);
//     return result;
//   } catch (error) {
//     const endTime = Date.now();
//     const duration = endTime - startTime;
//     console.error(`❌ [${name}] 执行失败 | 耗时: ${(duration / 1000).toFixed(2)}s`);
//     console.error(`🔍 [${name}] 错误详情:`, error);
//     throw error; // 重新抛出错误，以确保测试失败
//   }
// }