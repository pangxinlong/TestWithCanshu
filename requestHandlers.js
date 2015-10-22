/**
 *  信鸽推送
 * @type {exports}
 */
var Xinge = require('lib/Xinge');

var accessId  = 2100109886;//2100003306
var secretKey = '2be337a420e1095cd860515df87b85c3';//46cfadd7101f1dc4d1e2eee5e07632fe
var XingeApp = new Xinge.XingeApp(accessId, secretKey);

//Android message start.
var style = new Xinge.Style();
style.ring = 1;
style.vibrate = 0;
style.ringRaw = 'a';
style.smallIcon = 'b';
style.builderId = 77;

var action = new Xinge.ClickAction();
action.actionType = Xinge.ACTION_TYPE_ACTIVITY;
//action.packageName.packageName = 'com.demo.xg';
//action.packageName.packageDownloadUrl = 'http://a.com';
//action.packageName.confirm = 1;

var androidMessage = new Xinge.AndroidMessage();
androidMessage.type = Xinge.MESSAGE_TYPE_NOTIFICATION;
//androidMessage.title = '有新消息了';
//androidMessage.content = 'v';
androidMessage.style = style;
androidMessage.action = action;
androidMessage.sendTime = Date.parse('2014-02-19 15:33:30') / 1000;
androidMessage.expireTime = 0;
//androidMessage.acceptTime.push(new Xinge.TimeInterval(0, 0, 23, 59));
//androidMessage.customContent = {
//	'name': 'huangnaiang'
//};
androidMessage.multiPkg = 0;
//androidMessage.loopTimes = 3;
//androidMessage.loopInterval = 2;
//And message end.

var content;

/**
 * 存放不同得处理程序，和请求得url相对应
 */
function start(response) {
    console.log("Request handler 'start' was called.");
}

function upload(response) {
    console.log("Request handler 'upload' was called.");
}


/**
 *  **************登录****************
 **/
function login(request, response) {
    console.log("Request handler ‘login’ was called");

    var mysql = require('mysql');
    var qs = require('querystring');
    var http = require('http');
    var url = require("url");


    var TEST_DATABASE = 'test';
    var TEST_TABLE = 'user';

//创建连接
    var client = mysql.createConnection({
        user: 'root',
        password: '',
        database: 'test'
    });
//连接数据库
    client.connect();


//获取get请求中得参数
    /*   var arg = url.parse(request.url).query;          //arg => user=a&password=5
     console.log("Request for " + arg );
     var str = qs.parse(arg);                //str=> {user:'a',password:'5'}

     var arg1 = url.parse(request.url, true).query;   //arg1 => {user:'a',password:'5'}
     console.log("Request for " + str );

     var user = qs.parse(arg).user;         //user => a
     console.log("user = "+user);

     var password = qs.parse(arg).password;
     console.log("password = "+password);

     response.end(JSON.stringify({
     state:"success!"
     }));
     */

//获取post请求数据name，password
    if (request.method == 'POST') {
        var info = '';

        request.addListener('data', function (chunk) {

            info += chunk;

        })

            .addListener('end', function () {

                info = qs.parse(info);
                response.setHeader('content-type', 'application/Json ; charset=UTF-8');
                //锁定参数字段
                if (info.user_id != null && info.pwd != null) {
                    client.query("use " + TEST_DATABASE);
                    //查询数据库
                    client.query(
                            'select * from ' + TEST_TABLE + ' where user_id=\'' + info.user_id + '\'',
                        function selectCb(err, results) {
                            if (err) {
                                throw err;
                                console.log(err);
                            }

                            if (results) {
                                console.log("results:" + results)
                                console.log(results);
                                if (results != "") {
                                    if ((results[0].state == 0)) {
                                        if ((results[0].password == info.pwd)) {
                                            response.end('{\"State\":\"0\",\"Message\":\"success\"}');
                                            console.log("%s", "success!");


                                        } else {
                                            response.end('{\"State\":\"1001\",\"Message\":\"密码错误\"}');
                                        }
                                    } else {
                                        response.end('{\"State\":\"1000\",\"Message\":\"此用户没有被激活\"}');
                                    }
                                } else {
                                    response.end('{\"State\":\"1002\",\"Message\":\"用户不存在\"}');
                                }
                            }
                            client.end();
                        }
                    );
                } else {
                    response.end('{\"State\":\"4000\",\"Message\":\"参数错误\"}');
                }


            })
    } else {
        response.end('{\"State\":\"4001\",\"Message\":\"Request error\"}');
    }


}

