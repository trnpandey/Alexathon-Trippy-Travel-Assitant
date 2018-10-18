'use strict';

const Alexa = require('alexa-sdk');

var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var request=require('request');

var err="No information available: Please check the details that you have provided";

app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'));

const APP_ID = undefined;

const languageStrings = {
    'en': {
        translation: {
            FACTS: [
                'something',
            ],
            SKILL_NAME: 'something',
            GET_FACT_MESSAGE: "Here's your dummy ",
            HELP_MESSAGE: 'help..',
            HELP_REPROMPT: 'What',
            STOP_MESSAGE: 'bye',
        },
    },
    'en-US': {
        translation: {
            FACTS: [
                'A year on Mercury is just 88 days long.',
            ],
            SKILL_NAME: 'something Facts',
        },
    },
    'en-GB': {
        translation: {
            FACTS: [
                'A year on Mercury is just 88 days long.',
            ],
            SKILL_NAME: 'something Facts',
        },
    },
    'de': {
        translation: {
            FACTS: [
                'simple fact....',
            ],
            SKILL_NAME: 'something',
            GET_FACT_MESSAGE: 'message... ',
            HELP_MESSAGE: 'description...',
            HELP_REPROMPT: 'hep....',
            STOP_MESSAGE: 'bye...',
        },
    },
};
//flights------------------------------------------------------------------------------------------------------------------------------------------------------------
	var names=["delhi","mumbai","bangalore","chennai","kolkata","cochin","ahmedabad","hyderabad","pune","dabolim",
									"trivandrum","lucknow","jaipur","guwahati","kozikhode","srinagar","bhubneshwar","vishakapatnam","coimbatore","indore",
									"mangalore","nagpur","patna","chandigarh","tiruchilapalli","varanasi","raipur","amritsar","jammu","bagdogra",
									"vadodra","agartala","portblair","madurai","imphal","ranchi","udaipur","dehradun","bhopal","leh",
									"rajkot","vijaywada","tirupati","dibrugarh","jodhpur","aurangabad","rajahmundry","silchar","jabalpur","aizwal"
									];
	var codes=[
									"DEL","BOM","BLR","MAA","CCU","COK","AMD","HYD","PNQ","GOI",
									"TRV","LKO","JAI","GAU","CCJ","SXR","BBI","VTZ","CJB","IDR",
									"IXE","NAG","PAT","IXC","TRZ","VNS","RPR","ATQ","IXJ","IXB",
									"BDQ","IXA","IXZ","IXM","IMF","IXR","UDR","DED","BHO","IXL",
									"RAJ","VJA","TIR","DIB","JDH","IXU","RJA","IXS","JLR","AJL"
									];
	
const first = (source, destination, date, callback) => 
{	
	
	var result="";
	
	
	source=source.toLowerCase();
	destination=destination.toLowerCase();
	
	
	var s,d;
	for(var i=0;i<names.length;i++)
								{
									if(names[i]==source)
									{s=codes[i];}
									else if(names[i]==destination)
									{d=codes[i];}
								}
							
    
	console.log(s+"    "+d);							
	request('http://developer.goibibo.com/api/search/?app_id=4e57b2b4&app_key=''&source='+s		+'&destination='+d+'&dateofdeparture='+date+'&seatingclass=E&adults=1&children=0&infants=0&counter=100', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	console.log(body);
	var o=JSON.parse(body);
	var amt=0;
	result="";
	if(o.data.Error !== undefined)
	{
	result="Incorrect details:Please enter correct data";
	callback(null,result);
	}
	else
	{
		for (var i=0;i<o.data.onwardflights.length;i++)
		{  

		   if(o.data.onwardflights[i].fare.adulttotalfare<amt || amt==0){  //latest
		   amt=o.data.onwardflights[i].fare.adulttotalfare;
	       var info='The cheapest flight available is of airline '+o.data.onwardflights[i].airline+', flight number-'+o.data.onwardflights[i].flightcode+' departing at '+o.data.onwardflights[i].deptime+' which costs Rs '+o.data.onwardflights[i].fare.adulttotalfare;
		   result=info;
		   }
		}
	
		console.log("response="+result);
		callback(null,result);

	}
	}
	else	
	{
	console.log("error..");
	result="Something went wrong,Please try again later";
	callback(null,result);
	return err;
	}
	});
	
}
/*
alexa ask travel assistant all flights of air india from delhi to mumbai on twenty third october for economy class

*/

