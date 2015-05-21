//路由模块，针对不同的请求，做出不同的相应
//handle 处理请求方法
function route(handle, pathname,request,response,postData) {
  console.log("About to route a request for " + pathname);

  // 检查给定的路径对应的请求处理程序是否存在，如果存在的话直接调用相应的函数
   // console.log(handle);
  if (typeof handle[pathname] == "function") {
    handle[pathname](request,response,postData);
  } else {
    console.log("No request handler found for " + pathname);
      response.writeHead(404, {"Content-Type": "text/html;charset=UTF-8"});
      response.write("404 Not found");
      response.end();
  }
}

exports.route = route;
