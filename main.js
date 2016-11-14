var config={
	lowerDate:[1980],
	upperDate:[2041],
	setNowDate:[2016,7,03],
	callback:userfunc,
	periodCallback:period,
	isPeriod:true,
	periodDaysMin:3,
	periodDaysMax:15
}

var calendar=new Calendar(config);

function userfunc(nowSelectDate){
	$("#showdate").value=nowSelectDate.getFullYear()+"-"+(nowSelectDate.getMonth()+1)+"-"+nowSelectDate.getDate();
	console.log("这是用户回调函数");
}

function period(nowSelectPeriod,nowShowDate){
	$("#showdate").value=nowShowDate.getFullYear()+"-"+(nowShowDate.getMonth()+1)+"-"+nowSelectPeriod[0].innerHTML+" to "+nowShowDate.getFullYear()+"-"+(nowShowDate.getMonth()+1)+"-"+nowSelectPeriod[1].innerHTML;
	console.log("这是用户Period回调函数");
}