function login_post(request, response) {
    var http = require('http');
    request.setEncoding('utf8');//请求编码


    var firstPage = function (request) {

        request.writeHead(200, {'Content-Type': 'text/html', 'charset': 'utf8'});

        var html = '<html><body>' +

            '<form action="/login" method="post">' +

            'userid:<input type="text" name="user_id"> </br>' +

            'password:<input type="password" name="pwd"></br>' +

            '<input type="submit" value="login">' +

            '</form>' +

            '</body></html>';

        request.end(html);

    }
    return firstPage(response);
}


/**
 *  **************注册****************
 **/
function registration(request, response) {
    console.log("Request handler ‘registration’ was called");

    var mysql = require('mysql');
    var qs = require('querystring');
    var http = require('http');
    var url = require("url");


    var TEST_DATABASE = 'test';
    var TEST_TABLE = 'user';

//创建连接
    var client = mysql.createConnection({
        user: 'root',
        password: '',
        database: 'test',
        charset: 'UTF8_GENERAL_CI'
    });
//连接数据库
    client.connect();

//获取post请求数据name，password
    if (request.method == 'POST') {
        var info = '';
        request.setEncoding("utf8");
        request.addListener('data', function (chunk) {
            console.log("chunk==" + chunk);
            info += chunk;

        })

            .addListener('end', function () {
                var state = 0;
                info = qs.parse(info);
                response.setHeader('content-type', 'application/Json ;charset=UTF-8');
                //锁定参数字段
                if (info.type != null && info.user_id != null && info.pwd != null && info.name != null && info.nickname != null && info.sex != null && info.professional != null && info.icon_path != null && info.contact_information != null && info.grade != null) {
                    //检测注册账户类别
                    if (info.type == 1) {
                        info.user_id = "a" + info.user_id;
                        state = 1;
                    }

                    client.query("use " + TEST_DATABASE);
                    //查询数据库
                    client.query(
                            'select * from ' + TEST_TABLE + ' where user_id=\'' + info.user_id + '\'',
                        function selectCb(err, results) {
                            if (err) {
                                throw err;
                                console.log(err);
                            }

                            if (results) {
                                console.log("results:" + results)
                                console.log(results);
                                if (results != "") {
                                    response.end('{\"State\":\"2000\",\"Message\":\"用户已被注册\"}');
                                } else {
                                    // if (info.icon_path != "") {
                                    //     icon_path = "/Users/password/MyJs/Test/RequireDemo/TestWithCanshu/image/test.png";
                                    // }
                                    //插入数据
                                    console.log('插入数据');
                                    var sql = "insert into user set user_id=?, password=?,name=?,nickname=?,sex=?,professional=?,type=?,state=?,icon=?,contact_information=?,info.grade=?",
                                        values = [info.user_id, info.pwd, info.name, info.nickname, info.sex, info.professional, info.type, info.state, info.icon_path, info.contact_information, info.info.grade];
                                    client.query(sql, values, function (error, res) {
                                        if (error) {
                                            console.log("插入记录出错: " + error.message);
                                            client.end();
                                            return;
                                        }
                                        console.log(res);
                                        response.end('{\"State\":\"0\",\"Message\":\"success\"}');
                                    });
                                }
                            }
                            client.end();
                        }
                    );
                } else {
                    response.end('{\"State\":\"4000\",\"Message\":\"Parameter error\"}');
                }
            })
    } else {
        response.end('{\"State\":\"4001\",\"Message\":\"Request error\"}');
    }

}

