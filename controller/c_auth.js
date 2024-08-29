const bcrypt    = require('bcryptjs')
const mysql     = require('mysql2')
const m_post    = require('../model/m_post')
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
        if (req.session.user) {
            res.redirect('/feed')
        } else {
            let dataview = {
                message: req.query.msg
            }
            res.render('auth/form-login', dataview)
        }
    },

    proses_login: async function(req,res) {
        let username = req.body.form_username
        let password = req.body.form_password
        let user = await cari_username(username)
      
        if (user.length > 0) {
            let passwordCocok = bcrypt.compareSync(password, user[0].password)
            if (passwordCocok) {
                // set data session user yg login
                req.session.user = user 
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
    },


    cek_login: function(req,res,next) {
        if (req.session.user) {
            next()
        } else {
            let message = 'Sesi anda habis, silakan login ulang.'
            res.redirect(`/login?msg=${message}`)
        }
    },

    form_edit_password: function(req,res) {

        if (req.session.user) {
            res.redirect('/login')
        } else {
            let dataview = {
                message: req.query.msg
            }
            res.render('auth/form-edit-password', dataview)
        }
    },

    proses_edit: async function(req,res) {
        let username            = req.body.form_username
        let currentPassword     = req.body.form_password
        let newPassword         = req.body.form_Bpassword
        let confirmPassword     = req.body.form_Cpassword
      
            // Cari user berdasarkan username
            let user = await cari_username(username);

            if (user.length > 0) {
                // Cek apakah password saat ini benar
                let passwordCocok = bcrypt.compareSync(currentPassword, user[0].password);
                if (passwordCocok) {
                    // Cek apakah password baru dan konfirmasi password cocok
                    if (newPassword === confirmPassword) {
                        // Hash password baru sebelum menyimpannya di database
                        let hashedPassword = bcrypt.hashSync(newPassword, 10);

                        // Update password di database
                        let updateResult = await update_password(username, hashedPassword);

                        if (updateResult) {
                            let message = 'Password berhasil diubah!';
                            res.redirect(`/login?msg=${message}`);
                        } else {
                            let message = 'Terjadi kesalahan saat mengubah password.';
                            res.redirect(`/edit-password?msg=${message}`);
                        }
                    } else {
                        let message = 'Password baru dan konfirmasi password tidak cocok.';
                        res.redirect(`/edit-password?msg=${message}`);
                    }
                } else {
                    let message = 'Password saat ini salah.';
                    res.redirect(`/edit-password?msg=${message}`);
                }
            } else {
                let message = 'User tidak ditemukan.';
                res.redirect(`/login?msg=${message}`);
            }
       
    }
}