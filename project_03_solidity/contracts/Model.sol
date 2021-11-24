pragma solidity >=0.4.22 <0.9.0;

library Model {

    struct User {
        address userAddress;
        string username;
        bool registered;
    }

    struct Enterprise {
        string name;
        address owner;
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
        address[] contributors;
        uint256 balance;
        uint256 id;
    }

    struct Bounty {
        address creator;
        string description;
        string title;
        string issueTrackerUrl;
        uint8 weiBounty;
        uint256 projectId;
        bool isOpen;
    }
}
