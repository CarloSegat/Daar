pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";
import {Model} from "./Model.sol";
import "./BuildCollective.sol";
import "./Model.sol";
import "./Model.sol";

contract Bounties is BuildCollective {

    event BountyCreated(uint256 indexed projectId, Model.Bounty enterprise);

    mapping(uint256 => Model.Bounty[]) private projectBountyMapping;

    function createBounty(uint256 projectId,
        string memory description,
        string memory title,
        uint64 weiBounty,
        string memory issueTrackerUrl) public returns (Model.Bounty memory bounty) {

        Model.Project memory project = _findProject(projectId);
        bool isOwner = project.owner == msg.sender;
        bool hasEnoughEth = project.balance >= weiBounty;

        require(isOwner, "Only the project owner can create bounties");
        require(hasEnoughEth, "You don't have enough balance on the project to create the bounty");

        // lock the wei bounty
        project.lockedBalance += weiBounty;
        project.balance -= weiBounty;

        bounty = Model.Bounty(title,
            description,
            msg.sender,
            issueTrackerUrl,
            weiBounty,
            projectId,
            address(0),
            false,
            true,
            _getID()
        );
        projectBountyMapping[projectId].push(bounty);
        emit BountyCreated(projectId, bounty);
    }

    function fetchBounties(uint256 projectId) public view returns (Model.Bounty[] memory bounties) {
        bounties = projectBountyMapping[projectId];
    }

    function assignMeToBounty(uint projectId, uint bountyId) public {
        require(_isRegistered(msg.sender), "You are not registered");
        Model.Bounty storage b = _findBounty(projectId, bountyId);
        b.assignee = msg.sender;
    }

    function unAssignMeFromBounty(uint projectId, uint bountyId) public {
        require(_isRegistered(msg.sender));
        Model.Bounty storage b = _findBounty(projectId, bountyId);
        require(b.assignee == msg.sender, "Only the assignee can unassign themselves");
        b.assignee = address(0);
    }

    function markBountyCompleted(uint projectId, uint bountyId, bool isCompleted) public {
        require(_isRegistered(msg.sender));
        Model.Bounty storage b = _findBounty(projectId, bountyId);
        require(b.assignee == msg.sender);
        b.markerCompleted = isCompleted;
    }

    function closeBounty(uint projectId, uint bountyId) public {
        require(_isRegistered(msg.sender), "User not registered");
        Model.Project memory p = _findProject(projectId);
        require(p.owner == msg.sender, "Only the project owner can confirm that a bounty has been completed");
        Model.Bounty storage bounty = _findBounty(projectId, bountyId);
        require(bounty.markerCompleted, "Only a completed bounty can be closed");
        bounty.isOpen = false;

        // pay prize to bounty hunter
        address payable payable_assignee = address(uint160(bounty.assignee));
        payable_assignee.transfer(bounty.weiBounty);
        p.lockedBalance -= bounty.weiBounty;
    }

    function deleteBounty(uint projectId, uint bountyId) public {
        require(_isRegistered(msg.sender));
        Model.Project memory p = _findProject(projectId);
        require(p.owner == msg.sender);
        _deleteBounty(projectId, bountyId);
    }

    function fetchBounty(uint projectId, uint bountyId) public view returns(Model.Bounty memory){
        Model.Bounty[] memory bounties = projectBountyMapping[projectId];
        for (uint i = 0; i < bounties.length; i++) {
            if (bounties[i].id == bountyId) {
                return bounties[i];
            }
        }
        require(false, "The provided bounty ID or project ID does not exist");
        return bounties[0];
    }

    function _findBounty(uint projectId, uint bountyId) private returns (Model.Bounty storage) {
        Model.Bounty[] storage bounties = projectBountyMapping[projectId];
        for (uint i = 0; i < bounties.length; i++) {
            if (bounties[i].id == bountyId) {
                return bounties[i];
            }
        }
        require(false, "The provided bounty ID or project ID does not exist");
        return bounties[0];
    }

    function _deleteBounty(uint projectId, uint bountyId) internal {
        Model.Bounty[] memory bounties = projectBountyMapping[projectId];
        for (uint i = 0; i < bounties.length; i++) {
            if (bounties[i].id == bountyId) {
                projectBountyMapping[projectId][i] = projectBountyMapping[projectId][bounties.length - 1];
                projectBountyMapping[projectId].pop();
                return;
            }
        }
        require(false, "The provided bounty ID or project ID does not exist");
    }
}
