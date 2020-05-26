
window.onload = loadcheckURLOptions;

function htmltojson(){
	var jsonobject = [];
	var Groups = document.getElementById('jsonbuilder').getElementsByClassName('Group');
	for (var i = 0; i < Groups.length; i++) {
		var GroupsDiscriptionList = Groups[i].getElementsByTagName('dl');
		var GroupName = GroupsDiscriptionList[0].getElementsByTagName('dt')[0].getElementsByTagName('input')[0].value;
		var GroupDescription = GroupsDiscriptionList[0].getElementsByTagName('dd')[0].getElementsByTagName('input')[0].value;
		if(GroupName != ""){
			var newobj = {}, newgroup = [];
			newobj.Name = GroupName;
			newobj.Description = GroupDescription;
			newobj.Items = [];		 
			newobj.ChoiceType = [];		 
			var GroupChoiceList = GroupsDiscriptionList[0].getElementsByTagName('ul')[0];
			var Choices = GroupChoiceList.getElementsByTagName('input');
			if(Choices.length > 0){
				for (var k = 0; k < Choices.length; k++) {
					var newchoice = {};		
					if(Choices[k].value != ""){
						newchoice.Name = Choices[k].value;
						newobj.ChoiceType.push(newchoice);
					}
				}
			} else {				
				var newchoiceGeneral = {};		
				newchoiceGeneral.Name = "General";
				newobj.ChoiceType.push(newchoiceGeneral);				
			}
			var GroupItemList = GroupsDiscriptionList[0].getElementsByTagName('dl');
			var items = GroupItemList[0].getElementsByTagName('dt');
			var itemsdescription = GroupItemList[0].getElementsByTagName('dd');	
			for (var j = 0; j < items.length; j++) {
				var newitem = {};		
				if(items[j].getElementsByTagName('input')[0].value != ""){
					newitem.Name = items[j].getElementsByTagName('input')[0].value;
					newitem.Description = itemsdescription[j].getElementsByTagName('input')[0].value;
					newitem.Rating = items[j].getElementsByTagName('input')[0].getAttribute('data-rating');
					newobj.Items.push(newitem);
				} else {
					// var x = confirm("Empty item name do you wish to continue? (Note this item will be ingored and removed)");
					// if (x != true) {
						// return;
					// }					
				}
			}
			jsonobject.push(newobj);
		} else {
			// var r = confirm("Empty group name do you wish to continue? (Note this entire group will be ingored and removed including all items in the group)");
			// if (r != true) {
				// return;
			// }
		}
	}
	document.getElementById('jsonhidden').innerHTML = JSON.stringify(jsonobject);
	document.getElementById('jsonbuilder').innerHTML = "";	
	document.getElementById('editjson').style.display = "none";
	document.getElementById('btnEditItems').style = "";
	document.getElementById('imgurUpload').style = "";
	document.getElementById('CustomShare').style = "";
	RateItems();
}
function htmlfromjson(){
	document.getElementById("ratingIndex").innerHTML = "";
	document.getElementById("divDisplay").innerHTML = "";
	document.getElementById('btnEditItems').style.display = "none";
	document.getElementById('imgurUpload').style.display = "none";
	document.getElementById('CustomShare').style.display = "none";
	document.getElementById('editjson').style = "";
	var jsonobject = JSON.parse(document.getElementById('jsonhidden').innerHTML);
	var htmlarea = document.getElementById('jsonbuilder');
	htmlarea.innerHTML = "";
	for (var i = 0; i < jsonobject.length; i++) {
		var innerhtml = "";
		var newelem = document.createElement('li');
		newelem.className = "Group";
		newelem.id = "Group" + i;
		innerhtml = "<dl><dt><input value='" + jsonobject[i].Name + "' ></dt><dd><input value='" + jsonobject[i].Description + "' ><button onclick='deleteNode(\"deleteGroup\"," + i + ")'>Delete Group</button><button onclick='newitem(\"Group" + i + "\")'>New Item</button><button onclick='newchoice(\"Group" + i + "\")'>New Choice</button></dd>";
		innerhtml = innerhtml + "<ul><span style='display:none;' class='maxchoice'>" + jsonobject[i].ChoiceType.length + "</span>";
		for (var k = 0; k < jsonobject[i].ChoiceType.length; k++) {
			innerhtml = innerhtml + "<li id='li" + i + "-" + k+ "'><input value='" + jsonobject[i].ChoiceType[k].Name + "' ><button onclick='deleteNode(\"deleteChoice\",\"" + i + "-" + k + "\")'>Delete Choice</button></li>";
		}
		innerhtml = innerhtml + "</ul><dl><span style='display:none;' class='maxitem'>" + jsonobject[i].Items.length + "</span>";
		for (var j = 0; j < jsonobject[i].Items.length; j++) {
			ratingnumber = 0;
			ratingnumber = jsonobject[i].Items[j].Rating;
			innerhtml = innerhtml + "<dt id='dt" + j + "-" + i+ "'><input data-rating='" + ratingnumber + "' value='" + jsonobject[i].Items[j].Name + "' ></dt><dd id='dd" + j + "-" + i+ "'><input value='" + jsonobject[i].Items[j].Description + "' ><button onclick='deleteNode(\"deleteItem\",\"" + j + "-" + i + "\")'>Delete Item</button></dd>";
		}
		newelem.innerHTML = innerhtml + "</dl></dl>";
		htmlarea.appendChild(newelem);
		document.getElementById('maxGroupNumber').innerHTML = i;
	}
}