const second = (source, destination, date,airline,classs,callback) => {
	var result="";
	
	source=source.toLowerCase();
	destination=destination.toLowerCase();
	var s,d;
	for(var i=0;i<names.length;i++)
								{
									if(names[i]==source)
									{s=codes[i];}
									else if(names[i]==destination)
									{d=codes[i];}
								}
							
    	console.log(s+"    "+d);	

	if(airline.includes("indigo") || airline.includes("Indigo"))
		airline="Indigo";
	if( (airline.includes("air") || airline.includes("Air")) && (airline.includes("india") || airline.includes("India")))
		airline="Air India";
	if( (airline.includes("air") || airline.includes("Air")) && (airline.includes("go") || airline.includes("Go")))
		airline="GoAir";
	if( (airline.includes("spice") || airline.includes("Spice")) && (airline.includes("Jet") || airline.includes("jet")))
		airline="Spicejet";
	if( (airline.includes("Jet") || airline.includes("jet")) && (airline.includes("Airways") || airline.includes("airways")))
		airline="Jet Airways";
	if(airline.includes("Vistara") || airline.includes("vistara"))
		airline="Vistara";	
	
	if(classs=='economy' || classs=='Economy')
		classs='E';
	if(classs=='business' || classs=='Business')
		classs='B';
	
	request('http://developer.goibibo.com/api/search/?app_id=4e57b2b4&app_key=''&source='+s+'&destination='+d+'&dateofdeparture='+date+'&seatingclass='+classs+'&adults=1&children=0&infants=0&counter=100', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	console.log(body);
	var o=JSON.parse(body);
	result="The flights of airline  "+airline+" are as follows:  ";
	if(o.data.Error !== undefined)
	{
	result="Incorrect details:Please enter correct data";
	console.log(result);
	callback(null,result);
	//callback(second);
	}
	else
	{
	var count=0;	//latest
	for (var i=0;i<o.data.onwardflights.length;i++)
	{  
	   if(count<=10 && (o.data.onwardflights[i].airline==airline && classs==o.data.onwardflights[i].seatingclass)){ //latest
	   //console.log(info);
       	   var info='Flight-'+o.data.onwardflights[i].flightcode+': '+o.data.onwardflights[i].deptime+',Rs '+o.data.onwardflights[i].fare.adulttotalfare+',Available-'+o.data.onwardflights[i].seatsavailable+'.    ';
	   console.log(info);
	   result=result.concat(info);
	   count=count+1;   //latest
	   }
	}
	
	console.log("response="+result);
	callback(null,result);
	//callback(second);
	}
	}
	else	
	{
	console.log("error..");
	//return err;
	result="Something went wrong,Please try again later";
	callback(null,result);
	return err;
	}
	});	
}

/*
alexa ask travel assistant all flights from lucknow to mumbai on twenty third october for economy class

*/
const third = (source, destination, date,classs,callback) => {

	var result="";
	source=source.toLowerCase();
	destination=destination.toLowerCase();
	var s,d;
	for(var i=0;i<names.length;i++)
								{
									if(names[i]==source)
									{s=codes[i];}
									else if(names[i]==destination)
									{d=codes[i];}
								}
							
    	console.log(s+"    "+d);		
	
	if(classs=='economy' || classs=='Economy')
		classs='E';
	if(classs=='business' || classs=='Business')
		classs='B';
	
	request('http://developer.goibibo.com/api/search/?app_id=4e57b2b4&app_key=''&source='+s+'&destination='+d+'&dateofdeparture='+date+'&seatingclass='+classs+'&adults=1&children=0&infants=0&counter=100', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	//console.log(body);
	var o=JSON.parse(body);
	result="The flights are as follows:  ";
	
	if(o.data.Error !== undefined)
	{
	result="Incorrect details:Please enter correct data";
	callback(null,result);
	//callback(second);
	}
	else
	{	
	var count=0;		//latest
	for (var i=0;i<o.data.onwardflights.length;i++)
	{  
	   if(classs==o.data.onwardflights[i].seatingclass){
	   var info;
       if(count<=10 && o.data.onwardflights[i].seatsavailable!=9999)	  //latest  
       info=o.data.onwardflights[i].airline+'-'+o.data.onwardflights[i].flightcode+': '+o.data.onwardflights[i].deptime+',Rs '+o.data.onwardflights[i].fare.adulttotalfare+',Available-'+o.data.onwardflights[i].seatsavailable+'.    ';
	   else
	   info=o.data.onwardflights[i].airline+'-'+o.data.onwardflights[i].flightcode+': '+o.data.onwardflights[i].deptime+',Rs '+o.data.onwardflights[i].fare.adulttotalfare+'.    ';
	    
	   result=result.concat(info);
	   count=count+1; 	//latest
	   }
	}
	
	console.log("response="+result);
	callback(null,result);
	//callback(second);
	}
	}
	else	
	{
	console.log("error..");
	//return err;
	result="Something went wrong,Please try again later";
	callback(null,result);
	return err;
	}
	});	
}

