const mysql     = require('mysql2')
const db        = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jfd_belajar_database',
})
db.connect()

function eksekusi(script_sql) {
    return new Promise((resolve, reject) => {
        db.query(script_sql, function(errorSql, hasil) {
            if (errorSql) {
                reject(errorSql)
            } else {
                resolve(hasil)
            }
        })
    })
}

function update_password(script_sql) {
    return new Promise((resolve, reject) => {
        db.query(script_sql, function(errorSql, results) {
            if (errorSql) {
                reject(errorSql)
            } else {
                resolve(results)
            }
        })
    })
}

module.exports = {
    db, eksekusi, update_password
}