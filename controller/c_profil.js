const m_user = require('./../model/m_user')
const m_post = require('../model/m_post')
const path   = require('path')
const bcrypt    = require('bcryptjs')
const mysql     = require('mysql2')
const db        = require('../config/database').db
const eksekusi  = require('../config/database').eksekusi
const moment = require('moment')
moment.locale('id')

let cari_username = function (username) {
    return eksekusi(mysql.format (
       `SELECT * FROM user WHERE username = ?`, 
        [username]
    ))
}


module.exports =
{
    index: async function(req, res) {
        let dataview = {
            req: req,
            moment: moment,
            message: req.query.msg,
            postingan: await m_post.get_all()
        }
        res.render('profil/index', dataview)
    },

    form_edit: function(req, res) {
        let dataview = {
            req: req
        }
        res.render('profil/form-edit', dataview)
    },

    proses_update: async function(req, res) {
        try {
            let update = await m_user.update(req)
            if (update.affectedRows > 0) {
                // ubah data session yg lama
                req.session.user[0].nama_lengkap = req.body.form_namalengkap
                req.session.user[0].bio = req.body.form_bio
                // kembalikan ke halaman profil
                res.redirect(`/profil?msg=berhasil edit profil`)
            }
        } catch (error) {
            throw error
        }
    },

    form_edit_foto: function(req,res) {
        let dataview = {
            req: req
        }
        res.render('profil/form-edit-foto', dataview)
    },

    proses_update_foto: function(req, res) {
        let foto = req.files.form_uploadfoto

        // ganti nama file asli
        let username        = req.session.user[0].username.replaceAll('-', '-')
        let datetime        = moment().format('YYYYMMDD, HHmmss')
        let file_name       = username + '_' + datetime + '_' + foto.name
        let folder_simpan   = path.join(__dirname, '../public/upload/', file_name)

        // pakai fuunction mv() untuk meletakkan file di suatu folder/direktori
        foto.mv(folder_simpan, async function(err) {
            if (err) {
                return res.status(500).send(err)
            }
            // jika fotonya berhasil terupload ke folder_simpen
            try {
                let update = await m_user.update_foto(req, file_name)
                if (update.affectedRows > 0) {
                    // ubah data session yg lama
                    req.session.user[0].foto = file_name
                    // kembalikan ke halaman profil
                    res.redirect(`/profil?msg=berhasil ganti foto profil`)
                }
            } catch (error) {
                throw error
            }
        })
    },

    form_edit_password: function(req,res) {
        let dataview = {
            req: req
        }
        res.render('profil/form-edit-password', dataview)
    },

    proses_edit: async function(req, res) {
        let username            = req.body.form_username;
        let currentPassword     = req.body.form_password;
        let newPassword         = req.body.form_Bpassword;
        let confirmPassword     = req.body.form_Cpassword;
    
        try {
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
                            res.redirect(`/profil/form-edit-password?msg=${message}`);
                        }
                    } else {
                        let message = 'Password baru dan konfirmasi password tidak cocok.';
                        res.redirect(`/profil/form-edit-password?msg=${message}`);
                    }
                } else {
                    let message = 'Password saat ini salah.';
                    res.redirect(`/profil/form-edit-password?msg=${message}`);
                }
            } else {
                let message = 'User tidak ditemukan.';
                res.redirect(`/login?msg=${message}`);
            }
        } catch (error) {
            console.error("Error:", error);
            let message = 'Terjadi kesalahan pada server.';
            res.redirect(`/profil/form-edit-password?msg=${message}`);
        }
    }
    
    
}
    