/*
alexa ask travel assistant find restaurants nearby delhi

*/
const fourth = (location,callback) => {

	var type="food";
	//var location=req.params.location;
	var key='';
	var result="";
	request('https://maps.googleapis.com/maps/api/place/textsearch/json?query='+location+'+city+food&language=en&key='+key, function (error, response, body) {
	if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	console.log(body);
	result="The spots are as follows:  ";
	
	if(o.results.length == 0)
	{
	result="No data available for this location. Please try some other name";
	callback(null,result);
	//callback(second);
	}
	else
	{
	for (var i=0;i<o.results.length && i<=10;i++)
	{  
	   var info;
	   info=o.results[i].name.concat(', ');
	   result=result.concat(info);
	}
	}
	
	console.log("response="+result);
	callback(null,result);
	//callback(second);
	}
	else	
	{
	console.log("error..");
	//return err;
	result="Something went wrong,Please try again later";
	callback(null,result);
	return err;
	}
	});	
}
/*
alexa ask travel assistant places of natural beauty nearby electronic city phase 1

*/
const fifth = (location,callback) => {

	var type="natural+feature";
	//var location=req.params.location;
	var key='';
	var result="";
	request('https://maps.googleapis.com/maps/api/place/textsearch/json?query='+location+'+city+natural+feature&language=en&key='+key, function (error, response, body) {
	if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	console.log(body);
	result="The spots are as follows:  ";
	
	if(o.results.length == 0)
	{
	result="No data available for this location. Please try some other name";
	callback(null,result);
	//callback(second);
	}
	else
	{
	for (var i=0;i<o.results.length && i<=10;i++)
	{  
	   var info;
	   info=o.results[i].name.concat(', ');
	   result=result.concat(info);
	}
	}
	
	console.log("response="+result);
	callback(null,result);
	//callback(second);
	}
	else	
	{
	console.log("error..");
	//return err;
	result="Something went wrong,Please try again later";
	callback(null,result);
	return err;
	}
	});	
}

/*
alexa ask travel assistant places of worship nearby electronic city phase 1

*/

const sixth = (location,callback) => {

	var type="place+of+worship";
	//var location=req.params.location;
	var key='';
	var result="";
	request('https://maps.googleapis.com/maps/api/place/textsearch/json?query='+location+'+city+place+of+worship&language=en&key='+key, function (error, response, body) {
	if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	console.log(body);
	result="The spots are as follows:  ";
	
	if(o.results.length == 0)
	{
	result="No data available for this location. Please try some other name";
	callback(null,result);
	//callback(second);
	}
	else
	{
	for (var i=0;i<o.results.length && i<=10;i++)
	{  
	   var info;
	   info=o.results[i].name.concat(', ');
	   result=result.concat(info);
	}
	}
	
	console.log("response="+result);
	callback(null,result);
	//callback(second);
	}
	else	
	{
	console.log("error..");
	//return err;
	result="Something went wrong,Please try again later";
	callback(null,result);
	return err;
	}
	});	
}



/*

alexa ask travel assistant details of buses from delhi to haridwar on twenty third october

*/
const seventh = (source, destination, date,callback) => {

	var result="";
	source=source.toLowerCase();
	destination=destination.toLowerCase();
	request('http://developer.goibibo.com/api/bus/search/?app_id=''&app_key=''&format=json&source='+source+'&destination='+destination+'&dateofdeparture='+date, function (error, response, body) {
	if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	console.log(body);
	result="The buses are as follows:  ";
	
	if(o.data.onwardflights.length == 0)
	{
	result="No data available for this route : Please reconsider the input parameters";
	console.log("No data");
	callback(null,result);
	//callback(second);
	}
	else
	{
		console.log("data available");
	for (var i=0;i<o.data.onwardflights.length && i<=10;i++)	//latest
	{  
	   var info;
	   info=o.data.onwardflights[i].BPPrims.list[0].BPId+'-'+o.data.onwardflights[i].TravelsName+' at '+o.data.onwardflights[i].DepartureTime+' Rs'+o.data.onwardflights[i].fare.totalbasefare+'    '; 
	   result=result.concat(info);
	}
	}
	
	console.log("response="+result);
	callback(null,result);
	//callback(second);
	}
	else	
	{
	console.log("error..");
	//return err;
	result="Something went wrong,Please try again later";
	callback(null,result);
	return err;
	}
	});	
}

