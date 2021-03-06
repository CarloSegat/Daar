import {createStore} from 'vuex'
import * as Ethereum from '../services/ethereum'

export default createStore({
    state: {
        allProjects: [],
        contract: null,
        account: {
            address: null,
            balance: 0
        },
        registrationStatus: {
            isEnterprise: null,
            registered: null
        },
        openCollectiveAccount: {
            name: "",
            address: null,
            members: []
        },
        bounties: []
    },
    mutations: {
        updateEthereum(state, {address, contract, balance}) {
            // after connecting to metamask we only have the eth, balance & contract ABI
            // we don't know yet if the user has a contract, nor if it's enterprise/single
            state.account.address = address
            state.account.balance = balance
            state.contract = contract
        },
        updateRegistrationStatus(state, {isEnterprise, registered}) {
            state.registrationStatus.isEnterprise = isEnterprise
            state.registrationStatus.registered = registered
        },
        updateSingleUserAccount(state, { name, address, balance}) {
            state.openCollectiveAccount.name = name
            state.openCollectiveAccount.address = address
        },
        updateEnterpriseAccount(state, { name, address, balance, members}) {
            state.openCollectiveAccount.name = name
            state.openCollectiveAccount.address = address
            state.openCollectiveAccount.members = members
        },
        updateBounties(state, bounties) {
            state.bounties = bounties;
        },
        updateAllProjects(state, projects){
            state.allProjects = projects;
        },
    },
    actions: {
        async ethereumConnect(context) {
            const response = await Ethereum.connect() // connect returns address & contract abi, NOT the userAccount!
            if (response) {
                const {address, contract, balance} = response
                context.commit('updateEthereum', {address, contract, balance})
            }
        },
        async fetchRegistrationRecord(context) {
            const contract = context.state.contract;
            if (contract !== null) {
                const response = await contract.methods.getRegistrationRecord().call()
                if (response) {
                    const {isEnterprise, registered} = response
                    context.commit('updateRegistrationStatus', {isEnterprise, registered})
                }
            }
        },
        async fetchSingleUserAccount(context, { address }) {
            const contract = context.state.contract;
            if (contract !== null) {
                const response = await contract.methods.user(address).call()
                if (response) {
                    const {username, registered, balance} = response
                    context.commit('updateSingleUserAccount', {name: username, address, balance})
                }
            }
        },
        async fetchEnterpriseAccount(context, { address }) {
            const contract = context.state.contract;
            if (contract !== null) {
                const response = await contract.methods.enterprise(address).call()
                if (response) {
                    const {name, registered, balance, members} = response
                    context.commit('updateEnterpriseAccount', {name, address, balance, members})
                }
            }
        },

        async fetchAllProjects(context) {
            const contract = context.state.contract;
            if (contract !== null) {
                const response = await contract.methods.fetchAllProjects().call()
                if (response) {
                    context.commit('updateAllProjects', response)
                }
            }
        },
        async fetchBounties(context, { projectId }) {
            const contract = context.state.contract;
            if (contract !== null) {
                const response = await contract.methods.fetchBounties(projectId).call()
                if (response) {
                    console.log("fetchBounties response ", response)
                    context.commit('updateBounties', response)
                }
            }
        },
    },
    modules: {},
})
