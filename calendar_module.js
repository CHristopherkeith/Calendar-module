
var Calendar=function(config){
	this.lowerDate=config.lowerDate;
	this.upperDate=config.upperDate;
	this.isPeriod=config.isPeriod;
	if(this.isPeriod){
		this.periodCallback=config.periodCallback;
		this.nowSelectPeriod=0;
		this.periodDaysMin=config.periodDaysMin;
		this.periodDaysMax=config.periodDaysMax;
	}
	this.callback=config.callback;	
	this.nowShowdate=null;
	this.nowSelectDate=null;	
	this.Isinit=false;
	this.init(config);
}

function findSelectdate(date){
	var allDays=$$("td");
	for(var i=0;i<allDays.length;i++){
		allDays[i].index=i;
		if(allDays[i].className!="unavailable"){
			if(date.toString()===allDays[i].innerHTML){
				return allDays[i]
				break;
			}
		}
	}
	return false;
}

function clearClassName(oTarget){
	for(var i=0;i<oTarget.length;i++){
		oTarget[i].className="";
	}
}

Calendar.prototype={

	init:function(config){

		var that=this;
		if(!this.Isinit){
			this.nowShowdate=new Date();
			this.nowShowdate.setFullYear(config.setNowDate[0]);
			this.nowShowdate.setMonth(config.setNowDate[1]-1,1);
			this.nowSelectDate=new Date();
			this.nowSelectDate.setDate(config.setNowDate[2]);
			this.nowSelectDate.setFullYear(config.setNowDate[0]);
			this.nowSelectDate.setMonth(config.setNowDate[1]-1);
			this.rendCalender();
			this.setNowDate();
			$("#calendar").style.display="none";
			this.Isinit=true;	
		}
		else{
			this.rendCalender();
			this.setNowDate();	
			this.nowSelectPeriod=0;		
		}
		if(this.isPeriod&&$(".select")){
			$(".select").className="";
		}

		var leftTri,rigTri,dleftTri,drigTri,oTable;
		leftTri=$(".tri");
		rigTri=$(".right");
		dleftTri=$(".doubletrilef");
		drigTri=$(".doubletririg");
		oTable=$("#content");
		addEvent(leftTri,"click",function(){that.changeMonth()});
		addEvent(rigTri,"click",function(){that.changeMonth()});
		addEvent(dleftTri,"click",function(){that.changeYear()});
		addEvent(drigTri,"click",function(){that.changeYear()});
		addEvent(oTable,"click",function(){
			var nowdate=[];
			if(getEventTarget(event).tagName==="TD"&&getEventTarget(event).className!="unavailable"){
				that.nowSelectDate.setFullYear(that.nowShowdate.getFullYear());
				that.nowSelectDate.setMonth(that.nowShowdate.getMonth());
				that.nowSelectDate.setDate(parseInt(getEventTarget(event).innerHTML));
				that.selectPeriod(that,that.periodCallback);
				if(!that.isPeriod||that.nowSelectPeriod!=2){
					that.setNowDate(that.callback);
				}
			}
		});

		this.showPanel();
	},
	showPanel:function(){
		$("#showdate").onclick=function(){
			if($("#calendar").style.display=="none"){
				$("#calendar").style.display="block";
			}
			else{
				$("#calendar").style.display="none";
			}
		}
	},
	setNowDate:function(callback){
		var that=this;
		if($(".select")!=null&&!this.isPeriod){
			$(".select").className="";
		}
		if(this.nowShowdate.getFullYear()==this.nowSelectDate.getFullYear()&&this.nowShowdate.getMonth()==this.nowSelectDate.getMonth()){
			var selectDate;
			selectDate=findSelectdate(this.nowSelectDate.getDate());
			if(selectDate){
				selectDate.className="select";
				if((callback && typeof(callback) === "function")&&!this.isPeriod){
					callback(this.nowSelectDate);
				}
			}
		}
	},
	changeMonth:function(){
		if(getEventTarget(event).className=="tri"){
			this.nowShowdate.setMonth(this.nowShowdate.getMonth()-1);
			if(this.nowShowdate.getFullYear()<this.lowerDate[0]){
				alert("超过设定日期界限，请确认");
				this.nowShowdate.setMonth(this.nowShowdate.getMonth()+1)
				return 0;
			}
		}
		else{
			this.nowShowdate.setMonth(this.nowShowdate.getMonth()+1);
			if(this.nowShowdate.getFullYear()>this.upperDate[0]){
				alert("超过设定日期界限，请确认");
				this.nowShowdate.setMonth(this.nowShowdate.getMonth()-1)
				return 0;
			}
		}
		this.init(config);
	},
	changeYear:function(){
		if(getEventTarget(event).className=="doubletrilef"||getEventTarget(event).parentNode.className=="doubletrilef"){
			if(this.nowShowdate.getFullYear()-1<this.lowerDate[0]){
				alert("超过设定日期界限，请确认");
				return 0;
			}
			this.nowShowdate.setFullYear(this.nowShowdate.getFullYear()-1);
		}
		else{
			if(this.nowShowdate.getFullYear()+1>this.upperDate[0]){
				alert("超过设定日期界限，请确认");
				return 0;
			}
			this.nowShowdate.setFullYear(this.nowShowdate.getFullYear()+1);
		}
		this.init(config);
	},	
	rendCalender:function(){
		var that=this;
		var htmlArr=[],hmtlStr="";
		htmlArr=htmlArr.concat(creatHeader());
		htmlArr=htmlArr.concat(creatContent());

		hmtlStr=htmlArr.join("");

		if($("#calendar")){
			$("body").removeChild($("#calendar"));
		}
		if($("#confirm")){
			$("body").removeChild($("#confirm"));
		}
		var oCalendar=document.createElement("div");
		oCalendar.id="calendar";
		oCalendar.innerHTML=hmtlStr;
		$("body").appendChild(oCalendar);

		var oConfirm=document.createElement("div");
		oConfirm.id="confirm";
		oConfirm.innerHTML="<button id='ok'>确认</button><button id='cancel'>取消</button>";
		$("body").appendChild(oConfirm);
		$("#confirm").style.display="none";

		function creatHeader(){
			var headerArr=[];
			headerArr.push("<div id='header'>"+"<div class='doubletrilef'><div class='dtri'></div><div class='dtri'></div></div>"+"<div class='tri'></div>"+"<p><span id='year'>"+that.nowShowdate.getFullYear()+"</span>年<span id='month'>"+(that.nowShowdate.getMonth()+1).toString()+"</span>月</p>"+"<div class='doubletririg'><div class='dtri'></div><div class='dtri'></div></div>"+"<div class='tri right'></div>"+"</div>");
			return headerArr;
		}

		function creatContent(){

			function getFebDays(year){
				var cond1=year%4==0;
			    var cond2=year%100!=0;
			    var cond3=year%400==0;
			    var cond = cond1 && cond2 || cond3;
			    if(cond) {
			        return 29;
			    } else {
			        return 28;
			    }
			}
			var monthDays={"-1":31,0:31,1:getFebDays(that.nowShowdate.getFullYear()),2:31,3:30,4:31,5:30,6:31,7:31,8:30,9:31,10:30,11:31}

			var week={0:"日",1:"一",2:"二",3:"三",4:"四",5:"五",6:"六"};
			var contentArr=[],contentStr="",cntDays=0,cntUnavailDays=0;
			contentArr.push("<table id='content'>");
			contentArr.push("<tr>");
			
			for(var i=0;i<7;i++){
				if(i==0||i==6){
					contentStr="<th class='weekend'>"+week[i]+"</th>";
				}else{
					contentStr="<th>"+week[i]+"</th>";
				}
				contentArr.push(contentStr);
			}
			contentArr.push("</tr>");

			for(var i=0;i<6;i++){
				contentArr.push("<tr>");
				for(var j=0;j<7;j++){
					if(i==0&&j<that.nowShowdate.getDay()){
						contentStr="<td class='unavailable'>"+(monthDays[that.nowShowdate.getMonth()-1]-that.nowShowdate.getDay()+1+j).toString()+"</td>";				
					}
					else{
						if(cntDays<monthDays[that.nowShowdate.getMonth()]){
							if(j==0||j==6){
								contentStr="<td class='weekend'>"+(cntDays+1).toString()+"</td>";
							}
							else{
								contentStr="<td>"+(cntDays+1).toString()+"</td>";
							}
							cntDays++;
						}
						else{
							contentStr="<td class='unavailable'>"+(cntUnavailDays+1).toString()+"</td>";
							cntUnavailDays++;
						}
					}
					contentArr.push(contentStr);	
				}
				
				contentArr.push("</tr>");
			}
			contentArr.push("</table>");
			return contentArr;
		}
	},
	selectPeriod:function(that,periodCallback){
		if(that.isPeriod){
			var oSelect=[],oPeriod=[],firstSelect,lastSelect;
			var oConfirm=$("#confirm");
			var oOk=$("#ok");
			var oCancel=$("#cancel");
			if(that.nowSelectPeriod==2){
				oSelect=$$(".select");
				oPeriod=$$(".period");
				clearClassName(oSelect);
				clearClassName(oPeriod);
				that.nowSelectPeriod=1;
				oConfirm.style.display="none";
			}
			else{
				if(that.nowSelectPeriod==0){
					that.nowSelectPeriod++;
				}
				else{
					if(that.nowSelectDate.getDate().toString()!=$(".select").innerHTML){
						that.nowSelectPeriod++;
						that.setNowDate(that.callback);
						firstSelect=$(".select");
						lastSelect=$$(".select")[1];
						var selectLength=parseInt(lastSelect.innerHTML)-parseInt(firstSelect.innerHTML);
						//
						var selectDate=findSelectdate(parseInt(firstSelect.innerHTML));
						var allDays=$$("td");
						for(var i=1;i<selectLength;i++){
							allDays[selectDate.index+i].className="period";
						}
						
						oConfirm.style.display="block";
						oOk.onclick=function(){
							if(selectLength+1<that.periodDaysMin||selectLength+1>that.periodDaysMax){
								alert("所设置日期长度超出范围，请确认");
								oSelect=$$(".select");
								oPeriod=$$(".period");
								clearClassName(oSelect);
								clearClassName(oPeriod);
								that.nowSelectPeriod=0;
							}
							else{
								that.periodCallback($$(".select"),that.nowShowdate);
							}
							oConfirm.style.display="none";
						};
						oCancel.onclick=function(){
							oSelect=$$(".select");
							oPeriod=$$(".period");
							clearClassName(oSelect);
							clearClassName(oPeriod);
							that.nowSelectPeriod=0;
							oConfirm.style.display="none";
						};
					}
				}
			}
		}
	},
}