const bcrypt    = require('bcryptjs')
const mysql     = require('mysql2')
const db        = require('../config/database').db
const eksekusi  = require('../config/database').eksekusi

let cari_username = function (username) {
    return eksekusi(mysql.format (
       `SELECT * FROM user WHERE username = ?`, 
        [username]
    ))
}


module.exports = 
{
    form_login: function(req,res) {
        let dataview = {
            message: req.query.msg
        }
        res.render('auth/form-login', dataview)
    },

    proses_login: async function(req,res) {
        let username = req.body.form_username
        let password = req.body.form_password
        let user = await cari_username(username)
      
        if (user.length > 0) {
            let passwordCocok = bcrypt.compareSync(password, user[0].password)
            if (passwordCocok) {
                // arahkan ke halaman feed
                res.redirect(`/feed`)
            } else {
                let message = 'Password salah, coba ingat-ingat kembali paswordmu'
                res.redirect(`/login?msg=${message}`)
            }
        } else {
            let message = 'User tidak terdaftar, silakan register!'
            res.redirect(`/login?msg=${message}`)
        }
    }
}