const mysql           = require('mysql2')
const eksekusi        = require('../config/database').eksekusi
const update_password = require('../config/database').update_password
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

    
    get_password: function(username, newPassword) {
        return update_password (mysql.format(
            'UPDATE user SET password = ? WHERE username = ?' ,
            [newPassword, username]
        ))
    }

}