function newitem(id){
	var group = document.getElementById(id);
	var numberitems = group.getElementsByClassName('maxitem')[0];
	var currentnumberitems = numberitems.innerHTML * 1;
	var itemscontainer = group.getElementsByTagName('dl')[1];
	var groupnumber = id.replace("Group", "") * 1;
	var innerhtmldt = "";
	var innerhtmldd = "";
	var newelemdt = document.createElement('dt');
	var newelemdd = document.createElement('dd');
	newelemdt.id = "dt" + (currentnumberitems + 1) + "-" + groupnumber;
	newelemdd.id = "dd" + (currentnumberitems + 1) + "-" + groupnumber;
	innerhtmldt = "<input data-rating='0' >"
	innerhtmldd = "<input><button onclick='deleteNode(\"deleteItem\",\"" + (currentnumberitems + 1) + "-" + groupnumber + "\")'>Delete Item</button>";
	newelemdd.innerHTML = innerhtmldd;
	newelemdt.innerHTML = innerhtmldt;
	itemscontainer.appendChild(newelemdt);
	itemscontainer.appendChild(newelemdd);
	
	numberitems.innerHTML = currentnumberitems + 1;
}
function newchoice(id){
	var group = document.getElementById(id);
	var numberitems = group.getElementsByClassName('maxchoice')[0];
	var currentnumberitems = numberitems.innerHTML * 1;
	var itemscontainer = group.getElementsByTagName('ul')[0];
	var groupnumber = id.replace("Group", "") * 1;
	var innerhtmlli = "";
	var newelemli = document.createElement('li');
	newelemli.id = "li" + (currentnumberitems + 1) + "-" + groupnumber;
	innerhtmlli = "<input><button onclick='deleteNode(\"deleteChoice\",\"" + (currentnumberitems + 1) + "-" + groupnumber + "\")'>Delete Choice</button>";
	newelemli.innerHTML = innerhtmlli;
	itemscontainer.appendChild(newelemli);
	
	numberitems.innerHTML = currentnumberitems + 1;
	
}

function newgroup(){
	var htmlarea = document.getElementById('jsonbuilder');
	var innerhtml = "";
	var newelem = document.createElement('li');
	var MaxGroupelem = document.getElementById('maxGroupNumber');
	var currentMaxGroup = (MaxGroupelem.innerHTML * 1);
	newelem.id = "Group" + (currentMaxGroup + 1);
	
	innerhtml = "<dl><dt><span style='display:none;' class='maxitem'>-1</span><input></dt><dd><input><button onclick='deleteNode(\"deleteGroup\"," + (currentMaxGroup + 1) + ")'>Delete Group</button><button onclick='newitem(\"Group" + (currentMaxGroup + 1) + "\")'>New Item</button></dd><dl></dl></dl>";
	newelem.innerHTML = innerhtml;
	htmlarea.appendChild(newelem);
	
	MaxGroupelem.innerHTML = currentMaxGroup + 1;
}

function deleteNode(type, id){
	switch(type) {
	  case "deleteItem":
		document.getElementById("dt"+id).parentNode.removeChild(document.getElementById("dt"+id));
		document.getElementById("dd"+id).parentNode.removeChild(document.getElementById("dd"+id));
		break;
	  case "deleteGroup":
		document.getElementById("Group"+id).parentNode.removeChild(document.getElementById("Group"+id));
		break;
	  case "deleteChoice":
		document.getElementById("li"+id).parentNode.removeChild(document.getElementById("li"+id));
		break;
	  default:
		// code block
	}
}

