  // 时间处理函数
  const crtTimeFtt = function(val, row) {
    if (val != null) {
      var date = new Date(val);
      return (
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds()
      );
    }
  }

  export default crtTimeFtt