function registration_post(request, response) {
    var http = require('http');
    request.setEncoding('utf8');//请求编码


    var firstPage = function (request) {


        request.writeHead(200, {'Content-Type': 'text/html', 'charset': 'UTF-8'});

        var html = '<html><meta http-equiv="content-type" content="text/html; charset=UTF-8" /><body>' +

            '<form action="/registration" method="post">' +

            'userid:<input type="text" name="user_id"> </br>' +
            'password:<input type="password" name="pwd"></br>' +
            'name:<input type="text" name="name"> </br>' +
            'sex:<input type="text" name="sex"></br>' +
            'nickname:<input type="text" name="nickname"></br>' +
            'type:<input type="text" name="type"></br>' +
            'professional:<input type="text" name="professional"></br>' +
            'icon_path:<input type="text" name="icon_path"></br>' +
            'contact_information:<input type="text" name="contact_information"></br>' +
            '<input type="submit" value="requestHandlers">' +

            '</form>' +

            '</body></html>';

        request.end(html);

    }
    return firstPage(response);
}


/**
 *  ************** 设置 ****************
 **/


//*查看个人资料*
function query_acount(request, response) {
    console.log("Request handler ‘change_acount’ was called");

    var mysql = require('mysql');
    var qs = require('querystring');
    var http = require('http');
    var url = require("url");


    var TEST_DATABASE = 'test';
    var TEST_TABLE = 'user';

//创建连接
    var client = mysql.createConnection({
        user: 'root',
        password: '',
        database: 'test',
        charset: 'UTF8_GENERAL_CI'
    });
//连接数据库
    client.connect();

//获取post请求数据name，password
    if (request.method == 'POST') {
        var info = '';
        request.setEncoding("utf8");
        request.addListener('data', function (chunk) {
            console.log("chunk==" + chunk);
            info += chunk;

        })

            .addListener('end', function () {

                info = qs.parse(info);
                response.setHeader('content-type', 'application/Json ;charset=UTF-8');

                if (info.user_id != null) {
                    client.query("use " + TEST_DATABASE);
                    //查询数据库
                    client.query(
                            'select * from ' + TEST_TABLE + ' where user_id=\'' + info.user_id + '\'',
                        function selectCb(err, results) {
                            if (err) {
                                throw err;
                                console.log(err);
                            }

                            if (results) {
                                console.log(results);
                                response.end('{\"State\":\"0\",\"Message\":\"success\",\"result\":' + JSON.stringify(results) + '}');
                            }
                            client.end();
                        }
                    );
                } else {
                    response.end('{\"State\":\"4000\",\"Message\":\"Parameter error\"');
                }
            })
    } else {
        response.end('{\"State\":\"4001\",\"Message\":\"Request error\"');
    }

}


function query_acount_post(request, response) {
    var http = require('http');
    request.setEncoding('utf8');//请求编码


    var firstPage = function (request) {


        request.writeHead(200, {'Content-Type': 'text/html', 'charset': 'UTF-8'});

        var html = '<html><meta http-equiv="content-type" content="text/html; charset=UTF-8" /><body>' +

            '<form action="/query_acount" method="post">' +

            'user_id:<input type="text" name="user_id"> </br>' +
            '<input type="submit" value="requestHandlers">' +

            '</form>' +

            '</body></html>';

        request.end(html);

    }
    return firstPage(response);
}


//*修改个人资料*

function change_acount(request, response) {
    console.log("Request handler ‘change_acount’ was called");

    var mysql = require('mysql');
    var qs = require('querystring');
    var http = require('http');
    var url = require("url");


    var TEST_DATABASE = 'test';
    var TEST_TABLE = 'user';

//创建连接
    var client = mysql.createConnection({
        user: 'root',
        password: '',
        database: 'test',
        charset: 'UTF8_GENERAL_CI'
    });
//连接数据库
    client.connect();

//获取post请求数据name，password
    if (request.method == 'POST') {
        var info = '';
        request.setEncoding("utf8");
        request.addListener('data', function (chunk) {
            console.log("chunk==" + chunk);
            info += chunk;

        })

            .addListener('end', function () {

                info = qs.parse(info);
                response.setHeader('content-type', 'application/Json ;charset=UTF-8');
                if (info.user_id != null && info.pwd != null && info.nickname != null, info.sex != null && info.professional != null && info.icon_path != null && info.grade != null && info.contact_information != null) {
                    client.query("use " + TEST_DATABASE);
                    //查询数据库             ',name=\''+info.name+'\
                    client.query(
                            'update ' + TEST_TABLE + ' set  password=\'' + info.pwd + '\',nickname=\'' + info.nickname + '\',sex=\'' + info.sex + '\',professional=\'' + info.professional + '\',icon=\'' + info.icon_path + '\',grade=\'' + info.grade + '\',contact_information=\'' + info.contact_information + '\' where user_id=\'' + info.user_id + '\'',
                        function selectCb(err, results) {
                            if (err) {
                                throw err;
                                console.log(err);
                            }

                            if (results) {
                                console.log(results);
                                response.end(response.end('{\"State\":\"0\",\"Message\":\"success\"}'));
                            }
                            client.end();
                        }
                    );
                } else {
                    response.end('{\"State\":\"4000\",\"Message\":\"Parameter error\"}');
                }
            })
    } else {
        response.end('{\"State\":\"4001\",\"Message\":\"Request error\"');
    }

}