/*
alexa ask travel assistant tell me the live status of train twelve thousand six hundred and twenty five on sixteen october

*/

const eighth = (train,date,callback) => {
	var key='';
	//var train=req.params.train;
	//var date=req.params.date;
	var result="";
	console.log(date);
	console.log(train);
//https://api.railwayapi.com/v2/live/train/<train number>/date/<dd-mm-yyyy>/apikey/<apikey>/


	request('http://api.railwayapi.com/v2/live/train/'+train+'/date/'+date+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	console.log("---->"+body+"-----");
	if(o.response_code==200)
	{
	result=train+' '+o.position;
	console.log("response="+result);
	callback(null,result);
	//callback(second);
	}
	else
	{
	result="Incorrect Details:Please enter correct data";
	//callback(second);
	callback(null,result);	
	}
	}
	else	
	{
	console.log("error..");
	//return err;
	result="Something went wrong,Please try again later";
	callback(null,result);
	return err;
	}
	});
}

/*
alexa ask travel assistant tell me the pnr status of number ''

*/


const ninth = (pnr,callback) => {
	var key='';
	//var pnr=req.params.pnr;
	var result="";
	var flag=0;
	request('http://api.railwayapi.com/v2/pnr-status/pnr/'+pnr+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	result='The current status of PNR '+pnr+' is: '+'\n';
	for (var i=0;i<o.passengers.length;i++)
	{  
		flag=1;
       var info='Passenger '+o.passengers[i].no+' booking status:'+o.passengers[i].booking_status+' current status:'+o.passengers[i].current_status+'\n';
	   result=result.concat(info);
	}
	console.log("response="+result);
	callback(null,result);
	//callback(second);
	}
	else	
	{
	console.log("error..");
	//return err;
	result="Something went wrong,Please try again later";
	callback(null,result);
	return err;
	}
	});
}


/*
alexa ask travel assistant give me the list of cancelled trains on sixteen october

*/
const tenth = (date,callback) => {
	//var date=req.params.date;
	var key='';
	var result="";
	var flag=0;
	request('http://api.railwayapi.com/v2/cancelled/date/'+date+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	result='The Trains that have been cancelled on '+date+' are: ';
	for (var i=0;i<o.trains.length && i<=10;i++)	//latest
	{  
	   flag=1;
       var info='Train '+o.trains[i].number+' : '+o.trains[i].name+',    ';
	   result=result.concat(info);
	}
	console.log("response="+result);
	callback(null,result);
	//callback(second);
	}
	else	
	{
	console.log("error..");
	//return err;
	result="Something went wrong,Please try again later";
	callback(null,result);
	return err;
	}
	});	
}


/*

alexa ask travel assistant which all trains have been rescheduled on sixteen october

*/
const eleventh = (date,callback) => {


	//var date=req.params.date;
	var key='';
	var result="";
	var flag=0;
	request('http://api.railwayapi.com/v2/rescheduled/date/'+date+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	result='The Trains that have been rescheduled on '+date+' are: ';
	for (var i=0;i<o.trains.length && i<=10;i++)	//latest
	{  
	   flag=1;
       var info='Train '+o.trains[i].number+' : '+o.trains[i].name+' Rescheduled to: '+o.trains[i].rescheduled_date+' ,'+o.trains[i].rescheduled_time+',    ';
	   result=result.concat(info);
	}
	console.log("response="+result);
	//callback(second);
	callback(null,result);
	}
	else	
	{
	console.log("error..");
	//return err;
	result="Something went wrong,Please try again later";
	callback(null,result);
	return err;
	}
	});
}


