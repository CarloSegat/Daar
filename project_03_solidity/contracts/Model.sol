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
        uint256 lockedBalance;
        uint256 id;
    }

    struct Bounty {
        string title;
        string description;
        address creator;
        string issueTrackerUrl;
        uint64 weiBounty;
        uint256 projectId;
        address assignee;
        bool markerCompleted; // assignee has marker the bounty as completed, creator needs to check
        bool isOpen; // creator has confirmed the bounty is finished
        uint256 id;
    }
}
