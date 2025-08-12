// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract CourseList {
    address public ceo;

    Course[] public courseList;

    constructor() {
        ceo = msg.sender;
    }

    // 创建课程
    function createCourse(
        string memory _name,
        string memory _desc,
        uint _target,
        uint _fundingPrice,
        uint _price,
        string memory _img
    ) public {
        Course newCourse = new Course(
            ceo,
            msg.sender,
            _name,
            _desc,
            _target,
            _fundingPrice,
            _price,
            _img
        );
        courseList.push(newCourse);
    }

    // 获取课程
    function getCourseList() public view returns (Course[] memory) {
        return courseList;
    }

    // 删除课程
    function removeCourse(uint _index) public {
        require(msg.sender == ceo);
        require(_index == courseList.length);
        for (uint i = _index; i < courseList.length - 1; i++) {
            courseList[i] = courseList[i + 1];
        }
        courseList.pop();
    }

    function isCeo() public view returns (bool) {
        return msg.sender == ceo;
    }
}

// 属性
// ceo平台分成
// owner  创作者
// 课程标题
// 课程描述
// ICO支持价格
// ICO目标金额
// 上线后价格
// 支持人数
// img
// video
// 是否上线

contract Course {
    address payable public ceo;
    address payable public owner;
    string public name;
    string public desc;
    uint public target;
    uint public fundingPrice;
    uint public price;
    string public img;
    string public video;
    bool public isOnline;
    uint public count;

    mapping(address => uint) public buyers;

    constructor(
        address _ceo,
        address _owner,
        string memory _name,
        string memory _desc,
        uint _target,
        uint _fundingPrice,
        uint _price,
        string memory _img
    ) {
        ceo = payable(_ceo);
        owner = payable(_owner);
        name = _name;
        desc = _desc;
        target = _target;
        fundingPrice = _fundingPrice;
        price = _price;
        img = _img;
        video = "";
        isOnline = false;
        count = 0;
    }

    // 增加video
    function addVideo(string memory _video) public {
        require(msg.sender == owner);
        require(isOnline == true);
        video = _video;
    }

    // ico或buy
    function buy() public payable {
        // 判断是否已购买
        require(buyers[msg.sender] == 0);
        if (isOnline) {
            // 上线后必须用上线价格购买
            require(price == msg.value);
        } else {
            require(fundingPrice == msg.value);
        }

        buyers[msg.sender] = msg.value;
        count += 1;

        // 上线及分成
        if (target <= count * fundingPrice) {
            if (isOnline) {
                uint value = msg.value;

                ceo.transfer(value / 10);
                owner.transfer(value - value / 10);
            } else {
                isOnline = true;
                owner.transfer(count * fundingPrice);
            }
        }
    }

    // 获取详情
    function getDetail()
        public
        view
        returns (
            string memory,
            string memory,
            uint,
            uint,
            uint,
            string memory,
            string memory,
            uint,
            bool,
            uint
        )
    {
        // 角色
        uint role;
        if (owner == msg.sender) {
            role = 0; //创作者
        } else if (buyers[msg.sender] > 0) {
            role = 1; //购买者或支持者
        } else {
            role = 2; // 没买
        }

        return (
            name,
            desc,
            target,
            fundingPrice,
            price,
            img,
            video,
            count,
            isOnline,
            role
        );
    }
}
