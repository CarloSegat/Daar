pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";
import {Model} from "./Model.sol";

contract BuildCollective is Ownable {

    event UserSignedUp(address indexed userAddress, Model.User user);
    event EnterpriseSignedUp(address indexed ownerAddress, Model.Enterprise enterprise);
    event ProjectCreated(address indexed creatorAddress, Model.Project project);

    mapping(address => Model.User) private users;
    mapping(address => Model.Enterprise) private enterprises;
    mapping(address => uint16) private ownerProjectCountMapping;
    Model.Project[] private projects;
    uint private ID_COUNTER = 0;

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
        rr.registered = _isRegistered(msg.sender);
        rr.isEnterprise = enterprises[msg.sender].registered;
    }

    function createProject(string memory name, string memory mission, address[] memory contributors) public returns (Model.Project memory p) {
        require(_isRegistered(msg.sender));
        p = Model.Project(name, mission, msg.sender, contributors, 0, 0, _getID());
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

    function payProject(uint256 projectId) external payable {
        require(msg.value >= 1 wei);
        for (uint i = 0; i < projects.length; i++) {
            if (projects[i].id == projectId) {
                projects[i].balance += msg.value;
            }
        }
    }

    function payContributor(uint256 projectId, address contributor, uint256 amountWei) external {
        uint projectIndex = 0;
        bool projectHasFunds = false;
        bool isCalledByProjectOwner = false;
        for (uint i = 0; i < projects.length; i++) {
            if (projects[i].id == projectId) {
                isCalledByProjectOwner = projects[i].owner == msg.sender;
                projectHasFunds = projects[i].balance >= amountWei;
                projectIndex = i;
            }
        }
        require(isCalledByProjectOwner);
        require(projectHasFunds);
        projects[projectIndex].balance -= amountWei;
        address payable payable_contributor = payable(contributor);
        payable_contributor.transfer(amountWei);
    }

    function getTotalBalance() public view returns (uint256 totalBalance){
        totalBalance = address(this).balance;
    }


    function fetchAllProjects() public view returns (Model.Project[] memory _projects) {
        _projects = projects;
    }

    function _findProject(uint projectId) internal returns (Model.Project storage) {
        for (uint i = 0; i < projects.length; i++) {
            if (projects[i].id == projectId) {
                return projects[i];
            }
        }
        require(false, "The provided project ID does not exist");
        return projects[0];
    }

    function _findProjectMemory(uint projectId) internal returns (Model.Project memory) {
        for (uint i = 0; i < projects.length; i++) {
            if (projects[i].id == projectId) {
                return projects[i];
            }
        }
        require(false, "The provided project ID does not exist");
        return projects[0];
    }


    function _getID() internal returns (uint) {
        return ++ID_COUNTER;
    }

    function _isRegistered(address msgSender) internal view returns(bool isRegistered){
        isRegistered = users[msg.sender].registered || enterprises[msg.sender].registered;
    }

}
