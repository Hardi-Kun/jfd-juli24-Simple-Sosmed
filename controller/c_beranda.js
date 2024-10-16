module.exports =
{

    index: function (req,res) {
        let data = {
            req: req,
        }
        res.render('beranda/index', data)
    },

}