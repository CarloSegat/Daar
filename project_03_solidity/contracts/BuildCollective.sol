pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";

contract BuildCollective is Ownable {

    struct User {
        address userAddress;
        string username;
        uint256 balance;
        bool registered;
    }

    struct Enterprise {
        string name;
        address owner;
        uint256 balance;
        address[] members;
        bool registered;
    }

    struct RegistrationRecord {
        bool registered;
        bool isEnterprise;
    }

    struct Project {
        string name;
        string mission;
        address owner;
        address[] members;
        uint32 balance;
    }

    mapping(address => User) private users;
    mapping(address => Enterprise) private enterprises;
    mapping(address => uint16) private ownerProjectCountMapping;
    Project[] private projects;

    event UserSignedUp(address indexed userAddress, User user);
    event EnterpriseSignedUp(address indexed ownerAddress, Enterprise enterprise);
    event ProjectCreated(address indexed creatorAddress, Project enterprise);

    function user(address userAddress) public view returns (User memory) {
        return users[userAddress];
    }

    function enterprise(address enterpriseAddress) public view returns (Enterprise memory) {
        return enterprises[enterpriseAddress];
    }

    function signUp(string memory username) public returns (User memory) {
        require(bytes(username).length > 0);
        users[msg.sender] = User(msg.sender, username, 0, true);
        emit UserSignedUp(msg.sender, users[msg.sender]);
        return users[msg.sender];
    }

    function signUpEnterprise(
        string memory enterpriseName,
        address[] memory members,
        uint256 balance) public returns (Enterprise memory) {
        require(bytes(enterpriseName).length > 0);
        enterprises[msg.sender] = Enterprise(enterpriseName, msg.sender, balance, members, true);
        emit EnterpriseSignedUp(msg.sender, enterprises[msg.sender]);
        return enterprises[msg.sender];
    }

    function addBalance(uint256 amount) public returns (bool) {
        require(users[msg.sender].registered || enterprises[msg.sender].registered);
        users[msg.sender].balance += amount;
        return true;
    }

    function getRegistrationRecord() public view returns(RegistrationRecord memory rr){
        rr = RegistrationRecord(false, false);
        rr.registered = users[msg.sender].registered || enterprises[msg.sender].registered;
        rr.isEnterprise = enterprises[msg.sender].registered;
    }

    //  function addBalanceEnterprise(uint256 amount) public returns (bool) {
    //    require(enterprises[msg.sender].registered);
    //    enterprises[msg.sender].balance += amount;
    //    return true;
    //  }

    function createProject(string memory name, string memory mission, address[] memory members)  public returns(Project memory p) {
        require(users[msg.sender].registered || enterprises[msg.sender].registered);
        p = Project(name, mission, msg.sender, members, 0);
        projects.push(p);
        ownerProjectCountMapping[msg.sender]++;
        emit ProjectCreated(msg.sender, p);
    }

    function fetchProjects(address projectOwner) public view returns(Project[] memory) {
        Project[] memory result = new Project[](ownerProjectCountMapping[projectOwner]);
        uint16 counter = 0;
        for(uint i = 0; i < projects.length; i++){
            if(projects[i].owner == projectOwner) {
                result[counter] = projects[i];
                counter++;
            }
        }
        return result;
    }

}
