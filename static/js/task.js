/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-4.html",
	"instructions/instruct-5.html",
	"instructions/instruct-6.html",
	"instructions/instruct-7.html",
	"instructions/instruct-8.html",
	"instructions/instruct-9.html",
	"instructions/instruct-10.html",
	"instructions/instruct-11.html",
	"instructions/instruct-12.html",
	"instructions/instruct-15.html",
	"instructions/instruct-16.html",
	"instructions/instruct-17.html",
	"baseline.html",
	"ISI.html",
	"arrows.html"
];

var subjectData = new Map();
var startTime;

psiTurk.preloadPages(pages);


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

/********************
* STROOP TEST       *
********************/
var InstructionSetOne = function() {

	var instructionPages = [ // add as a list as many pages as you like
		"instructions/instruct-1.html",
		"instructions/instruct-2.html",
		"instructions/instruct-3.html",
		"instructions/instruct-4.html",
		"instructions/instruct-5.html",
		"instructions/instruct-6.html",
		];

	psiTurk.showPage(instructionPages.shift());

	var finish = function() {
		$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new BaselineTest1();
	}

	var next = function() {
		if (instructionPages.length===0){
			finish();
		}
		else {
			psiTurk.showPage(instructionPages.shift());
		}

	};

	var response_handler = function(e) {
		var keyCode = e.keyCode;
		if (keyCode == 32) {
			next();
		}
	};

	$("body").focus().keydown(response_handler); 

}

