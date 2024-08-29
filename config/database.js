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


// function cari_username(username) {
//     return new Promise((resolve, reject) => {
//         const query = "SELECT * FROM user WHERE username = ?";
//         db.query(query, [username], (error, results) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(results);
//             }
//         })
//     })
// }

function update_password(username, hashedPassword) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE user SET password = ? WHERE username = ?";
        db.query(query, [hashedPassword, username], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.affectedRows > 0); // Mengembalikan true jika ada baris yang diperbarui
            }
        });
    });
};

const cari_username = async (username) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE username = ?";
        db.query(query, [username], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        })
    })
}



module.exports = {
    db, eksekusi, update_password, cari_username, update_password
}