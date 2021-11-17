import {createStore} from 'vuex'
import * as Ethereum from '../services/ethereum'

export default createStore({
    state: {
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
            balance: 0,
            members: []
        },
        projects: []
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
            state.openCollectiveAccount.balance = balance
        },
        updateEnterpriseAccount(state, { name, address, balance, members}) {
            state.openCollectiveAccount.name = name
            state.openCollectiveAccount.address = address
            state.openCollectiveAccount.balance = balance
            state.openCollectiveAccount.members = members
        },
        updateProjects(state, projects){
            state.projects = projects;
        }
    },
    actions: {
        async ethereumConnect(context) {
            // console.log("context ", context)
            const response = await Ethereum.connect() // connect returns address & contract abi, NOT the userAccount!
            // console.log("response from eth COnnect: ", response)
            if (response) {
                const {address, contract, balance} = response
                context.commit('updateEthereum', {address, contract, balance})
            }
        },
        async fetchRegistrationRecord(context) {
            // console.log("ef")
            const contract = context.state.contract;
            // console.log("contract.methods: ", contract.methods)
            // console.log("context from store: ", context)
            // console.log("context.state: ", context.state)
            if (contract !== null) {
                const response = await contract.methods.getRegistrationRecord().call()
                if (response) {
                    const {isEnterprise, registered} = response
                    // console.log("{isEnterprise, registered}: ", {isEnterprise, registered})
                    context.commit('updateRegistrationStatus', {isEnterprise, registered})
                }
            }
        },
        async fetchSingleUserAccount(context, { address }) {
            console.log("fetchSingleUserAccount called w payload: ", address)
            const contract = context.state.contract;
            // console.log("contract.methods: ", contract.methods)
            // console.log("context from store: ", context)
            // console.log("context.state: ", context.state)
            if (contract !== null) {
                const response = await contract.methods.user(address).call()
                if (response) {
                    const {username, registered, balance} = response
                    console.log("{isEnterprise, registered}: ", {username, registered, balance})
                    context.commit('updateSingleUserAccount', {name: username, address, balance})
                }
            }
        },
        async fetchEnterpriseAccount(context, { address }) {
            console.log("fetchSingleUserAccount called w payload: ", address)
            const contract = context.state.contract;
            // console.log("contract.methods: ", contract.methods)
            // console.log("context from store: ", context)
            // console.log("context.state: ", context.state)
            if (contract !== null) {
                const response = await contract.methods.enterprise(address).call()
                if (response) {
                    console.log("fetchEnterpriseAccount response ", response)
                    const {name, registered, balance, members} = response
                    context.commit('updateEnterpriseAccount', {name, address, balance, members})
                }
            }
        },
        async fetchProjects(context, { address }) {
            console.log("fetchProjects called w payload: ", address)
            const contract = context.state.contract;
            // console.log("contract.methods: ", contract.methods)
            // console.log("context from store: ", context)
            // console.log("context.state: ", context.state)
            if (contract !== null) {
                const response = await contract.methods.fetchProjects(address).call()
                if (response) {
                    console.log("fetchProjects response ", response)
                    // const {name, mission, balance, members, owner} = response
                    context.commit('updateProjects', response)
                }
            }
        },
    },
    modules: {},
})