function change_acount_post(request, response) {
    var http = require('http');
    request.setEncoding('utf8');//请求编码


    var firstPage = function (request) {


        request.writeHead(200, {'Content-Type': 'text/html', 'charset': 'UTF-8'});

        var html = '<html><meta http-equiv="content-type" content="text/html; charset=UTF-8" /><body>' +

            '<form action="/change_acount" method="post">' +

            'user_id:<input type="text" name="user_id"> </br>' +
            'password:<input type="password" name="pwd"></br>' +
            'name:<input type="password" name="name"></br>' +
            'sex:<input type="text" name="sex"></br>' +
            'nickname:<input type="text" name="nickname"></br>' +
            'professional:<input type="text" name="professional"></br>' +
            '<input type="submit" value="requestHandlers">' +
            '</form>' +

            '</body></html>';

        request.end(html);

    }
    return firstPage(response);
}


/**
 *  ************** 活动 ****************
 **/

//*查询所有活动*
function query_activity(request, response) {
    console.log("Request handler ‘change_acount’ was called");

    var mysql = require('mysql');
    var qs = require('querystring');
    var http = require('http');
    var url = require("url");


    var TEST_DATABASE = 'test';
    var TEST_TABLE = 'activity';

//创建连接
    var client = mysql.createConnection({
        user: 'root',
        password: '',
        database: 'test',
        charset: 'UTF8_GENERAL_CI'
    });
//连接数据库
    client.connect();

//获取post请求数据name，password
    if (request.method == 'POST') {
        var info = '';
        request.setEncoding("utf8");
        request.addListener('data', function (chunk) {
            console.log("chunk==" + chunk);
            info += chunk;

        })

            .addListener('end', function () {

                response.setHeader('content-type', 'application/Json ;charset=UTF-8');
                var pageSize=4;
                info = qs.parse(info);

                //默认安时间排
                var sql = 'select * from ' + TEST_TABLE + ' order by date desc limit ' +info.pagestart+','+info.pageposition;
                //按用户id查询
                if (info.user_id != null) {
                    sql = 'select * from ' + TEST_TABLE + ' where user_id=' + info.user_id + ' order by date desc limit ' +info.pagestart+','+info.pageposition;
                    console.log('type=======' + info.user_id);
                }
                //按用户类型排序
                if (info.type != null) {
                    sql = 'select * from activity where user_id in (select user_id from user where type=' + info.type + ') order by date desc limit ' +info.pagestart+ ','+info.pageposition;
                    console.log('type=======' + info.type);

                }
                //按活动类型排序
                if (info.activity_type != null) {
                    sql = 'select * from ' + TEST_TABLE + ' where activity_type=' + info.activity_type + ' order by date desc limit ' +info.pagestart+','+info.pageposition;
                    console.log('activity_type=======' + info.activity_type);

                }

                console.log('sql=======' + sql);
                client.query("use " + TEST_DATABASE);
                //查询数据库
                client.query(sql, function selectCb(err, results) {
                        if (err) {
                            throw err;
                            console.log(err);
                        }

                        if (results) {
                            console.log(results);
                            console.log(JSON.stringify(results));
                            var str = '{\"State\":\"0\",\"Message\":\"success\",\"result\":' + JSON.stringify(results) + '}';

                            response.end(str);
                        }
                        client.end();
                    }
                );

            })
    } else {
        response.end('{\"State\":\"4001\",\"Message\":\"Request error\"');
    }

}

