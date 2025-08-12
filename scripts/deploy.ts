import {ethers} from "hardhat"
import { getDeployer, saveToFronted } from "./confg"

async function main() {
    console.log("开始部署");
    const deployer = await getDeployer();

    // 部署CourseList
    const courseList = await ethers.getContractFactory("CourseList");
    const CourseList = await courseList.deploy();
    await CourseList.waitForDeployment();
    const courseListAddress =  await CourseList.getAddress()

    
    // 部署Course
    const course = await ethers.getContractFactory("CourseList");
    const Course = await course.deploy();
    await Course.waitForDeployment();
    const courseAddress =  await Course.getAddress()

    saveToFronted({
        courseList: courseListAddress,
        course:courseAddress,
    })

    console.log("部署完成!");
}

// 执行部署
main().catch(error => {
    console.log(error);
    process.exitCode = 1
})
