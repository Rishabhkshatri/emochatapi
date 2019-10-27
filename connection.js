const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
})

exports.PG_POOL = pool;

// const mysql = require('mysql');
/*con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '111',
    database : 'emochat1'//'mydb'
  });

con.connect((err)=>{
  if(err){
    res.json({page_name:'ServerErr'});
    res.end();
  }else{
    exports.MYSQL_CON = con;
  }
});*/