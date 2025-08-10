#!/usr/bin/env node

/**
 * 框架无关的核心功能测试运行器
 * 运行所有核心功能测试
 */

const { execSync } = require('child_process');
const path = require('path');

const testFiles = [
  'core.parser.test.js',
  'core.comprehensive.test.js'
];

console.log('🚀 开始运行框架无关的核心功能测试\n');

let totalPassed = 0;
let totalFailed = 0;

testFiles.forEach(testFile => {
  const testPath = path.join(__dirname, testFile);
  
  try {
    console.log(`📋 运行 ${testFile}...`);
    const output = execSync(`node "${testPath}"`, { 
      encoding: 'utf8',
      cwd: __dirname 
    });
    
    // 提取测试结果
    const lines = output.trim().split('\n');
    const resultLine = lines.find(line => line.includes('测试结果:'));
    if (resultLine) {
      const match = resultLine.match(/(\d+) 通过, (\d+) 失败/);
      if (match) {
        totalPassed += parseInt(match[1]);
        totalFailed += parseInt(match[2]);
      }
    }
    
    console.log(output.trim());
    console.log('');
  } catch (error) {
    console.error(`❌ ${testFile} 运行失败:`);
    console.error(error.stdout || error.message);
    totalFailed += 1;
  }
});

console.log('📊 总体测试结果:');
console.log(`   总通过: ${totalPassed}`);
console.log(`   总失败: ${totalFailed}`);

if (totalFailed > 0) {
  console.log('\n❌ 部分测试失败');
  process.exit(1);
} else {
  console.log('\n🎉 所有核心功能测试通过!');
}