/*

alexa ask travel assistant route of train number twelve thousand six hundred and twenty five

*/
const twelth = (train,callback) => {
	//var train=req.params.train;
	var key='';
	var result="";
	request('http://api.railwayapi.com/v2/route/train/'+train+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	
	if(o.response_code==200)
	{
	result='Train '+o.train.name+' runs on: ';
	
	//result=result.concat('It runs on: ');
	for (var i=0;i<o.train.days.length;i++)
	{  
	   if(o.train.days[i].runs=='Y')
	   {result=result.concat(o.train.days[i].code);
   
         if(i!=o.train.days.length-1)
         result=result.concat(',');
	   }
	}
	//result=result.concat('\n');
	/*result=result.concat('        Classes Available in this train are: ');
	for (var i=0;i<o.train.classes.length;i++)
	{  
	   if(o.train.classes[i].available=='Y')
	   {result=result.concat(o.train.classes[i].code);
         if(i!=o.train.classes.length-1)
         result=result.concat(',');
	   }
	}*/
	
	
	//result=result.concat('\n');
	result=result.concat('        Route:');
	for (var i=0;i<o.route.length;i++)
	{  
	   if(o.route[i].scharr=='SOURCE')
	   result=result.concat(o.route[i].station.name).concat(' at ').concat(o.route[i].schdep).concat(', ');
	   else
       result=result.concat(o.route[i].station.name).concat(' at ').concat(o.route[i].scharr).concat(', ');
	}
	console.log("response="+result);
	//callback(second);
	callback(null,result);
	}
	else
	{
	result="Incorrect Details:Please enter correct data";
	//callback(second);	
	callback(null,result);
	}
	}
	else	
	{
	console.log("error..");
	//return err;
	result="Something went wrong,Please try again later";
	callback(null,result);
	return err;
	}
	});	
}


const thirteen = (source, destination, date, callback) => 
{

	var key='';
	source=source.toUpperCase();
	destination=destination.toUpperCase();
	
	var rsource=source.replace(/\s+/, "");
	var rdestination=destination.replace(/\s+/, "") ;
    	var result="Something went wrong,Please try again later";
	var f=0;
	request('http://api.railwayapi.com/v2/name-to-code/station/'+rsource+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	for (var i=0;i<o.stations.length;i++)
	{  
       if(o.stations[i].name==source || o.stations[i].name==rsource || o.stations[i].name.includes(source) || o.stations[i].name.includes(rsource))
	   {
			f=1;
			source=o.stations[i].code;
			break;
	   }
	}
	if(f==0)
		source=o.stations[0].code;
	
	}

	console.log("--->"+source);


	var f1=0;
	request('http://api.railwayapi.com/v2/name-to-code/station/'+rdestination+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	for (var i=0;i<o.stations.length;i++)
	{  
       if(o.stations[i].name==destination || o.stations[i].name==rdestination || o.stations[i].name.includes(destination) || o.stations[i].name.includes(rdestination))
	   {
			f1=1;
			destination=o.stations[i].code;
			break;
	   }
	}
	if(f1==0)
		destination=o.stations[0].code;
	}
        console.log("--->"+destination);
		


	request('http://api.railwayapi.com/v2/between/source/'+source+'/dest/'+destination+'/date/'+date+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	console.log(body);
	var o=JSON.parse(body);
	result='The results are as follows: ';
	for (var i=0;i<o.trains.length && i<=10;i++)
	{  
	   //flag=1;
       var info='Train '+o.trains[i].number+' : '+o.trains[i].name+' takes '+o.trains[i].travel_time+', ';
	   result=result.concat(info);
	}
        callback(null,result);
	}


	});
        });
        });
}


/*
alexa ask travel assistant which trains are arriving at the bangalore station in next three hours

*/
const fourteen = (source,hours,callback) => {
	//var source=req.params.source;
	//var hours=req.params.hours;
	var key='';
	source=source.toUpperCase();
	var rsource=source.replace(/\s+/, "");
    	var result="";
	var f=0;
	request('http://api.railwayapi.com/v2/name-to-code/station/'+rsource+'/apikey/'+key+'/', function (error, response, body) {
    	if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	for (var i=0;i<o.stations.length;i++)
	{  
       if(o.stations[i].name==source || o.stations[i].name==rsource || o.stations[i].name.includes(source) || o.stations[i].name.includes(rsource))
	   {
			f=1;
			source=o.stations[i].code;
			console.log("source="+source);
			break;
	   }
	}
	if(f==0)
		source=o.stations[0].code;
	//callback(second);
	}
	console.log("-->"+source);
	request('http://api.railwayapi.com/v2/arrivals/station/'+source+'/hours/'+hours+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	console.log(body);
	var o=JSON.parse(body);
	result='The results are as follows:  ';
	for (var i=0;i<o.trains.length;i++)
	{  
	   if(o.trains[i].name.length > 5){
       var info=o.trains[i].name+' at '+o.trains[i].scharr+',  ';
	   result=result.concat(info);
	   }
	}
	console.log("response="+result);
	callback(null,result);
	//callback(third);
	}
	else	
	{
	console.log("error..");
	//return err;
	result="Something went wrong,Please try again later";
	callback(null,result);
	return err;
	}
	});
	});
}