function query_activity_post(request, response) {
    var http = require('http');
    request.setEncoding('utf8');//请求编码


    var firstPage = function (request) {


        request.writeHead(200, {'Content-Type': 'text/html', 'charset': 'UTF-8'});

        var html = '<html><meta http-equiv="content-type" content="text/html; charset=UTF-8" /><body>' +

            '<form action="/query_activity" method="post">' +

            //   'type:<input type="text" name="type"> </br>' +
            //    'activity_type:<input type="text" name="activity_type"> </br>' +
            '<input type="submit" value="post">' +
            '</form>' +

            '</body></html>';

        request.end(html);

    }
    return firstPage(response);
}

//*发布活动*
function create_activity(request, response) {
    console.log("Request handler ‘change_acount’ was called");

    var mysql = require('mysql');
    var qs = require('querystring');
    var http = require('http');
    var url = require("url");


    var TEST_DATABASE = 'test';
    var TEST_TABLE = 'activity';

//创建连接
    var client = mysql.createConnection({
        user: 'root',
        password: '',
        database: 'test',
        charset: 'UTF8_GENERAL_CI'
    });
//连接数据库
    client.connect();

//获取post请求数据name，password
    if (request.method == 'POST') {
        var info = '';
        request.setEncoding("utf8");
        request.addListener('data', function (chunk) {
            console.log("chunk==" + chunk);
            info += chunk;

        })

            .addListener('end', function () {
                var image_path;
                info = qs.parse(info);
                response.setHeader('content-type', 'application/Json ;charset=UTF-8');

                if (info.user_id != null && info.name != null && info.activity_type != null && info.title != null && info.content != null && info.date != null && info.contact_information != null && info.image_path != null) {
                    var sql = 'insert into ' + TEST_TABLE + ' set activity_id=?, user_id=?, name=?, activity_type=?, title=?, content=?, date=?, contact_information=?, image_path=?',
                        values = [info.user_id + info.date, info.user_id, info.name, info.activity_type, info.title, info.content, info.date, info.contact_information, info.image_path];
                    client.query("use " + TEST_DATABASE);
                    //查询数据库
                    console.log('sql======' + sql);
                    client.query(sql, values, function selectCb(err, results) {
                            if (err) {
                                throw err;
                                console.log(err);
                            }

                            if (results) {
                                console.log(results);
                                response.end('{\"State\":\"0\",\"Message\":\"success\"}');

                                androidMessage.content =info.content;
                                androidMessage.title = info.title;
                                //推送消息给指定设备
                                XingeApp.pushToSingleDevice('75f772f9281ed41c43abaa6dddfe56e23f528bcc', androidMessage, function(err, result){//29c38d06591ed0e643c48a0092f495a2a1c91ae9   Xinge.IOS_ENV_DEV,
                                    console.log(result);
                                });

                            }
                            client.end();
                        }
                    );
                } else {
                    response.end('{\"State\":\"4000\",\"Message\":\"Parameter error\"');
                }


            });
    } else {
        response.end('{\"State\":\"4001\",\"Message\":\"Request error\"');
    }

}


function create_activity_post(request, response) {
    var http = require('http');
    request.setEncoding('utf8');//请求编码


    var firstPage = function (request) {


        request.writeHead(200, {'Content-Type': 'text/html', 'charset': 'UTF-8'});

        var html = '<html><meta http-equiv="content-type" content="text/html; charset=UTF-8" /><body>' +

            '<form action="/create_activity" method="post">' +
            'activity_type:<input type="text" name="activity_type"> </br>' +
            'title:<input type="text" name="title"> </br>' +
            'content:<input type="text" name="content"> </br>' +
            'date:<input type="text" name="date"> </br>' +
            'name:<input type="text" name="name"> </br>' +
            'contact_information:<input type="text" name="contact_information"> </br>' +
            'user_id:<input type="text" name="user_id"> </br>' +
            'image:<input type="text" name="image_path"> </br>' +
            '<input type="submit" value="post">' +
            '</form>' +

            '</body></html>';

        request.end(html);

    }
    return firstPage(response);
}