var BaselineTest1 = function() {

	console.log(psiTurk.taskdata);

	var BaselineInputs = [];
	var BaselineTimes = [];
	var BaselineStart;

    var sample_items = ['beer', 'opera', 'electron', 'awe', 'pillow']
	
	var listening = true;

	psiTurk.showPage("baseline.html")

	current_item = sample_items.shift();
	d3.select("#f").text(current_item);

	var finish = function() {
		subjectData.set("Baseline1 Inputs", BaselineInputs);
		subjectData.set("Baseline1 Times", BaselineTimes);
		currentview = new BreakOne();
	}

	var next = function() {
		if (sample_items.length === 0){
			finish();
		}
		else {
			BaselineStart = new Date();
			setTimeout(ISI,3000);
			psiTurk.showPage("baseline.html");
			current_item = sample_items.shift();
			d3.select("#f").text(current_item);
			d3.select("#t").text('[]')
			listening = true;
		}
	}

	var ISI = function(){
		if(listening != false){
			BaselineInputs.push(NaN);
			BaselineTimes.push(new Date() - BaselineStart);
			listening = false;
		}
		psiTurk.showPage("ISI.html");
		setTimeout(next, 500);
	}

	var response_handler = function(e){
		var keyCode = e.keyCode;
		if((keyCode == 89 || keyCode == 78) && listening === true){
			d3.select("#t").text(e.key);
			listening = false;
			BaselineTimes.push(new Date() - BaselineStart);
			BaselineInputs.push(e.key);
		}
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	setTimeout(ISI,3000);
	BaselineStart = new Date();

}

var BreakOne = function() {
	
	var time = 21;

	psiTurk.showPage("instructions/instruct-7.html")

	var finish = function(){
		clearInterval(interval);
		currentview = new FlankerInstructionsOne()
	}

	var countdown = function(){
		if(time == 0){
			finish();
		}
		else{
			time = time - 1;
			d3.select("#timer").text(time);
		}
	}

	var interval = setInterval(countdown, 1000);

}

var FlankerInstructionsOne = function() {

	var instructionPages = [ // add as a list as many pages as you like
		"instructions/instruct-8.html",
		"instructions/instruct-9.html",
		];

	psiTurk.showPage(instructionPages.shift());

	var finish = function() {
		$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new FlankerTaskOne();
	}

	var next = function() {
		if (instructionPages.length===0){
			finish();
		}
		else {
			psiTurk.showPage(instructionPages.shift());
		}

	};

	var response_handler = function(e) {
		var keyCode = e.keyCode;
		if (keyCode == 32) {
			next();
		}
	};

	$("body").focus().keydown(response_handler); 

}

var FlankerTaskOne = function() {

	var Flanker1Inputs = [];
	var Flanker1Times = [];
	var Flanker1Start;

	var arrows = ["<<><<", ">>>>>", ">><<>", "><><>", "<><><"]
	
	var listening = true;

	psiTurk.showPage("arrows.html")

	current_arrows = arrows.shift()
	d3.select('#test').select('#text').text(current_arrows);

	var finish = function() {
		subjectData.set("Flanker1 Inputs", Flanker1Inputs);
		subjectData.set("Flanker1 Times", Flanker1Times);
		console.log(subjectData);
		currentview = new BreakTwo();
	}

	var next = function() {
		if (arrows.length === 0){
			finish();
		}
		else {
			Flanker1Start = new Date();
			setTimeout(ISI,3000);
			psiTurk.showPage("arrows.html");
			current_arrows = arrows.shift();
			d3.select('#test').select('#text').text(current_arrows);
			d3.select("#entry").text('[]');
			listening = true;
		}
	}

	var ISI = function(){
		if(listening != false){
			Flanker1Inputs.push(NaN);
			Flanker1Times.push(new Date() - Flanker1Start);
			listening = false;
		}
		psiTurk.showPage("ISI.html");
		setTimeout(next, 500);
	}

	var response_handler = function(e){
		if((e.key == '<' || e.key == '>' || e.key == ',' || e.key == '.') && listening === true){
			if(e.key == '<' || e.key == ','){
				d3.select("#entry").text('left');
			}
			if(e.key == '>' || e.key == '.'){
				d3.select("#entry").text('right');
			}
			listening = false;
			Flanker1Times.push(new Date() - Flanker1Start);
			Flanker1Inputs.push(e.key);
		}
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	Flanker1Start = new Date();
	setTimeout(ISI,3000);

}

var BreakTwo = function() {
	
	var time = 21;

	psiTurk.showPage("instructions/instruct-10.html")

	var finish = function(){
		clearInterval(interval);
		currentview = new InstructionSetTwo();
	}

	var countdown = function(){
		if(time == 0){
			finish();
		}
		else{
			time = time - 1;
			d3.select("#timer").text(time);
		}
	}

	var interval = setInterval(countdown, 1000);

}

var InstructionSetTwo = function() {

	var instructionPages = [ // add as a list as many pages as you like
		"instructions/instruct-11.html"
		];

	psiTurk.showPage(instructionPages.shift());

	var finish = function() {
		$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new BaselineTest2();
	}

	var next = function() {
		if (instructionPages.length===0){
			finish();
		}
		else {
			psiTurk.showPage(instructionPages.shift());
		}

	};

	var response_handler = function(e) {
		var keyCode = e.keyCode;
		if (keyCode == 32) {
			next();
		}
	};

	$("body").focus().keydown(response_handler); 

}

var BaselineTest2 = function() {

	console.log(psiTurk.taskdata);

	var BaselineInputs = [];
	var BaselineTimes = [];
	var BaselineStart;

    var sample_items = ['beer', 'opera', 'electron', 'awe', 'pillow']
	
	var listening = true;

	psiTurk.showPage("baseline.html")

	current_item = sample_items.shift();
	d3.select("#f").text(current_item);

	var finish = function() {
		subjectData.set("Baseline2 Inputs", BaselineInputs);
		subjectData.set("Baseline2 Times", BaselineTimes);
		currentview = new BreakThree();
	}

	var next = function() {
		if (sample_items.length === 0){
			finish();
		}
		else {
			BaselineStart = new Date();
			setTimeout(ISI,3000);
			psiTurk.showPage("baseline.html");
			current_item = sample_items.shift();
			d3.select("#f").text(current_item);
			d3.select("#t").text('[]')
			listening = true;
		}
	}

	var ISI = function(){
		if(listening != false){
			BaselineInputs.push(NaN);
			BaselineTimes.push(new Date() - BaselineStart);
			listening = false;
		}
		psiTurk.showPage("ISI.html");
		setTimeout(next, 500);
	}

	var response_handler = function(e){
		var keyCode = e.keyCode;
		if((keyCode == 89 || keyCode == 78) && listening === true){
			d3.select("#t").text(e.key);
			listening = false;
			BaselineTimes.push(new Date() - BaselineStart);
			BaselineInputs.push(e.key);
		}
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	setTimeout(ISI,3000);
	BaselineStart = new Date();

}

var BreakThree = function() {
	
	var time = 21;

	psiTurk.showPage("instructions/instruct-12.html")

	var finish = function(){
		clearInterval(interval);
		currentview = new FlankerInstructionsTwo();
	}

	var countdown = function(){
		if(time == 0){
			finish();
		}
		else{
			time = time - 1;
			d3.select("#timer").text(time);
		}
	}

	var interval = setInterval(countdown, 1000);

}

var FlankerInstructionsTwo = function() {

	var instructionPages = [ // add as a list as many pages as you like
		"instructions/instruct-8.html",
		"instructions/instruct-9.html",
		];

	psiTurk.showPage(instructionPages.shift());

	var finish = function() {
		$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new FlankerTaskTwo();
	}

	var next = function() {
		if (instructionPages.length===0){
			finish();
		}
		else {
			psiTurk.showPage(instructionPages.shift());
		}

	};

	var response_handler = function(e) {
		var keyCode = e.keyCode;
		if (keyCode == 32) {
			next();
		}
	};

	$("body").focus().keydown(response_handler); 

}

var FlankerTaskTwo = function() {

	var Flanker1Inputs = [];
	var Flanker1Times = [];
	var Flanker1Start;

	var arrows = ["<<><<", ">>>>>", ">><<>", "><><>", "<><><"]
	
	var listening = true;

	psiTurk.showPage("arrows.html")

	current_arrows = arrows.shift()
	d3.select('#test').select('#text').text(current_arrows);

	var finish = function() {
		subjectData.set("Flanker2 Inputs", Flanker1Inputs);
		subjectData.set("Flanker2 Times", Flanker1Times);
		currentview = new BreakFour();
	}

	var next = function() {
		if (arrows.length === 0){
			finish();
		}
		else {
			Flanker1Start = new Date();
			setTimeout(ISI,3000);
			psiTurk.showPage("arrows.html");
			current_arrows = arrows.shift();
			d3.select('#test').select('#text').text(current_arrows);
			d3.select("#entry").text('[]');
			listening = true;
		}
	}

	var ISI = function(){
		if(listening != false){
			Flanker1Inputs.push(NaN);
			Flanker1Times.push(new Date() - Flanker1Start);
			listening = false;
		}
		psiTurk.showPage("ISI.html");
		setTimeout(next, 500);
	}

	var response_handler = function(e){
		if((e.key == '<' || e.key == '>' || e.key == ',' || e.key == '.') && listening === true){
			if(e.key == '<' || e.key == ','){
				d3.select("#entry").text('left');
			}
			if(e.key == '>' || e.key == '.'){
				d3.select("#entry").text('right');
			}
			listening = false;
			Flanker1Times.push(new Date() - Flanker1Start);
			Flanker1Inputs.push(e.key);
		}
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	Flanker1Start = new Date();
	setTimeout(ISI,3000);

}

var BreakFour = function() {
	
	var time = 21;

	psiTurk.showPage("instructions/instruct-15.html")

	var finish = function(){
		clearInterval(interval);
		currentview = new InstructionSetThree();
	}

	var countdown = function(){
		if(time == 0){
			finish();
		}
		else{
			time = time - 1;
			d3.select("#timer").text(time);
		}
	}

	var interval = setInterval(countdown, 1000);

}

var InstructionSetThree = function() {

	var instructionPages = [ // add as a list as many pages as you like
		"instructions/instruct-11.html"
		];

	psiTurk.showPage(instructionPages.shift());

	var finish = function() {
		$("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new BaselineTest3();
	}

	var next = function() {
		if (instructionPages.length===0){
			finish();
		}
		else {
			psiTurk.showPage(instructionPages.shift());
		}

	};

	var response_handler = function(e) {
		var keyCode = e.keyCode;
		if (keyCode == 32) {
			next();
		}
	};

	$("body").focus().keydown(response_handler); 

}

var BaselineTest3 = function() {

	console.log(psiTurk.taskdata);

	var BaselineInputs = [];
	var BaselineTimes = [];
	var BaselineStart;

    var sample_items = ['beer', 'opera', 'electron', 'awe', 'pillow']
	
	var listening = true;

	psiTurk.showPage("baseline.html")

	current_item = sample_items.shift();
	d3.select("#f").text(current_item);

	var finish = function() {
		subjectData.set("Baseline3 Inputs", BaselineInputs);
		subjectData.set("Baseline3 Times", BaselineTimes);
		currentview = new ConcludingScreen();
	}

	var next = function() {
		if (sample_items.length === 0){
			finish();
		}
		else {
			BaselineStart = new Date();
			setTimeout(ISI,3000);
			psiTurk.showPage("baseline.html");
			current_item = sample_items.shift();
			d3.select("#f").text(current_item);
			d3.select("#t").text('[]')
			listening = true;
		}
	}

	var ISI = function(){
		if(listening != false){
			BaselineInputs.push(NaN);
			BaselineTimes.push(new Date() - BaselineStart);
			listening = false;
		}
		psiTurk.showPage("ISI.html");
		setTimeout(next, 500);
	}

	var response_handler = function(e){
		var keyCode = e.keyCode;
		if((keyCode == 89 || keyCode == 78) && listening === true){
			d3.select("#t").text(e.key);
			listening = false;
			BaselineTimes.push(new Date() - BaselineStart);
			BaselineInputs.push(e.key);
		}
	}

	//d3.select('#test').append('img').attr('src', '/static/images/' + current_image);

	$("body").focus().keydown(response_handler);

	setTimeout(ISI,3000);
	BaselineStart = new Date();

}


var ConcludingScreen = function(){

	psiTurk.showPage('instructions/instruct-17.html');

	subjectData.set("TotalTime", new Date() - startTime);

	var params = new URLSearchParams(location.search);
	var workerId = params.get('workerId');
	var assignmentId = params.get('assignmentId');
	var hitId = params.get('hitId')

	subjectData.set("workerId", workerId);
	subjectData.set("assignmentId", assignmentId);
	subjectData.set("hitId", hitId);

	for(const[key,value] of subjectData.entries()) {
		psiTurk.recordUnstructuredData(key, value);
	}

	psiTurk.saveData();

	console.log(psiTurk.taskdata.get('workerId'));

}

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){

	startTime = new Date();
	currentview = new InstructionSetOne();
	
});