function RateItems(){
	var DisplayArea = document.getElementById("divDisplay");
	var IndexArea = document.getElementById("ratingIndex");
	IndexArea.innerHTML = "";
	var ratings = JSON.parse(document.getElementById("ratingshidden").innerHTML);
	var jsonobject = JSON.parse(document.getElementById('jsonhidden').innerHTML);
	DisplayArea.innerHTML = "";
	for (var l = 0; l < ratings.length; l++) {
		var newratingIndex = document.createElement('span');
		var innerhtmlratingindex = ratings[l].Name + " = " + ratings[l].Description;
		newratingIndex.innerHTML = innerhtmlratingindex;
		IndexArea.appendChild(newratingIndex);
	}

	for (var i = 0; i < jsonobject.length; i++) {
		var newelem = document.createElement('div');
		var newelemtable = document.createElement('table');
		var newelemthead = document.createElement('thead');
		var newelemtbody = document.createElement('tbody');
		var innerhtmlthead = "<thead><tr><th>" + jsonobject[i].Name + " - " + jsonobject[i].Description + "</th>";
		for (var b = 0; b < jsonobject[i].ChoiceType.length; b++) {
			innerhtmlthead = innerhtmlthead + "<th colspan='" + ratings.length + "'>" + jsonobject[i].ChoiceType[b].Name + "</th>";
		}
		innerhtmlthead = innerhtmlthead + "</tr><tr><th></th>";
		for (var b = 0; b < jsonobject[i].ChoiceType.length; b++) {
		for (var a = 0; a < ratings.length; a++) {
			innerhtmlthead = innerhtmlthead + "<th>" + ratings[a].Name + "</th>";
		}}
		innerhtmlthead = innerhtmlthead + "</tr></thead>";
		var innerhtmltbody = "";
		for (var j = 0; j < jsonobject[i].Items.length; j++) {
			innerhtmltbody = innerhtmltbody + "<tr><td>" + jsonobject[i].Items[j].Name + " - " + jsonobject[i].Items[j].Description + "</td>";
			
			for (var k = 0; k < jsonobject[i].ChoiceType.length; k++) {
				for (var l = 0; l < ratings.length; l++) {
					var ratinglist = jsonobject[i].Items[j].Rating.split(",");
					var checked = "";
					if(ratinglist.length < jsonobject[i].ChoiceType.length && ratings[l].Name == 0) {checked = "checked";}
					else if((ratinglist[k] * 1) == (ratings[l].Name * 1)){checked = "checked";}
					innerhtmltbody = innerhtmltbody + "<td><input " + checked + " type='radio' name='" + i + "-" + j + "-" + k + "' id='" + i + "-" + j + "-" + ratings[l].Name + "-" + k + "' oninput='saveresults()'><label class='rating" + l + "' for='" + i + "-" + j + "-" + ratings[l].Name + "-" + k + "'></label></td>";
				}
			}
			
			innerhtmltbody = innerhtmltbody + "</tr>";
		}
		newelemthead.innerHTML = innerhtmlthead;
		newelemtbody.innerHTML = innerhtmltbody;
		newelemtable.appendChild(newelemthead);
		newelemtable.appendChild(newelemtbody);
		newelem.appendChild(newelemtable);
		DisplayArea.appendChild(newelem);
	}
	saveresults();
}

function saveresults(){
	var DisplayArea = document.getElementById("divDisplay");
	var checkedBoxes = DisplayArea.querySelectorAll('input[type=radio]:checked');
	var jsonobject = JSON.parse(document.getElementById('jsonhidden').innerHTML);	
	for (var i = 0; i < checkedBoxes.length; i++) {
		var result = checkedBoxes[i].id.split("-");
		if(result[3] > 0){
			jsonobject[result[0]].Items[result[1]].Rating = jsonobject[result[0]].Items[result[1]].Rating + "," + result[2];
		} else if(result[3] == 0){
			jsonobject[result[0]].Items[result[1]].Rating = result[2];
		}
	}
	document.getElementById('jsonhidden').innerHTML = JSON.stringify(jsonobject);	
}

