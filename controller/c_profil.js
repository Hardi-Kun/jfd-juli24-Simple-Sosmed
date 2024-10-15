const m_user    = require('./../model/m_user')
const m_post    = require('../model/m_post')
const path      = require('path')
const bcrypt    = require('bcryptjs')
const mysql     = require('mysql2')
const moment    = require('moment')
moment.locale('id')

// let cari_password = async function(username) {
//     try {
//         // Definisikan query untuk mencari user berdasarkan username
//         let query = `SELECT * FROM user WHERE username = ?`; 

//         // Eksekusi query dan format dengan parameter username
//         let user = await eksekusi(mysql.format(query, [username])); 

//         if (user.length > 0) {
//             return user[0];  // Jika user ditemukan, kembalikan data user
//         } else {
//             return null;  // Jika user tidak ditemukan, kembalikan null
//         }
//     } catch (error) {
//         // Log error jika terjadi kesalahan
//         console.log("Error saat mencari user:", error);
//         return null;
//     }
// };



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
            req: req,
            message: req.query.msg,
        }
        res.render('profil/form-edit-password', dataview)
    },

    proses_update_password: async function(req, res) {
        console.log(req.body);

        let { form_username,form_password } = req.body;

        if (!form_username || !form_password) {
            res.redirect('/profil/form-edit-password?msg=Semua harus diisi!');
            return;
        }

        // Hash the password
        let hashedPassword = bcrypt.hashSync(form_password, 10);
        console.log('Hashed Password:', hashedPassword);

        try {
            let update = await m_user.update_password(req, hashedPassword)
            console.log('Update Result:', update)
            if (update && update.affectedRows > 0) {
                // ubah data session yg lama
                req.session.user[0].password = hashedPassword
                console.log('Password update successful');
                res.redirect('/profil?msg=Berhasil update password')
            } else {
                console.log('Password update failed: No rows affected');
                res.redirect('/profil/form-edit-password?msg=Gagal Perbarui update password')
            }
        } catch (error) {
            console.error('Caught Error:', error);
            res.redirect('/profil/form-edit-password?msg=Ada yang eror!!')
        }
    
        // // Cari user berdasarkan username
        // let user = await cari_password(username);
    
        // // Logging hasil pencarian user
        // console.log("Hasil dari cari_password:", user);
        // if (user) {  // Cek apakah user ditemukan
        //     // Cek apakah password lama cocok dengan password di database
        //     let passwordCocok = bcrypt.compareSync(password_lama, user.password);
        //     if (passwordCocok) {
        //         // Cek apakah password baru berbeda dari password lama
        //         if (password_lama !== password_baru) {
        //             // Hash password baru sebelum menyimpannya di database
        //             let hashedPassword = bcrypt.hashSync(password_baru, 10);
    
        //             // Panggil fungsi update_password untuk memperbarui password di database
                    
        //             let updateResult = await m_user.update_password(username, hashedPassword);
    
        //             if (updateResult.affectedRows > 0) {
        //                 req.session.user[0].password = hashedPassword
        //                 let message = 'Password berhasil diganti!';
        //                 res.redirect(`/profil?msg=${message}`);
        //             } else {
        //                 let message = 'Gagal mengganti password, silakan coba lagi.';
        //                 res.redirect(`/profil/form-edit-password?msg=${message}`);
        //             }
        //         } else {
        //             res.redirect(`/profil/form-edit-password?msg=Password baru tidak boleh sama dengan password lama.`);
        //         }
        //     } else {
        //         res.redirect(`/profil/form-edit-password?msg=Password saat ini salah.`);
        //     }
        // } else {
        //     let message = 'Username tidak ditemukan, silakan ulangi kembali!';
        //     res.redirect(`/profil/form-edit-password?msg=${message}`);
        // }
    }
    
}
    