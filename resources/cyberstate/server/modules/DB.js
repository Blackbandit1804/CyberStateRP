var mysql = require('mysql');

module.exports = {
    Handle: null,
    Connect: function(callback) {
        this.Handle = mysql.createPool({ 
            connectionLimit: 10,
            host: 'localhost',
            user: 'root',
            password: 't00r',
            database: 'cyberstate_gs',
            debug: false
        });
        callback();
    },
    Query: function(text, params, callback) {
        DB.Handle.query(text, params, (err, result) => {
            if (typeof callback == "function") callback(err, result);
        });
    },
    Characters: {
        getSqlIdByName: (name, callback) => {
            DB.Query("SELECT id FROM characters WHERE name=?", [name], (err, result) => {
                if (result.length > 0) callback(result[0].id);
                else callback(0);
            });
        }
    }
};
