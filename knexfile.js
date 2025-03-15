require('dotenv').config();

console.log('-----' , process.env.DATABASE_URL)
module.exports = {

  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL  ,
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }

};
