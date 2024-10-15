const mysql           = require('mysql2')
const eksekusi        = require('../config/database').eksekusi
const db              = require('../config/database').db
const moment          = require('moment')
moment.locale('id')

module.exports = 
{
    update: function(req) {
        let data = {
            nama_lengkap              : req.body.form_namalengkap,
            bio                       : req.body.form_bio,
            last_update               : moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        let id_user = req.session.user[0].id
        return eksekusi(mysql.format(
            `UPDATE user SET ? WHERE id = ?` , 
            [data, id_user]
        ))
    },

    update_foto: function(req, file_name) {
        let data = {
            foto             : file_name,
            last_update      : moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        let id_user = req.session.user[0].id
        return eksekusi(mysql.format(
            `UPDATE user SET ? WHERE id = ?` , 
            [data, id_user]
        ))  
    },      


    update_password: async function(req, hashedPassword) { 
        let sqlData = {
            username    : req.body.form_username,   
            password    : hashedPassword,
        }
        let id_user = req.session.user?.[0]?.id

        let sqlSyntax = mysql.format (
            `UPDATE user SET ? WHERE id = ?`,
            [sqlData, id_user]
        )
        return eksekusi (sqlSyntax)

        // let data = {
        //     password    : req.body.form_password_baru,
        //     last_update : moment().format('YYYY-MM-DD HH:mm:ss'),
        // }
        // let id_user = req.session.user[0].id
        
        // return eksekusi (mysql.format(
        //     'UPDATE user SET ? WHERE id = ?' ,
        //     [data, id_user]
        // ))
    }

}