// *活动详情*
function activity_detail(request, response) {
    console.log("Request handler ‘change_acount’ was called");

    var mysql = require('mysql');
    var qs = require('querystring');
    var http = require('http');
    var url = require("url");


    var TEST_DATABASE = 'test';
    var TEST_TABLE = 'activity';

//创建连接
    var client = mysql.createConnection({
        user: 'root',
        password: '',
        database: 'test',
        charset: 'UTF8_GENERAL_CI'
    });
//连接数据库
    client.connect();

//获取post请求数据name，password
    if (request.method == 'POST') {
        var info = '';
        request.setEncoding("utf8");
        request.addListener('data', function (chunk) {
            console.log("chunk==" + chunk);
            info += chunk;

        })

            .addListener('end', function () {

                info = qs.parse(info);
                response.setHeader('content-type', 'application/Json ;charset=UTF-8');


                if (info.activity_id != null) {
                    var sql = 'select * from ' + TEST_TABLE + ' where activity_id=\'' + info.activity_id + '\'';
                    client.query("use " + TEST_DATABASE);
                    //查询数据库
                    client.query(sql, function selectCb(err, results) {
                            console.log('sql======' + sql);
                            if (err) {
                                throw err;
                                console.log(err);
                            }

                            if (results) {
                                console.log(results);
                                response.end('{\"State\":\"0\",\"Message\":\"success\",\"result\":' + JSON.stringify(results) + '}');
                            }
                            client.end();
                        }
                    );
                } else {
                    response.end('{\"State\":\"4000\",\"Message\":\"Parameter error\"');
                }

            });
    } else {
        response.end('{\"State\":\"4001\",\"Message\":\"Request error\"');
    }

}

function activity_detail_post(request, response) {
    var http = require('http');
    request.setEncoding('utf8');//请求编码


    var firstPage = function (request) {
        request.writeHead(200, {'Content-Type': 'text/html', 'charset': 'UTF-8'});
        var html = '<html><meta http-equiv="content-type" content="text/html; charset=UTF-8" /><body>' +
            '<form action="/activity_detail" method="post">' +
            'activity_id:<input type="text" name="activity_id"> </br>' +
            '<input type="submit" value="post">' +
            '</form>' +
            '</body></html>';
        request.end(html);
    }
    return firstPage(response);
}


// *删除活动*
function activity_delete(request, response) {
    console.log("Request handler ‘change_acount’ was called");

    var mysql = require('mysql');
    var qs = require('querystring');
    var http = require('http');
    var url = require("url");


    var TEST_DATABASE = 'test';
    var TEST_TABLE = 'activity';

//创建连接
    var client = mysql.createConnection({
        user: 'root',
        password: '',
        database: 'test',
        charset: 'UTF8_GENERAL_CI'
    });
//连接数据库
    client.connect();

//获取post请求数据name，password
    if (request.method == 'POST') {
        var info = '';
        request.setEncoding("utf8");
        request.addListener('data', function (chunk) {
            console.log("chunk==" + chunk);
            info += chunk;

        })

            .addListener('end', function () {

                info = qs.parse(info);
                response.setHeader('content-type', 'application/Json ;charset=UTF-8');
                if (info.user_id != null && info.activity_id != null) {
                    var sql = 'select user_id from ' + TEST_TABLE + ' where activity_id=\'' + info.activity_id + '\'';
                    client.query("use " + TEST_DATABASE);
                    //查询数据库
                    client.query(sql, function selectCb(err, results) {
                            console.log('sql======' + sql);
                            if (err) {
                                throw err;
                                console.log(err);
                            }

                            if (results) {
                                console.log(results);
                                if (results[0].user_id == info.user_id) {
                                    sql = 'delete from ' + TEST_TABLE + ' where activity_id=\'' + info.activity_id + '\'';
                                    client.query(sql, function selectCb(err, results) {
                                        if (err) {
                                            throw err;
                                            console.log(err);
                                        }
                                        if (results) {
                                            console.log(results)
                                            response.end('{\"State\":\"0\",\"Message\":\"success\"}');
                                        }
                                    });
                                }
                                else {
                                    response.end('{\"State\":\"3000\",\"Message\":\" No permission\"}');
                                }
                            }
                            client.end();
                        }
                    );
                } else {
                    response.end('{\"State\":\"4000\",\"Message\":\"Parameter error\"');
                }


            });
    } else {
        response.end('{\"State\":\"4001\",\"Message\":\"Request error\"');
    }

}


