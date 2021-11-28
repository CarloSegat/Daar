module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    test: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
  },
  contracts_directory: './contracts/',
  contracts_build_directory: './build/contracts/',
  migrations_directory: './migrations',
  compilers: {
    solc: {
      version: ' >=0.4.22 <0.9.0',
      optimizer: {
        enabled: false
      },
    },
  },
}