/*
alexa ask travel assistant how many seats are available for train with number twelve thousand one between bhopal ndls on eighteen october for cc class in gn quota


*/
const fifteen = (date,source,destination,train,clas,quota,callback) => {
	var key='';
	source=source.toUpperCase();
	destination=destination.toUpperCase();
	var rsource=source.replace(/\s+/, "");
	var rdestination=destination.replace(/\s+/, "") ;
    	var result="";
	var f=0;
	request('http://api.railwayapi.com/v2/name-to-code/station/'+rsource+'/apikey/'+key+'/', function (error, response, body) {
    	if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	for (var i=0;i<o.stations.length;i++)
	{  
       if(o.stations[i].name==source || o.stations[i].name==rsource || o.stations[i].name.includes(source) || o.stations[i].name.includes(rsource))
	   {
			f=1;
			source=o.stations[i].code;
			break;
	   }
	}
	if(f==0)
		source=o.stations[0].code;
	
	}
				console.log("source="+source);
				console.log("1l");	
				//callback(second);

	var f1=0;
	request('http://api.railwayapi.com/v2/name-to-code/name/'+rdestination+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	var o=JSON.parse(body);
	for (var i=0;i<o.stations.length;i++)
	{  
       if(o.stations[i].name==destination || o.stations[i].name==rdestination || o.stations[i].name.includes(destination) || o.stations[i].name.includes(rdestination))
	   {
			f1=1;
			destination=o.stations[i].code;
			break;
	   }
	}
	if(f1==0)
		destination=o.stations[0].code;
	}
	    console.log("destination="+destination);
		console.log("2l");	
		//callback(third);
	console.log("***********"+source+"   "+destination);
	console.log(date+' '+quota+' '+clas+' '+train);
	request('http://api.railwayapi.com/v2/check-seat/train/'+train+'/source/'+source+'/dest/'+destination+'/date/'+date+'/class/'+clas+'/quota/'+quota+'/apikey/'+key+'/', function (error, response, body) {
    if (!error && response.statusCode == 200) 
	{
	console.log(body);
	var o=JSON.parse(body);
	result='The results are as follows for few consecutive days:  ';
	for (var i=0;i<o.availability.length;i++)
	{  
	//	flag=1;
       var info=o.availability[i].date+' : '+o.availability[i].status+'   ';
	   result=result.concat(info);
	}
	console.log("response="+result);
	console.log("3l");	
	//callback(fourth);
	callback(null,result);
	}
	else	
	{
	console.log("error..");
	//return err;
	result="Something went wrong,Please try again later";
	callback(null,result);
	return err;
	}
	
});
});
});	
}