function activity_delete_post(request, response) {
    var http = require('http');
    request.setEncoding('utf8');//请求编码

    var firstPage = function (request) {

        request.writeHead(200, {'Content-Type': 'text/html', 'charset': 'UTF-8'});

        var html = '<html><meta http-equiv="content-type" content="text/html; charset=UTF-8" /><body>' +
            '<form action="/activity_delete" method="post">' +
            'user_id:<input type="text" name="user_id"> </br>' +
            'activity_id:<input type="text" name="activity_id"> </br>' +
            '<input type="submit" value="post">' +
            '</form>' +
            '</body></html>';
        request.end(html);
    }
    return firstPage(response);
}


/**
 * 保存图片
 * @param request
 * @param response
 */
function save_image(request, response) {
    /*    var fs = require("fs")
     var qs = require('querystring');
     var info = '';
     request.setEncoding("utf8");
     request.addListener('data', function (chunk) {
     //   console.log("chunk==" + chunk);
     info += chunk;

     })

     .addListener('end', function () {
     info = qs.parse(info);
     response.end('{State:0,Message:0,result[]}');
     console.log('info======'+info);
     // console.log(JSON.stringify(info));
     });
     */
    //    fs.renameSync(info.file.path, "/Users/password/MyJs/Test/RequireDemo/TestWithCanshu/image/test.png"); //winodw认的路径，nodejs的安装路径
    var user_Id = "", date = "", new_path = "";
    var real_path = "";
    var fs = require("fs"), formidable = require("formidable");
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function (error, fields, files) {
        console.log("parsing done");
        if (error) {
            throw (error);
            console.log(error);
        }
        if (files != null) {
            console.log('josn:' + JSON.stringify(files));
            if (files.file != null) {
                console.log('files.file.name============' + files.file.name);
                console.log(files.file.path);
//                if (files.userId != null && files.date != null) {
//                    console.log('files.userId.name============' + files.userId.name);
//                    user_Id = files.userId.name;
//
//                    console.log('files.date.name============' + files.date.name);
//                    date = files.date.name;
//
//                } else {
//                    response.end('{\"State\":4000,\"Message\":\"Parameter error\"}');
//                }
                new_path = "/Users/password/MyJs/Test/RequireDemo/TestWithCanshu/image/" + files.file.name;
                fs.renameSync(files.file.path, new_path); //winodw认的路径，nodejs的安装路径
                real_path = "/image/" + files.file.name;
                response.end('{\"State\":\"0\",\"Message\":\"success\",\"results\":{\"image_path\":' + JSON.stringify(real_path) + '}}');//[image:' + new_path + ']
            } else {
                response.end('{\"State\":\"4000\",\"Message\":\"Parameter error\"}');
            }
        } else {
            response.end('{\"State\":\"0\",\"Message\":\"success\",\"results\":{\"image_path\":' + JSON.stringify(real_path) + '}}');
        }
        /*
         var fs = require("fs"),formidable = require("formidable");
         var form = new formidable.IncomingForm();
         console.log("about to parse");
         form.parse(request, function(error, fields, files) {
         console.log("parsing done");
         if(error){
         throw error;
         console.log(error);
         }if(files!=null){
         }
         //  console.log('files============',files.file);
         file_path=files.image.path;
         //   console.log(files.file.path);
         files_path=files.upload.path.name;

         console.log('files.name==========='+files.getElementsByName(files));()
         fs.renameSync(files.file.path, "/Users/password/MyJs/Test/RequireDemo/TestWithCanshu/image/"+info.user_id+info.date+".png"); //winodw认的路径，nodejs的安装路径
         response.writeHead(200, {"Content-Type": "text/html"});
         response.write("received image:<br/>");
         response.write("<img src='/show' />");
         response.end();
         */
    });


}
function image_post(request, response) {
    var firstPage = function (request) {
        request.writeHead(200, {'Content-Type': 'text/html', 'charset': 'UTF-8'});
        var body = '<html>' +
            '<head>' +
            '<meta http-equiv="Content-Type" content="text/html; ' +
            'charset=UTF-8" />' +
            '</head>' +
            '<body>' +
            '<form action="/save_image" enctype="multipart/form-data" ' +
            'method="post">' +
            //    '<input type="hidden" name="user_id" value="1"/>' +
            //    '<input type="hidden" name="date" value="2014"/>' +
            '<input type="file" name="file" multiple="multiple">' +
            '<input type="submit" value="Upload file" />' +
            '</form>' +
            '</body>' +
            '</html>';
        request.end(body);
    }
    return firstPage(response);
}

