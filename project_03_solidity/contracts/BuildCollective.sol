pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";
import {Model} from "./Model.sol";

contract BuildCollective is Ownable {

    event UserSignedUp(address indexed userAddress, Model.User user);
    event EnterpriseSignedUp(address indexed ownerAddress, Model.Enterprise enterprise);
    event ProjectCreated(address indexed creatorAddress, Model.Project enterprise);
    event BountyCreated(uint256 indexed projectId, Model.Bounty enterprise);

    mapping(address => Model.User) private users;
    mapping(address => Model.Enterprise) private enterprises;
    mapping(address => uint16) private ownerProjectCountMapping;
    Model.Project[] private projects;
    mapping(uint256 => Model.Bounty[]) private projectBountyMapping;
    uint private ID_COUNTER = 0;

    function() external payable {
    }

    function user(address userAddress) public view returns (Model.User memory) {
        return users[userAddress];
    }

    function enterprise(address enterpriseAddress) public view returns (Model.Enterprise memory) {
        return enterprises[enterpriseAddress];
    }

    function signUp(string memory username) public returns (Model.User memory) {
        require(bytes(username).length > 0);
        users[msg.sender] = Model.User(msg.sender, username, true);
        emit UserSignedUp(msg.sender, users[msg.sender]);
        return users[msg.sender];
    }

    function signUpEnterprise(string memory enterpriseName, address[] memory members) public returns (Model.Enterprise memory) {
        require(bytes(enterpriseName).length > 0);
        enterprises[msg.sender] = Model.Enterprise(enterpriseName, msg.sender, members, true);
        emit EnterpriseSignedUp(msg.sender, enterprises[msg.sender]);
        return enterprises[msg.sender];
    }

    function getRegistrationRecord() public view returns (Model.RegistrationRecord memory rr){
        rr = Model.RegistrationRecord(false, false);
        rr.registered = users[msg.sender].registered || enterprises[msg.sender].registered;
        rr.isEnterprise = enterprises[msg.sender].registered;
    }

    function createProject(string memory name, string memory mission, address[] memory contributors) public returns (Model.Project memory p) {
        require(users[msg.sender].registered || enterprises[msg.sender].registered);
        p = Model.Project(name, mission, msg.sender, contributors, 0, getID());
        projects.push(p);
        ownerProjectCountMapping[msg.sender]++;
        emit ProjectCreated(msg.sender, p);
    }

    function fetchProjects(address projectOwner) public view returns (Model.Project[] memory) {
        Model.Project[] memory result = new Model.Project[](ownerProjectCountMapping[projectOwner]);
        uint16 counter = 0;
        for (uint i = 0; i < projects.length; i++) {
            if (projects[i].owner == projectOwner) {
                result[counter] = projects[i];
                counter++;
            }
        }
        return result;
    }

    function createBounty(uint256 projectId,
        string memory description,
        string memory title,
        uint8 weiBounty,
        string memory issueTrackerUrl) public returns (Model.Bounty memory bounty) {

        bool allowed = false;
        for (uint i = 0; i < projects.length; i++) {
            if (projects[i].id == projectId && projects[i].owner == msg.sender) {
                allowed = true;
            }
        }

        require(allowed);

        bounty = Model.Bounty(msg.sender,
            description,
            title,
            issueTrackerUrl,
            weiBounty,
            projectId,
            true);
        projectBountyMapping[projectId].push(bounty);
        emit BountyCreated(projectId, bounty);
    }

    function fetchBounties(uint256 projectId) public view returns (Model.Bounty[] memory bounties) {
        bounties = projectBountyMapping[projectId];
    }



    function payProject(uint256 projectId) external payable {
        require(msg.value >= 1 wei);
        for (uint i = 0; i < projects.length; i++) {
            if (projects[i].id == projectId) {
                projects[i].balance += msg.value;
            }
        }
    }

    function payContributor(uint256 projectId, address contributor, uint256 amount) external {
        uint projectIndex = 0;
        bool projectHasFunds = false;
        bool isCalledByProjectOwner = false;
        for (uint i = 0; i < projects.length; i++) {
            if (projects[i].id == projectId) {
                isCalledByProjectOwner = projects[i].owner == msg.sender;
                projectHasFunds = projects[i].balance >= amount;
                projectIndex = i;
            }
        }
        require(isCalledByProjectOwner);
        require(projectHasFunds);
        projects[projectIndex].balance -= amount * (1 ether);
        address payable payable_contributor = address(uint160(contributor));
        payable_contributor.transfer(amount * (1 ether));
    }

    function getTotalBalance() public view returns (uint256 totalBalance){
        totalBalance = address(this).balance;
    }

    function getID() private returns (uint) {
        return ++ID_COUNTER;
    }

}