const handlers = {
    'cheapest_flight': function(){
		this.attributes['intent_type']='cheapest_flight';
		this.emit(':ask',"from where do you want to go");     

     },
    'source_name': function(){
		//this.emit(':tell',this.attributes['intent_type']);
		this.attributes['source_name']=this.event.request.intent.slots.source.value;
		this.emit(':ask',"where do you want to go");
     },
    'destination_name': function(){
		//this.emit(':tell',this.attributes['source_name']);
		this.attributes['destination_name']=this.event.request.intent.slots.dest.value;
		this.emit(':ask',"on which date you want to go");
    
     },
    'date_value':function(){
		//this.emit(':tell',this.attributes['intent_type']+" "+this.attributes['source_name']+" "+this.attributes['destination_name']);
		this.attributes['date']=this.event.request.intent.slots.date.value;
		this.attributes['date']=this.attributes['date'].toString();
		this.attributes['source_name']=this.attributes['source_name'].toString();
		this.attributes['destination_name']=this.attributes['destination_name'].toString();
		
		if(this.attributes['intent_type']=='seat_avail_new'){
			this.emit(':ask',"on which class wagon you want to travel");
		}
		this.attributes['date']=this.attributes['date'].replace("-","");
		this.attributes['date']=this.attributes['date'].replace("-","");
		if(this.attributes['intent_type']=='cheapest_flight'){
		first(this.attributes['source_name'], this.attributes['destination_name'], this.attributes['date'], (err, res) => {
			
			this.emit(':tell', res);
		});
		}
		if(this.attributes['intent_type']=='specific_flight_new' || this.attributes['intent_type']=='any_flight_new')
		{
			this.emit(':ask',"on which class you want to travel");
		}
		
     },
    'flight_class_name': function(){
		this.attributes['classtype']=this.event.request.intent.slots.classtype.value;
		if(this.attributes['intent_type']=='specific_flight_new'){
		second(this.attributes['source_name'], this.attributes['destination_name'], this.attributes['date'],this.attributes['airline'],this.attributes['classtype'],(err, res) => {
			
			this.emit(':tell', res);
		});
		}
		if(this.attributes['intent_type']=='any_flight_new')
		{
			third(this.attributes['source_name'], this.attributes['destination_name'], this.attributes['date'],this.attributes['classtype'],(err, res) => {
			
			this.emit(':tell', res);
		});
		}
     },
    'specific_flight_new': function(){
		this.attributes['intent_type']='specific_flight_new';
		this.attributes['airline']=this.event.request.intent.slots.airline.value;
		this.emit(':ask',"from where do you want to go");
     },
    'any_flight_new':function(){
     		this.attributes['intent_type']='any_flight_new';
		this.emit(':ask',"from where do you want to go");
     },
    'enquiry': function(){
       
		var source=this.event.request.intent.slots.source.value;
		var destination=this.event.request.intent.slots.dest.value;
		var date=this.event.request.intent.slots.date.value;
		date=date.toString();
		date=date.replace("-","");
		date=date.replace("-","");

		
		
		first(source, destination, date, (err, res) => {
			
			this.emit(':tell', res);
		});
    },
   'specificflight': function(){
       
		var source=this.event.request.intent.slots.source.value;
		var destination=this.event.request.intent.slots.dest.value;
		var date=this.event.request.intent.slots.date.value;
		var airline=this.event.request.intent.slots.airline.value;
		var classtype=this.event.request.intent.slots.classtype.value;
		
		date=date.toString();
		date=date.replace("-","");
		date=date.replace("-","");

		
		second(source, destination, date,airline,classtype,(err, res) => {
			
			this.emit(':tell', res);
		});
    },

    'anyflight': function(){
       
		var source=this.event.request.intent.slots.source.value;
		var destination=this.event.request.intent.slots.dest.value;
		var date=this.event.request.intent.slots.date.value;
		var classtype=this.event.request.intent.slots.classtype.value;
		
		date=date.toString();
		date=date.replace("-","");
		date=date.replace("-","");

		
		third(source, destination, date,classtype,(err, res) => {
			
			this.emit(':tell', res);
		});
    },

    'nearbyfood': function(){
       
		var loc=this.event.request.intent.slots.loc.value;

		
		fourth(loc,(err, res) => {
			
			this.emit(':tell', res);
		});
    },


    'nearbynature': function(){
       
		var loc=this.event.request.intent.slots.loc.value;

		
		fifth(loc,(err, res) => {
			
			this.emit(':tell', res);
		});
    },
	'nearbyworship': function(){
       
		var loc=this.event.request.intent.slots.loc.value;

		
		sixth(loc,(err, res) => {
			
			this.emit(':tell', res);
		});
    },

    'busavailability': function(){
       
		var source=this.event.request.intent.slots.source.value;
		var dest=this.event.request.intent.slots.dest.value;
		var date=this.event.request.intent.slots.date.value;
		
		date=date.toString();
		date=date.replace("-","");
		date=date.replace("-","");

		
		seventh(source,dest,date,(err, res) => {
			
			this.emit(':tell', res);
		});
    },

    'livetrainstatus': function(){
       
		var no=this.event.request.intent.slots.no.value;
		var date=this.event.request.intent.slots.date.value;

		date=date.toString();
		var day=date.substr(date.lastIndexOf("-")+1,2);
		var month=date.substr(date.indexOf("-")+1,2);
		var year=date.substr(0,4);

		date="";
		date=date.concat(day).concat("-").concat(month).concat("-").concat(year);
		
		eighth(no,date,(err, res) => {
			
			this.emit(':tell', res);
		});
    },


    
	'pnrstatus': function(){
       
		var pnr=this.event.request.intent.slots.pnr.value;


		
		ninth(pnr,(err, res) => {
			
			this.emit(':tell', res);
		});
    },
	'cancelled': function(){
       
		var date=this.event.request.intent.slots.date.value;
		date=date.toString();

		var day=date.substr(date.lastIndexOf("-")+1,2);
		var month=date.substr(date.indexOf("-")+1,2);
		var year=date.substr(0,4);

		date="";
		date=date.concat(day).concat("-").concat(month).concat("-").concat(year);
		
		tenth(date,(err, res) => {
			
			this.emit(':tell', res);
		});
    },
	'rescheduled': function(){
       
		var date=this.event.request.intent.slots.date.value;

		
		date=date.toString();
		var day=date.substr(date.lastIndexOf("-")+1,2);
		var month=date.substr(date.indexOf("-")+1,2);
		var year=date.substr(0,4);

		date="";
		date=date.concat(day).concat("-").concat(month).concat("-").concat(year);

		
		eleventh(date,(err, res) => {
			
			this.emit(':tell', res);
		});
    },
	'trainroute': function(){
       
		var no=this.event.request.intent.slots.no.value;


		
		twelth(no,(err, res) => {
			
			this.emit(':tell', res);
		});
    },

    'trainbetween': function(){
       
	    var source=this.event.request.intent.slots.source.value;
	    var dest=this.event.request.intent.slots.dest.value;
		var date=this.event.request.intent.slots.date.value;

		date=date.toString();
		var day=date.substr(date.lastIndexOf("-")+1,2);
		var month=date.substr(date.indexOf("-")+1,2);
		var year=date.substr(0,4);

		date="";
		date=date.concat(day).concat("-").concat(month).concat("-").concat(year);
		
		
		
		thirteen(source,dest,date,(err, res) => {
			
			this.emit(':tell', res);
		});
    },


    'trainarrivals': function(){
       
		var source=this.event.request.intent.slots.source.value;
		var hours=this.event.request.intent.slots.hours.value;

		
		fourteen(source,hours,(err, res) => {
			
			this.emit(':tell', res);
		});
    },

    'seat_avail_new': function(){
		this.attributes['no']=this.event.request.intent.slots.trainnumber.value;
		this.attributes['intent_type']='seat_avail_new';
		this.emit(':ask',"from where do you want to know");
     },
     'train_class': function(){
		this.attributes['clas']=this.event.request.intent.slots.clas.value;
		this.emit(':ask',"in which quota you want to know");
     },
     'quota_name': function(){
		this.attributes['quota']=this.event.request.intent.slots.quota.value;

		this.attributes['date']=this.attributes['date'].toString();
		var day=this.attributes['date'].substr(this.attributes['date'].lastIndexOf("-")+1,2);
		var month=this.attributes['date'].substr(this.attributes['date'].indexOf("-")+1,2);
		var year=this.attributes['date'].substr(0,4);

		this.attributes['date']="";
		this.attributes['date']=this.attributes['date'].concat(day).concat("-").concat(month).concat("-").concat(year);
		
		fifteen(this.attributes['date'],this.attributes['source_name'],this.attributes['destination_name'],this.attributes['no'],this.attributes['clas'],this.attributes['quota'],(err, res) => {
			
			this.emit(':tell', res);
		});
     },
	'seatavailability': function(){
       
		var date=this.event.request.intent.slots.date.value;
		var source=this.event.request.intent.slots.source.value;
		var dest=this.event.request.intent.slots.dest.value;
		var no=this.event.request.intent.slots.trainnumber.value;
		var clas=this.event.request.intent.slots.clas.value;
		var quota=this.event.request.intent.slots.quota.value;
		
		/*if(clas.indexOf("ac")!=-1)
		{
				if(clas.indexOf("second")!=-1)
				{
						clas="2A";
				}
				if(clas.indexOf("third")!=-1)
				{
						clas="3A";
				}
				if(clas.indexOf("chair")!=-1)
				{
						clas="CC";
				}
				
		
		}
		else
		{
			if(clas.indexOf("sleeper")!=-1)
				clas="SL";
			else
				clas="2S";
		}*/
		

		date=date.toString();
		var day=date.substr(date.lastIndexOf("-")+1,2);
		var month=date.substr(date.indexOf("-")+1,2);
		var year=date.substr(0,4);

		date="";
		date=date.concat(day).concat("-").concat(month).concat("-").concat(year);
		
		fifteen(date,source,dest,no,clas,quota,(err, res) => {
			
			this.emit(':tell', res);
		});
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.NoIntent': function() {
	this.emit(':tell',"Welcome to Trippy-The Travel Assistant");
    },

   'Unhandled': function () {
        
	this.emit(':ask', this.t('Welcome to Trippy-The Travel Assistant- I can help you with details like train status, PNR status, flight details, nearby places etc.'));
 
   },
};
exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = 'amzn1.ask.skill.ed86a569-40e4-4f79-96c7-d238cb0cdb1b';
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};