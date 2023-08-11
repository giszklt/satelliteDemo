import Vue from 'vue';
let v = new Vue();
let times = {
  timestampToTime(timestamp, n) {
    //将时间戳更改为2018-10-01 12:20:30的格式
    var date = new Date(timestamp * n); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M =
      (date.getMonth() + 1 < 10 ?
        "0" + (date.getMonth() + 1) :
        date.getMonth() + 1);
    var dd = date.getDate();
    if (dd < 10) dd = "0" + dd;
    var hh = date.getHours();
    if (hh < 10) hh = "0" + hh;
    var mm = date.getMinutes();
    if (mm < 10) mm = "0" + mm;
    var ss = date.getSeconds();
    if (ss < 10) ss = "0" + ss;
    // var D = date.getDate() + " ";
    // var h = date.getHours() + ":";
    // var m = date.getMinutes() + ":";
    // var s = date.getSeconds();
    return Y + "-" + M + "-" + dd + " " + hh + ":" + mm + ":" + ss;
  },
  timestampToTime2(timestamp, n) {
    //将时间戳更改为2018-10-01 12:20:30的格式
    var date = new Date(timestamp * n); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M =
      (date.getMonth() + 1 < 10 ?
        "0" + (date.getMonth() + 1) :
        date.getMonth() + 1);
    var dd = date.getDate();
    if (dd < 10) dd = "0" + dd;
    var hh = date.getHours();
    if (hh < 10) hh = "0" + hh;
    var mm = date.getMinutes();
    if (mm < 10) mm = "0" + mm;
    var ss = date.getSeconds();
    if (ss < 10) ss = "0" + ss;
    // var D = date.getDate() + " ";
    // var h = date.getHours() + ":";
    // var m = date.getMinutes() + ":";
    // var s = date.getSeconds();
    return Y + "-" + M + "-" + dd + " " + hh + ":" + mm
  },
  MillisecondToTime(msd) {
    //毫秒变为分秒
    var time = parseFloat(msd) / 1000;
    if (null != time && "" != time) {
      time = parseInt(time / 60.0) + "分" + parseInt(time % 60.0) + "秒";
    }
    return time;
  },
  MillisecondToDate(msd) {
    //从毫秒到天数时分秒的换算
    let time = msd / 1000;
    let dd1 = parseInt(time / 60 / 60 / 24);
    let yy = parseInt(dd1 / 365);
    let dd = parseInt(dd1 % 365);
    let hh1 = parseInt(time % (60 * 60 * 24));
    let hh = parseInt(hh1 / 60 / 60);
    if (hh < 10) hh = "0" + hh;
    let mm = parseInt((hh1 % (60 * 60)) / 60);
    if (mm < 10) mm = "0" + mm;
    let ss = parseInt((hh1 % (60 * 60)) % 60);
    if (ss < 10) ss = "0" + ss;
    if (yy > 0) {
      time = yy + "年" + dd + "日" + hh + "时" + mm + "分" + ss + "秒";
    } else {
      time = dd + "日" + hh + "时" + mm + "分" + ss + "秒";
    }
    return time;
  },
  showLocale(objD, symbol) {
    //转换时间格式为
    var str, colorhead, colorfoot;
    var yy = objD.getYear();
    if (yy < 1900) yy = yy + 1900;
    var MM = objD.getMonth() + 1;
    if (MM < 10) MM = "0" + MM;
    var dd = objD.getDate();
    if (dd < 10) dd = "0" + dd;
    var hh = objD.getHours();
    if (hh < 10) hh = "0" + hh;
    var mm = objD.getMinutes();
    if (mm < 10) mm = "0" + mm;
    var ss = objD.getSeconds();
    if (ss < 10) ss = "0" + ss;
    var ww = objD.getDay();
    if (ww == 0) colorhead = "";
    if (ww > 0 && ww < 7) colorhead = "";
    if (symbol == "year") {
      str =
        colorhead +
        yy +
        "年" +
        MM +
        "月" +
        dd +
        "日   " +
        hh +
        "时" +
        mm +
        "分" +
        ss +
        "秒";
    } else if (symbol == "-") {
      str =
        colorhead + yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss;
    }
    return str;
  },
  stringToTime(str) {
    var timestamp = new Date(str);
    timestamp = timestamp.getTime();
    timestamp = timestamp / 1000;
    return timestamp
  },
  // 北京时间转为UTC方法
  toTimeUTC(str) {
    var timestamp = new Date(str);
    timestamp = timestamp.getTime();
    timestamp = timestamp / 1000;
    timestamp = timestamp - 8 * 60 * 60
    return timestamp
  },
  //UTC时间转为北京时间
  toTimeLocal(str) {
    var timestamp = new Date(str);
    timestamp = timestamp.getTime();
    timestamp = timestamp / 1000;
    timestamp = timestamp + 8 * 60 * 60
    return timestamp
  },
  //获取当前一周的时间
  getCurrentWeek() {
    let condition = [];
    let start = new Date(new Date().toLocaleDateString());
    let end = new Date(new Date().toLocaleDateString());
    start.setTime(start.getTime() - 3600 * 1000 * 24)
    end.setTime(end.getTime() + 3600 * 1000 * 24 * 7)
    start = this.parseTime(start)
    end = this.parseTime(end)
    condition.push(start)
    condition.push(end)
    return condition
  },
  //获取当前一天的时间
  getCurrentDay() {
    let condition = [];
    let start = new Date(new Date().toLocaleDateString());
    let end = new Date(new Date().toLocaleDateString());
    start.setTime(start.getTime())
    end.setTime(end.getTime() + 3600 * 1000 * 24)
    start = this.parseTime(start)
    end = this.parseTime(end)
    condition.push(start)
    condition.push(end)
    return condition
  },
  //获取未来两天的时间
  getTowNextDay() {
    let condition = [];
    let start = new Date(new Date().toLocaleDateString());
    let end = new Date(new Date().toLocaleDateString());
    start.setTime(start.getTime() + 3600 * 1000)
    end.setTime(end.getTime() + 3600 * 1000 * 48)
    start = this.parseTime(start)
    end = this.parseTime(end)
    condition.push(start)
    condition.push(end)
    return condition
  },
  getNextDay() {
    let condition = [];
    let start = new Date(new Date().toLocaleDateString());
    let end = new Date(new Date().toLocaleDateString());
    start.setTime(start.getTime() + 3600 * 1000 * 24)
    end.setTime(end.getTime() + 3600 * 1000 * 48)
    start = this.parseTime(start)
    end = this.parseTime(end)
    condition.push(start)
    condition.push(end)
    return condition
  },
  //民商星从获取当前的时刻开始
  getCurrentDayNow() {
    let condition = [];
    let start = new Date();
    let end = new Date();
    start.setTime(start.getTime())
    end.setTime(end.getTime() + 3600 * 1000 * 24)
    start = this.parseTime(start)
    end = this.parseTime(end)
    condition.push(start)
    condition.push(end)
    return condition
  },
  parseTime(d) {
    let month = d.getMonth() + 1;
    if (month < 10) {
      month = "0" + month
    }
    let day = d.getDate();
    if (day < 10) {
      day = "0" + day
    }
    let hour = d.getHours()
    if (hour < 10) {
      hour = "0" + hour
    }
    let minutes = d.getMinutes()
    if (minutes < 10) {
      minutes = "0" + minutes
    }
    let seconds = d.getSeconds()
    if (seconds < 10) {
      seconds = "0" + seconds
    }
    const newDate = d.getFullYear() + '-' + month + '-' + day + ' ' +
      hour + ':' + minutes + ':' + seconds;
    return newDate;
  }
};