function show(request, response) {
    console.log("Request handler 'show' was called.");
    //winodw认的路径，nodejs的安装路径
    var fs = require("fs");
    fs.readFile("/Users/password/MyJs/Test/RequireDemo/TestWithCanshu/image/test.png", "binary", function (error, file) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        } else {
            response.write(file, "binary");
            response.end();
        }
    });
}

/**
 *  **************注册账号激活****************
 **/
function registration_activation(request, response) {
    console.log("Request handler ‘registration’ was called");

    var mysql = require('mysql');
    var qs = require('querystring');
    var http = require('http');
    var url = require("url");


    var TEST_DATABASE = 'test';
    var TEST_TABLE = 'user';

//创建连接
    var client = mysql.createConnection({
        user: 'root',
        password: '',
        database: 'test',
        charset: 'UTF8_GENERAL_CI'
    });
//连接数据库
    client.connect();

//获取post请求数据name，password
    if (request.method == 'POST') {
        var info = '';
        request.setEncoding("utf8");
        request.addListener('data', function (chunk) {
            console.log("chunk==" + chunk);
            info += chunk;

        })

            .addListener('end', function () {
                var state = 0;
                info = qs.parse(info);
                response.setHeader('content-type', 'application/Json ;charset=UTF-8');
                //锁定参数字段
                if (info.user_id != null) {
                    client.query("use " + TEST_DATABASE);
                    //查询数据库
                    client.query(
                            'update ' + TEST_TABLE + ' set state=' + state + ' where user_id=\'' + info.user_id + '\'',
                        function selectCb(err, results) {
                            if (err) {
                                throw err;
                                console.log(err);
                            }
                            if (results) {
                                console.log("results:" + results)
                                console.log(results);
                                response.end('{\"State\":\"0\",\"Message\":\"success\"}');
                            }
                            client.end();
                        }
                    );
                } else {
                    response.end('{\"State\":4000,\"Message\":\"Parameter error\"}');
                }
            })
    } else {
        response.end('{\"State\":4001,\"Message\":\"Request error\"}');
    }

}

function registration_activation_post(request, response) {
    var http = require('http');
    request.setEncoding('utf8');//请求编码


    var firstPage = function (request) {


        request.writeHead(200, {'Content-Type': 'text/html', 'charset': 'UTF-8'});

        var html = '<html><head><h1>请输入要激活的账号</h1></head>' +
            '<meta http-equiv="content-type" content="text/html; charset=UTF-8" /><body>' +
            '<form action="/registration_activation" method="post">' +
            'userid:<input type="text" name="user_id"> </br>' +
            '<input type="submit" value="requestHandlers">' +
            '</form>' +
            '</body></html>';
        request.end(html);

    }

    return firstPage(response);
}


exports.start = start;
exports.upload = upload;

exports.login = login;
exports.login_post = login_post;

exports.registration = registration;
exports.registration_post = registration_post;

exports.query_acount = query_acount;
exports.query_acount_post = query_acount_post;

exports.change_acount = change_acount;
exports.change_acount_post = change_acount_post;

exports.query_activity = query_activity;
exports.query_activity_post = query_activity_post;

exports.create_activity = create_activity;
exports.create_activity_post = create_activity_post;

exports.activity_detail = activity_detail;
exports.activity_detail_post = activity_detail_post;

exports.activity_delete = activity_delete;
exports.activity_delete_post = activity_delete_post;

exports.save_image = save_image;
exports.image_post = image_post;
exports.show = show;

exports.registration_activation = registration_activation;
exports.registration_activation_post = registration_activation_post;