function createImage(){
	var DisplayArea = document.getElementById("divDisplay");
	var checkedBoxes = DisplayArea.querySelectorAll('input[type=radio]:checked');
	var jsonobject = JSON.parse(document.getElementById('jsonhidden').innerHTML);
	var ratings = JSON.parse(document.getElementById("ratingshidden").innerHTML);
	var height = ((checkedBoxes.length + (jsonobject.length * 2)) * 12);
	
	var divImage = document.getElementById("divImage");
	divImage.innerHTML = "";
	var c = document.createElement('canvas');
	c.width = 370;
	c.height = height + 12 + 10;
	c.style.border = "1px solid black";
	var yheight = 14;
	var ctx = c.getContext("2d");
	ctx.font = "12px Arial";
	ctx.textAlign = "left";
	
	var RatingString = "";
	for (var k = 0; k < ratings.length; k++) {		
		RatingString = RatingString + " | " + ratings[k].Name + " = " + ratings[k].Description;
	}
	RatingString = RatingString + " | ";
	ctx.fillText(RatingString,10,yheight);
	yheight = yheight + 24;
	
	for (var i = 0; i < jsonobject.length; i++) {
		ctx.fillText(jsonobject[i].Name + " - " + jsonobject[i].Description,10,yheight);
		yheight = yheight + 12;
		for (var j = 0; j < jsonobject[i].Items.length; j++) {
			ctx.fillText(jsonobject[i].Items[j].Name + " - " + jsonobject[i].Items[j].Description,10,yheight);
			ctx.fillText(jsonobject[i].Items[j].Rating,350,yheight);			
			yheight = yheight + 12;
		}
		yheight = yheight + 12;
	}
	var img = c.toDataURL("image/png");
	//divImage.innerHTML = img;
	divImage.appendChild(c);
	//document.write('<img src="'+img+'"/>');
	//imgurUpload(img,"");
}

function imgurUpload(image, token) {
	var imgurClientId = '9db53e5936cd02f';
	var resultImgur = document.getElementById("resultImgur");
	fetch('https://api.imgur.com/3/image', {
		method: 'post',
		headers: {
			'Authorization': 'Client-ID ' + imgurClientId,
			'Accept': 'application/json',
			'Content-type': 'application/json'//'application/x-www-form-urlencoded; charset=UTF-8'
		},
		body: JSON.stringify({
			image:  image.split(',')[1],
			type: 'base64'			
		})//'foo=bar&lorem=ipsum'
	})
		//.then(json)
		.then(response=>response.json())
		.then(function (data) {
			var url = 'https://i.imgur.com/' + data.data.id + '.png';
			resultImgur.innerHTML = url;
		})
		.catch(function (error) {
			resultImgur.innerHTML = "Request Failed";
		});		
}

function shareOptions(){
	var getUrl = window.location;	
	var jsonobject = JSON.parse(document.getElementById('jsonhidden').innerHTML);
	var base64Options = window.btoa(JSON.stringify(jsonobject));
	var baseUrl = getUrl.protocol + "//" + getUrl.pathname + "?GroupList=" + base64Options;
	copy(baseUrl);
}

function loadcheckURLOptions(){
	var urlParams = new URLSearchParams(window.location.search);
	var myParam = urlParams.get('GroupList');
	if(myParam != "" && myParam != null){
		var decoded = window.atob(myParam);
		var Options = JSON.parse(decoded);
		document.getElementById('jsonhidden').innerHTML = JSON.stringify(Options);
	}
	RateItems();
}

function copy(text) {
    var input = document.createElement('textarea');
    input.innerHTML = text;
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
}

function editRating(){
	document.getElementById("divDisplay").innerHTML = "";
	var divRatingEdit = document.getElementById("divRatingEdit");
	var ratings = JSON.parse(document.getElementById("ratingshidden").innerHTML);
	for (var k = 0; k < ratings.length; k++) {
		var newelem = document.createElement('div');
		newelem.id = "Rating" + k;
		var innerhtml = "<input value='" + ratings[k].Description + "'><input type='color' value='" + ratings[k].Colour + "'>";
		newelem.innerHTML = innerhtml;
		divRatingEdit.appendChild(newelem);		
	}
}

function saveRatingsNames(){
	var ratings = JSON.parse(document.getElementById("ratingshidden").innerHTML);
	for (var k = 0; k < ratings.length; k++) {
		var ratingContainer = document.getElementById("Rating" + k);
		ratings[k].Colour = ratingContainer.getElementsByTagName('input')[1].value;
		ratings[k].Description = ratingContainer.getElementsByTagName('input')[0].value;
		document.documentElement.style.setProperty('--rating' + k, ratings[k].Colour);
	}
	
	document.getElementById("divRatingEdit").innerHTML = "";
	RateItems();
}
