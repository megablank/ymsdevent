var hrs, mins, secs;
var testTime, testDay;
var trueChart;
var remainingTime;

$(document).ready(()=>{
   var date = new Date();
   var offset = date.getTimezoneOffset();
   var data = timeline.data;

   //转换时区
   var newChart = {};
   for(var i = 0; i < data.length; i++){
      var eve = data[i];
      if(!newChart[eve.day + "_" + eve.time]){
         newChart[eve.day + "_" + eve.time] = [];
      }
      newChart[eve.day + "_" + eve.time].push(eve);
   }

   var timeOffset = (offset / 60);
   var eventOffset = Math.floor(Math.abs(timeOffset / 4)) * (timeOffset < 0 ? -1 : 1);
   var remain = Math.abs(timeOffset) % 4;
   var currentDay = (date.getDay() - 1 < 0 ? 6 : date.getDay() - 1);
   var currentHour = date.getHours();

   trueChart = {};
   for(var _day = 0; _day < 7; _day++){
      for(var _time = 0; _time < 6; _time++){
         var day = _day;
         var time = _time + eventOffset;
         if(time >= 6){
            time -= 6;
            day++;
         }else if(time < 0){
            time += 6;
            day--;
         }

         if(day < 0){
            day += 7;
         }else if(day >= 7){
            day -= 7;
         }
         trueChart[_day + "_" + _time] = newChart[day + "_" + time];
      }
   }

   // 填充表格
   var timeRow = $('tr[id=time]');
   timeRow.html(timeRow.html() + '<td></td>');
   for(var i = 0; i < 6; i++){
      var from = (i * 4 + remain + 24) % 24;
      var to = ((i + 1) * 4 + remain) % 24;
      var fromStr = (from < 10 ? '0' : '') + from + ":" + "00";
      var toStr = (to < 10 ? '0' : '') + to + ":" + "00";
      timeRow.html(timeRow.html() + '<td>' + fromStr + '<br>~<br>' + toStr + '</td>');
   }

   var dataChart = $('tbody');

   for(var _day = 0; _day < 7; _day++){
      dataChart.html(dataChart.html() + '<tr id="day' + _day + '"></tr>');
      var dayStr = '';
      switch (_day) {
         case 0:
            dayStr = '一';
            break;
         case 1:
            dayStr = '二';
            break;
         case 2:
            dayStr = '三';
            break;
         case 3:
            dayStr = '四';
            break;
         case 4:
            dayStr = '五';
            break;
         case 5:
            dayStr = '六';
            break;
         case 6:
            dayStr = '日';
            break;
      }
      var curRow = $('tr[id=day' + _day + ']');
      curRow.html(curRow.html() + '<td>' + dayStr + '</td>');
      for(var _time = 0; _time < 6; _time++){
         var eve = trueChart[_day + '_' + _time][0];
         testDay = currentDay;
         var _testTime = currentHour - remain;
         if(_testTime < 0){
            _testTime += 24;
            testDay--;
            if(testDay < 0){
               testDay += 7;
            }
         }

         var eventStr = '';
         switch (eve.event) {
            case 'wish':
               eventStr = '许愿';
               break;
            case 'recruit':
               eventStr = '招募';
               break;
            case 'power':
               eventStr = '实力';
               break;
            case 'research':
               eventStr = '研究';
               break;
            case 'build':
               eventStr = '建造';
               break;
            case 'brutal':
               eventStr = '原始';
               break;
            case 'clean':
               eventStr = '扫除';
               break;
            case 'wolf':
               eventStr = '杀狼';
               break;
            case 'rune':
               eventStr = '符文';
               break;
         }

         if(trueChart[_day + '_' + _time].length > 1){
            eventStr = '<div id="tiger">剑齿虎</div>' + eventStr;
         }

         testTime = Math.floor(_testTime / 4);
         var isNow = (testDay == _day && testTime == _time);
         var cls = eve.event + (eve.length > 1 ? ' tiger' : '') + (trueChart[_day + '_' + _time].length > 1 ? ' tiger' : '') + (isNow ? ' now' : '');
         curRow.html(curRow.html() + '<td data="eve" class="' + cls + '" id="day' + _day + '_time' + _time + '">' + eventStr + '</td>');
      }
   }

   dataChart.html(dataChart.html() + '<tr id="sum"></tr>');
   var sumRow = $('#sum');
   sumRow.html(sumRow.html() + '<td colspan="3">剩余时间</td>');
   sumRow.html(sumRow.html() + '<td colspan="4" id="remainingTime">00:00</td>');

   dataChart.html(dataChart.html() + '<tr id="copy"><td colspan="7">#167@黑暗钓鱼王</td></tr>');

   tick();
   setInterval(tick, 1000);


   $('td[data=eve]').click(onCellClick);
});

function onCellClick(){
   //$(this).removeClass('now');
   var cId = $(this).attr('id');
   var re = /day(\d+)_time(\d+)/g;
   var r = "";
   var cDay = 0;
   var cTime = 0;
   var tDay = testDay;
   var tTime = testTime;
   while(r = re.exec(cId)) {
      cDay = r[1];
      cTime = r[2];
   }
   if(!(cDay == testDay && cTime == testTime)){
      var count = 0;
      do{
         count++;
         tTime++;
         if(tTime > 5){
            tTime = 0;
            tDay++;
            if(tDay > 6){
               tDay = 0;
            }
         }
         if(count > 100) break;

      }while(tDay != cDay || tTime != cTime);

      var remainTime = (count - 1) * (3600 * 4) + remainingTime;
      var d = Math.floor(remainTime / (60*60*24));
      var h = Math.floor((remainTime % (60*60*24)) / 3600);
      var m = Math.floor((remainTime % (60*60)) / 60);
      var s = remainingTime % 60;
      alert('该活动还需' + (remainTime > (60*60*24) ? d + '天' : '') + (remainTime > (60*60) ? h + '小时' : '') + (remainTime > 60 ? m + '分钟' : '') + s + '秒');
   }

}

var tick = ()=>{
   var date = new Date();
   var offset = date.getTimezoneOffset();
   var timeOffset = (offset / 60);
   var eventOffset = Math.floor(Math.abs(timeOffset / 4)) * (timeOffset < 0 ? -1 : 1);
   var remain = Math.abs(timeOffset) % 4;
   var currentDay = (date.getDay() - 1 < 0 ? 6 : date.getDay() - 1);
   var currentHour = date.getHours();
   var currentMinutes = date.getMinutes();
   var currentSeconds = date.getSeconds();
   remainingTime = (3 - ((currentHour - remain) % 4)) * 60 * 60 + (59 - currentMinutes) * 60 + (60 - currentSeconds);

   if(remainingTime < 0){
      location.reload();
   }

   hrs = Math.floor(remainingTime / (60*60));
   mins = Math.floor((remainingTime % (60*60)) / 60);
   secs = remainingTime % 60;
   $('#remainingTime').html((hrs < 10 ? '0' : '') + hrs + ':' + (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs);
};
