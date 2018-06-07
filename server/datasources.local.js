module.exports = {
    "db": {
        "name": "mydb",
        "connector": "mysql",
        "host": process.env.MYSQL_HOST,
        "port": 3306,
        "database": process.env.MYSQL_DB,
        "password": process.env.MYSQL_PASSWORD,
        "user": process.env.MYSQL_USER
    }
};
