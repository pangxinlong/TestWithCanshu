var server = require("./server"),
  router = require("./router"),
  requestHandlers = require("./requestHandlers");

// handle 保存不同请求路径对应的处理方法
var handle = {};

handle["/"] = requestHandlers.login;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/login"]=requestHandlers.login;
handle["/login_post"]=requestHandlers.login_post;

handle["/registration"]=requestHandlers.registration;
handle["/registration_post"]=requestHandlers.registration_post;

handle["/query_acount"]=requestHandlers.query_acount;
handle["/query_acount_post"]=requestHandlers.query_acount_post;

handle["/change_acount"]=requestHandlers.change_acount;
handle["/change_acount_post"]=requestHandlers.change_acount_post;

handle["/query_activity"]=requestHandlers.query_activity;
handle["/query_activity_post"]=requestHandlers.query_activity_post;

handle["/create_activity"]=requestHandlers.create_activity;
handle["/create_activity_post"]=requestHandlers.create_activity_post;

handle["/activity_detail"]=requestHandlers.activity_detail;
handle["/activity_detail_post"]=requestHandlers.activity_detail_post;

handle["/activity_delete"]=requestHandlers.activity_delete;
handle["/activity_delete_post"]=requestHandlers.activity_delete_post;

handle["/save_image"]=requestHandlers.save_image;
handle["/image_post"]=requestHandlers.image_post;
handle["/show"]=requestHandlers.show;

handle["/registration_activation"]=requestHandlers.registration_activation;
handle["/registration_activation_post"]=requestHandlers.registration_activation_post;
// 传入路由模块方法, 路径处理方法
server.start(router.route, handle);