import { ethers } from 'hardhat';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
interface AddressProps {
    courseList: string,
    course: string,
}

dotenv.config();


export const NETWORK_CONFIG = {
    // Arbitrum Sepolia 测试网
    arbitrumSepolia: {
        rpcUrl: process.env.ARBITRUM_SEPOLIA_RPC_URL || "https://sepolia-rollup.arbitrum.io/rpc",
        chainId: 421614,
        explorerUrl: "https://sepolia.arbiscan.io"
    },
    // Ganache 本地网络
    ganache: {
        rpcUrl: process.env.GANACHE_URL || "http://127.0.0.1:7545",
        chainId: 1337,
        explorerUrl: "http://localhost:7545"
    }
}


// 获取部署账号
export const getDeployer = async () => {
    const [deployer] = await ethers.getSigners();

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("部署账号:", deployer.address, "余额:", ethers.formatEther(balance), "ETH");

    return deployer
}


// 保存到前端

export const saveToFronted = (address: AddressProps) => {
    try {
        // 创建合约文件
        const configContent = `
        // 此文件由部署脚本自动生成，请勿手动修改
        // 最后更新时间: ${new Date().toLocaleString()}
        
        export const CONTRACT_ADDRESSES = {
         course: "${address.course}",
         courseList: "${address.courseList}"
        };
        `;


        // 目录查询
        const configDir = path.join(__dirname, "../frontend/src/app/config");
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true })
        }

        // 写入
        const configPath = path.join(configDir, "address.ts");
        fs.writeFileSync(configPath, configContent);
        console.log(`合约地址已保存到: ${configPath}`);

        // 复制 ABI 文件到前端
        const artifactsDir = path.join(__dirname, "../artifacts/contracts");
        const frontendAbiDir = path.join(__dirname, "../frontend/src/app/abis");

        if (!fs.existsSync(frontendAbiDir)) {
            fs.mkdirSync(frontendAbiDir, { recursive: true });
        }

        // 复制 CourseList ABI
        const simpleCourseListArtifact = require(path.join(artifactsDir, "CourseList.sol/CourseList.json"));
        fs.writeFileSync(
            path.join(frontendAbiDir, "CourseList.json"),
            JSON.stringify(simpleCourseListArtifact, null, 2)
        );
        
        // 复制 Course ABI
        const simpleCourseArtifact = require(path.join(artifactsDir, "CourseList.sol/Course.json"));
        fs.writeFileSync(
            path.join(frontendAbiDir, "Course.json"),
            JSON.stringify(simpleCourseArtifact, null, 2)
        );


        console.log("ABI 文件已复制到前端");

    } catch (error) {
        console.error("部署失败:", error)
    }
}