let tool = {
  removeDuplicatedItem(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
      for (var j = i + 1; j < arr.length; j++) {
        if (arr[i] == arr[j]) {

          arr.splice(j, 1);
          j--;
        }
      }
    }
    return arr;
  },
  randomNum(minNum, maxNum) {
    switch (arguments.length) {
      case 1:
        return parseInt(Math.random() * minNum + 1, 10);
        break;
      case 2:
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
        break;
      default:
        return 0;
        break;
    }
  },
  toChinesNum(num) {
    let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; //changeNum[0] = "零"
    let unit = ["", "十", "百", "千", "万"];
    num = parseInt(num);
    let getWan = (temp) => {
      let strArr = temp.toString().split("").reverse();
      let newNum = "";
      for (var i = 0; i < strArr.length; i++) {
        newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
      }
      return newNum;
    }
    let overWan = Math.floor(num / 10000);
    let noWan = num % 10000;
    if (noWan.toString().length < 4) noWan = "0" + noWan;
    return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
  }
};
let regular = {
  regx(classN) {
    $(classN + " .el-input__inner").each(function () {
      $(this).change(function () {
        let m = this.value;
        if (m != "") {
          if (classN == ".positiveIn") { //正整数
            $(this).parent().parent().find("i.addI").remove();
            if (/^([1-9]\d*|[0]{1,1})$/.test(m) == false) {
              $(this).parent().parent().append("<i class='addI'>请输入正整数数字</i>")
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".msClass") { //毫秒
            $(this).parent().parent().find("i.addI").remove();
            if (/^([1-9]\d*|[0]{1,1})$/.test(m) == false) {
              $(this).parent().parent().append("<i class='addI'>请输入正整数数字</i>")
            } else if (m < 0 || m > 999) {
              $(this).parent().parent().append("<i class='addI'>请输入0~999的正整数数字</i>");
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".second") { //分/秒
            $(this).parent().parent().find("i.addI").remove();
            if (/^([1-9]\d*|[0]{1,1})$/.test(m) == false) {
              $(this).parent().parent().append("<i class='addI'>请输入正整数数字</i>")
            } else if (m < 0 || m > 60) {
              $(this).parent().parent().append("<i class='addI'>请输入0~60的正整数数字</i>");
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".num65000") { //0~65000的整数
            $(this).parent().parent().find("i.addI").remove();
            if (/^([1-9]\d*|[0]{1,1})$/.test(m) == false) {
              $(this).parent().parent().append("<i class='addI'>请输入正整数数字</i>")
            } else if (m < 0 || m > 65535) {
              $(this).parent().parent().append("<i class='addI'>0~65535</i>");
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".floating") { //正浮点数
            $(this).parent().parent().find("i.addI").remove();
            if (/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(m) == false) {
              var str = "<i class='addI'>请输入非负浮点数</i>"
              $(this).parent().parent().append(str);
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".floatings") { //正浮点数
            $(this).parent().parent().find("i.addI").remove();
            if (/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(m) == false) {
              var str = "<i class='addI'>请输入非负浮点数</i>"
              $(this).parent().parent().append(str);
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".doubleFloating") { //正负浮点数
            $(this).parent().parent().find("i.addI").remove();
            if (/^(-?\d+)(\.\d+)?$/.test(m) == false) {
              var str = "<i class='addI'>请输入浮点数</i>"
              $(this).parent().parent().append(str);
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".integer") { //正负整数
            $(this).parent().parent().find("i.addI").remove();
            if (/^((\d+)|((-\d+)|(0+)))$/.test(m) == false) {
              $(this).parent().parent().append("<i class='addI'>请输入非负整数</i>")
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".ipClass") { //ip
            $(this).parent().parent().find("i.addI").remove();
            if (/^([0-9]{1,3}.){3}[0-9]{1,3}$/.test(m) == false) {
              $(this).parent().parent().append("<i class='addI'>请输入192.168.160.173类型的ip地址</i>")
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".emailClass") { //邮箱
            $(this).parent().parent().find("i.addI").remove();
            if (/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(m) == false) {
              $(this).parent().parent().append("<i class='addI'>请输入正确的邮箱地址</i>")
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".phoneClass") { //电话/手机
            $(this).parent().parent().find("i.addI").remove();
            if (/^(1\d{10})|(0\d{2,3}-?\d{7,8})$/.test(m) == false) {
              $(this).parent().parent().append("<i class='addI'>请输入正确的电话类型</i>")
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".codeClass") { //英文+数字
            $(this).parent().parent().find("i.addI").remove();
            if (/^[0-9a-zA-Z]*$/g.test(m) == false) {
              $(this).parent().parent().append("<i class='addI'>请输入字母/数字/字母数字的组合</i>")
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".codeClassN") { //16进制+数字
            $(this).parent().parent().find("i.addI").remove();
            if (/^[0-9a-fA-F]*$/g.test(m) == false) {
              $(this).parent().parent().append("<i class='addI'>请输入16进制的字母或数字的组合</i>")
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".codeClass8") { //16进制+数字（8位）
            $(this).parent().parent().find("i.addI").remove();
            if (/^[0-9a-fA-F]{8}$/g.test(m) == false) {
              $(this).parent().parent().append("<i class='addI'>请输入8位16进制的字母或数字的组合</i>")
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".codeClass6") { //16进制+数字（6位）
            $(this).parent().parent().find("i.addI").remove();
            if (/^[0-9a-fA-F]{6}$/g.test(m) == false) {
              $(this).parent().parent().append("<i class='addI'>请输入6位16进制的字母或数字的组合</i>")
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".codeClass4") { //16进制+数字（6位）
            $(this).parent().parent().find("i.addI").remove();
            if (/^[0-9a-fA-F]{4}$/g.test(m) == false) {
              $(this).parent().parent().append("<i class='addI'>请输入4位16进制的字母或数字的组合</i>")
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".codeMenu") { //菜单编码(英文+数字不能以数字开头)
            $(this).parent().parent().find("i.addI").remove();
            if (/^[a-zA-Z]{4,}[0-9a-fA-F]*$/g.test(m) == false) {
              $(this).parent().parent().append("<i class='addI'>请输入前4位为字母的字母或字母数字的组合</i>")
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".require2") {
            $(this).parent().parent().find("i.addI").remove();
          }
        } else {
          if (classN == ".require") {
            $(this).parent().parent().find("i.addI").remove();
            $(this).parent().parent().append("<i class='addI add2'>请输入内容</i>");
          } else {
            $(this).parent().parent().find("i.addI").remove();
          }
        }
      })
    })
  },

  regx2(classN) {
    $(classN).each(function () {
      $(this).blur(function () {
        let m = this.value;
        if (m == "") {
          $(this).parent().parent().append("<i class='addI add2'>请输入内容</i>");
        } else {
          $(this).parent().parent().find("i.addI").remove();
        }
      })
    })
  },
  regx3(classN) {
    $(classN + " .el-textarea__inner").each(function () {
      $(this).blur(function () {
        let m = this.value;
        if (m != "") {
          if (classN == ".codeClassmore") { //16进制+数字（8位）
            $(this).parent().parent().find("i.addI").remove();
            if (/^[0-9a-fA-F]{1,}$/g.test(m) == false) {
              $(this).parent().parent().append("<i class='addI'>请输入8位16进制的字母或数字的组合</i>")
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          } else if (classN == ".require2") {
            $(this).parent().parent().find("i.addI").remove();
          } else if (classN == ".codeClassmore2") {
            $(this).parent().parent().find("i.addI").remove();
            if (/^[0-9a-fA-F]{1,}$/g.test(m) == false) {
              $(this).parent().parent().append("<i class='addI'>请按16进制输入，内容不包含引导码和CRC</i>")
            } else {
              $(this).parent().parent().find("i.addI").remove();
            }
          }
        } else {
          if (classN == ".require") {
            $(this).parent().parent().find("i.addI").remove();
            $(this).parent().parent().append("<i class='addI add2'>请输入内容</i>");
          } else {
            $(this).parent().parent().find("i.addI").remove();
          }
        }
      })
    })
  },
  requireTrue() {
    let num = 0;
    $(".popUp .select").each(function () {
      if ($(this).find("i.addI").length > 0) {
        return false
      } else {
        num++;
      }
    });
    if (num == ($(".popUp .select").length)) {
      return true
    } else {
      return false
    }
  },
  requires() {
    let num = 0;
    $(".contentNew .require .el-input__inner").each(function () {
      if ($(this).val() == "") {
        return false
      } else {
        num++;
      }
    })
    if (num == ($(".contentNew .require .el-input__inner").length)) {
      return true;
    } else {
      return false;
    }
  },
  requireInput(classNs) {
    let num = 0;
    $(classNs).each(function () {
      if ($(this).val() == "") {
        return false;
      } else {
        num++;
      }
    })
    if (num == $(classNs).length) {
      return true;
    } else {
      return false
    }
  },
  requireSelect(classNs) {
    let num = 0;
    $(classNs).each(function () {
      if ($(this).text() == "") {
        return false;
      } else {
        num++;
      }
    })
    if (num == $(classNs).length) {
      return true;
    } else {
      return false
    }
  },
  requireTrue2(classNs) {
    let num = 0;
    $(classNs).each(function () {
      if ($(this).find("i.addI").length > 0) {
        return false
      } else {
        num++;
      }
    });
    if (num == ($(classNs).length)) {
      return true
    } else {
      return false
    }
  },
};
let msg = {
  success(val) {
    v.$notify({
      message: val,
      type: 'success',
      customClass: "alertSuccess"
    });
  },
  error(val) {
    v.$notify({
      message: val,
      type: "error",
      customClass: "alertError"
    });
  },
  warning(val) {
    v.$notify({
      message: val,
      type: "warning",
      customClass: "alertWarning"
    });
  },
};
//遥测翻译值
let translate = {
  toChina(type, translateType, item) {
    let num = item.paramValue
    if (type == 1) { //文字翻译
      if (translateType != "") {
        let arr = translateType.split(";");
        let defaultVlue = "";
        for (let i = 0; i < arr.length; i++) {
          let stValue = arr[i].split(":")[1];
          let arr1 = arr[i].split(":")[0];
          var aPos = arr1.indexOf('[');
          var bPos = arr1.indexOf(']');
          var numL = arr1.substr(aPos + 1, bPos - aPos - 1);
          if (numL.indexOf(",") > -1) {
            let minV = parseFloat(numL.split(",")[0]);
            let maxV = parseFloat(numL.split(",")[1]);
            if ((parseFloat(num) > minV || parseFloat(num) == minV) & (parseFloat(num) < maxV || parseFloat(num) == maxV)) {
              return stValue;
            }
          } else {
            if (num.toString() === numL) {
              return stValue;
            } else {
              if (numL === "-") {
                defaultVlue = stValue;
              }
              if (i == arr.length - 1 & defaultVlue != "") {
                return defaultVlue
              }
            }
          }
        }
      }
    } else if (type == 2) { //时间翻译
      function timestampToTime(timestamp, n) {
        var date = new Date(timestamp * n); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear();
        var M =
          (date.getMonth() + 1 < 10 ?
            "0" + (date.getMonth() + 1) :
            date.getMonth() + 1);
        var dd = date.getDate();
        if (dd < 10) dd = "0" + dd;
        var hh = date.getHours();
        if (hh < 10) hh = "0" + hh;
        var mm = date.getMinutes();
        if (mm < 10) mm = "0" + mm;
        var ss = date.getSeconds();
        if (ss < 10) ss = "0" + ss;
        return Y + "-" + M + "-" + dd + " " + hh + ":" + mm + ":" + ss;
      };
      return timestampToTime(num, 1);
    } else if (type == 0) { //数字翻译
      return parsenum(num)
    } else if (type == 3) {
      return `0x${item.paramSourceCode}`
    } else if (type == 4) {
      if (translateType != "" && item.paramValue1 != 0) {
        return item.paramValue1.toFixed(translateType)
      }
    }
  }
}

function parsenum(num) {
  if (num.toString().indexOf(".") != -1) {
    if (num.toString().split(".")[1].length >= 4) {
      return num.toFixed(4)
    } else {
      return num
    }
  } else {
    return num
  }
}

let debounce = (func, wait, immediate) => {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

let checks = {
  positiveIn(rule, value, callback) {
    if (/^([1-9]\d*)$/.test(value) == false) {
      callback(new Error('请输入正整数数字'));
    } else {
      callback();
    }
  },
  positiveIn0(rule, value, callback) {
    if (/^([1-9]\d*|[0]{1,1})$/.test(value) == false) {
      callback(new Error('请输入非负整数'));
    } else {
      callback();
    }
  },
  integer(rule, value, callback) {
    if (/^((\d+)|((-\d+)|(0+)))$/.test(value) == false) {
      callback(new Error('请输入整数数字'));
    } else {
      callback();
    }
  },
  num65000(rule, value, callback) {
    if (/^([1-9]\d*|[0]{1,1})$/.test(value) == false) {
      callback(new Error('请输入0~65000的正整数数字'));
    } else {
      callback();
    }
  },
  floatNum(rule, value, callback) {
    if (/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(value) == false) {
      callback(new Error('请输入正浮点数'));
    } else {
      callback();
    }
  },
  floatNumNr(rule, value, callback) { //非必填
    if (value !== "" & value !== null) {
      if (/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(value) == false) {
        callback(new Error('请输入正浮点数'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  },
  floatNum0(rule, value, callback) {
    if (/^\d+(\.\d+)?$/.test(value) == false) {
      callback(new Error('请输入非负浮点数'));
    } else {
      callback();
    }
  },
  floatNum0Nr(rule, value, callback) { //非必填
    if (value !== "" & value !== null) {
      if (/^\d+(\.\d+)?$/.test(value) == false) {
        callback(new Error('请输入非负浮点数'));
      } else {
        callback();
      }
    } else {
      callback();
    }

  },
  doubleFloating(rule, value, callback) {
    if (/^(-?\d+)(\.\d+)?$/.test(value) == false) {
      callback(new Error('请输入浮点数'));
    } else {
      callback();
    }
  },
  ipClass(rule, value, callback) {
    if (/^([0-9]{1,3}.){3}[0-9]{1,3}$/.test(value) == false) {
      callback(new Error('请输入192.168.160.173类型的ip地址'));
    } else {
      callback();
    }
  },
  ipClass2(rule, value, callback) {
    if (/^2(2[4-9]|3[0-9])\.((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\.){2}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])$/.test(value) == false) {
      callback(new Error('请输入224.000.000.000 – 239.255.255.255的ip地址'));
    } else {
      callback();
    }
  },
  emailClass(rule, value, callback) {
    if (/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(value) == false) {
      callback(new Error('请输入正确的邮箱地址'));
    } else {
      callback();
    }
  },
  phoneClass(rule, value, callback) {
    if (/^(1\d{10})|(0\d{2,3}-?\d{7,8})$/.test(value) == false) {
      callback(new Error('请输入正确的电话类型'));
    } else {
      callback();
    }
  },
  codeNum(rule, value, callback) {
    if (/^[0-9a-fA-F]*$/g.test(value) == false) {
      callback(new Error('请输入16进制的字母或数字的组合'));
    } else {
      callback();
    }
  },
  codeClass(rule, value, callback) {
    if (/^[0-9a-zA-Z]*$/g.test(value) == false) {
      callback(new Error('请输入字母/数字/字母数字的组合'));
    } else {
      callback();
    }
  },
  codeClass8(rule, value, callback) {
    if (/^[0-9a-fA-F]{8}$/g.test(value) == false) {
      callback(new Error('请输入8位16进制的字母或数字的组合'));
    } else {
      callback();
    }
  },
  codeClass6(rule, value, callback) {
    if (/^[0-9a-fA-F]{6}$/g.test(value) == false) {
      callback(new Error('请输入6位16进制的字母或数字的组合'));
    } else {
      callback();
    }
  },
  msClass(rule, value, callback) { //毫秒
    if (/^([1-9]\d*|[0]{1,1})$/.test(value) == false) {
      callback(new Error('请输入正整数数字'));
    } else if (value < 0 || value > 999) {
      callback(new Error('请输入0~999的正整数数字'));
    } else {
      callback();
    }
  },
  second(rule, value, callback) { //毫秒
    if (/^([1-9]\d*|[0]{1,1})$/.test(value) == false) {
      callback(new Error('请输入正整数数字'));
    } else if (value < 0 || value > 60) {
      callback(new Error('请输入0~60的正整数数字'));
    } else {
      callback();
    }
  }
}

let Api = {
  point: 'point', //接口的参数
  doPost: function (api, data, success) {
    var baseUrl = config.api
    var url = baseUrl + api;
    if (isDebug) {
      console.log('[URL]' + url);
      console.log('[PARM]' + JSON.stringify(data));
    }
    jQuery.support.cors = true;
    let m = JSON.stringify(data);
    $.ajax({
      url: url,
      type: "POST",
      data: m,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (obj) {
        success(obj)
      }
    });
    // $.post(url, data, function(obj){ if(isDebug) console.log('[Res]'+JSON.stringify(obj)); success(obj); }, 'jsonp' );
  },

  doGet: function (api, data, success, error) {

    var url = baseUrl + api + data;
    if (isDebug) {
      console.log('[URL]' + url);
      console.log('[PARM]' + JSON.stringify(data));
    }
    $.get(url, function (obj) {
      obj = JSON.parse(obj);
      if (isDebug) console.log('[Res]' + JSON.stringify(obj));
      success(obj);
    });
  }

}

export default {
  install(Vue, options) {
    Vue.prototype.times = times;
    Vue.prototype.regular = regular;
    Vue.prototype.tool = tool;
    Vue.prototype.msg = msg;
    Vue.prototype.debounce = debounce;
    Vue.prototype.translate = translate;
    Vue.prototype.checks = checks;
    Vue.prototype.Api = Api;
  }
};
