

var contactList = Array();
var idCounter = 0;


function main(){

	document.getElementById("searchbox").addEventListener("keypress", function() {	
			searchContacts();
	});

	$(document).on("click", "#sortOnName", function() { sortContacts("name"); });
	$(document).on("click", "#sortOnPhone", function() { sortContacts("phone"); });
	$(document).on("click", "#sortOnEmail", function() { sortContacts("email"); });
	
	$(document).on("click", "#createContact", function() { createForm(null); });
	
	for(var i = 0; i < 5; i++){
		createExampleEntry();
	}
}


function entry(name, phone, email){
	this.name = name;
	this.phone = phone;
	this.email = email;
	this.id = "e"+idCounter++;
}


function createExampleEntry(){

	var firstNames = ["Eric", "Mary", "Jane", "Barack", "Vladimir", "Pjotir"];
	var lastNames = ["Smith", "Johnson", "McDuck"];
	var emailProviders = ["gmail.com", "yahoo.com", "lyse.net", "aol.com", "hotmail.com"];
	
	var selFirstName = firstNames[Math.floor((Math.random() * firstNames.length))];
	var selLastName = lastNames[Math.floor((Math.random() * lastNames.length) )];
	var selEmail = emailProviders[Math.floor((Math.random() * emailProviders.length))];

	var phone = "";
	
	for(var i = 0; i < 8; i++){
		phone += Math.floor((Math.random() * 9) + 1);
	}
		
	var obj = new entry(selFirstName+" "+selLastName, phone, selFirstName+"@"+selEmail);
	contactList.push(obj);
	
	createJEntry(obj);
}


function createJEntry(obj){
	
	var uuid = obj.id;
	
	var contactTable = $("#entries");
	
	var newRow = $('<tr>', { id: uuid});
	var newCell = $('<td>', {});
	var newTable = $('<table>', { class: "entryTable"});
	
	var nameRow =  $('<tr>', { class: "entryRow"});
	var phoneRow = $('<tr>', { class: "entryRow"});
	var emailRow = $('<tr>', { class: "entryRow"});
	
	var nameCell =  $('<td>',  {});
	var phoneCell = $('<td>', {});
	var emailCell = $('<td>', {});
	
	var deleteCell = $('<td>',  { });
	var editCell = $('<td>',  { });
	
	nameCell.append( $('<p>', { text: obj.name, style: "font-weight: bold;"}));
	phoneCell.append($('<p>', { text: obj.phone}));
	emailCell.append($('<a>', { text: obj.email, href: "mailto:"+obj.email}));
	
	editCell.append($('<img/>',   {src: "icons/edit.png", class: "icon",  id: 'edit'+uuid }));
	deleteCell.append($('<img/>', {src: "icons/delete.png", class: "icon", id: 'del'+uuid }));
	
	nameRow.append(nameCell);
	nameRow.append(editCell);
	phoneRow.append(phoneCell);
	phoneRow.append(deleteCell);
	emailRow.append(emailCell);
	
	newTable.append(nameRow);
	newTable.append(phoneRow);
	newTable.append(emailRow);
	
	newCell.append(newTable);
	newRow.append(newCell);
	contactTable.append(newRow);
	
	$("#entries").on('click', '#del'+uuid , function()  { deleteEntry(uuid); });
	$("#entries").on('click', '#edit'+uuid , function() { editEntry(uuid);   });
	
}


function createForm(obj){

	clearTable();

	var createNew = false;

	if(obj === null){
		createNew = true;
		obj = new entry("","","");
	}

	
	var contactTable = $("#entries");
	
	var newRow = $('<tr>', {});
	var newCell = $('<td>', {});
	var newTable = $('<table>', { class: "entryTable"});
	
	var nameRow =  $('<tr>', { class: "entryRow"});
	var phoneRow = $('<tr>', { class: "entryRow"});
	var emailRow = $('<tr>', { class: "entryRow"});
	
	
	var nameLabelCell =  $('<td>',{text: "Name:"});
	var phoneLabelCell = $('<td>', {text: "Phone:"});
	var emailLabelCell = $('<td>', {text: "Email:"});
	
	var nameCell =  $('<td>',{});
	var phoneCell = $('<td>', {});
	var emailCell = $('<td>', {});
	var saveCell = $('<td>', {});
	var cancelCell = $('<td>', {});
		
	nameCell.append( $('<input>', { type: "text", id: 'name'}).val(obj.name));
	phoneCell.append($('<input>', { type: "text", id: 'phone'}).val(obj.phone));
	emailCell.append($('<input>', { type: "text", id: 'email'}).val(obj.email));

	saveCell.append($('<img/>',   {src: "icons/edit.png", class: "icon",  id: 'save' }));
	cancelCell.append($('<img/>', {src: "icons/delete.png", class: "icon", id: 'cancel' }));
	
	nameRow.append(nameLabelCell);
	phoneRow.append(phoneLabelCell);
	emailRow.append(emailLabelCell);
	
	
	nameRow.append(nameCell);
	phoneRow.append(phoneCell);
	emailRow.append(emailCell);
	nameRow.append(saveCell);
	phoneRow.append(cancelCell);
	
	newTable.append(nameRow);
	newTable.append(phoneRow);
	newTable.append(emailRow);
	
	
	newCell.append(newTable);
	newRow.append(newCell);
	contactTable.append(newRow);
	
	
	$("#entries").on('click', '#save' , function() { 
		
		var chkName =  $('#name').val();
		var chkPhone = $('#phone').val();
		var chkEmail = $('#email').val();	
		
		if(chkName.length > 0){
		
			var movPhone = chkPhone.length !== 0;
			var movEmail = chkEmail.length !== 0;
			var valEmail = validateEmail(chkEmail);
			var valPhone = validatePhone(chkPhone);	
			
			if((movPhone && valPhone || !movPhone && valEmail && movEmail) && (movEmail && valEmail || !movEmail && valPhone && movPhone)){
			
				obj.name =  chkName;
				obj.phone = chkPhone;
				obj.email = chkEmail;
	
				if(createNew == true){
					contactList.push(obj);
				}
				
				fillTableWithEntries();
			}
			
		}else{
			alert("Name too short!");
		}
	});
	
	
	$("#entries").on('click', '#cancel' , function() { 
		fillTableWithEntries();
	});
}


function validateEmail(email) {
    
	if(email.length == 0){
		return false;
    }
	
    var atpos = email.indexOf("@");
    var dotpos = email.lastIndexOf(".");
	
    if (atpos < 1 || dotpos<atpos+2 || dotpos+2>=email.length) {
			alert("Not a valid e-mail address");
		return false;
    }
	
	return true;
}


function validatePhone(phone){

	if(phone.length == 0){
		return false;
    }


	for(var i = 0; i < phone.length; i++){
	
		var c = phone.charCodeAt(i);
	
		if( !(c >= 48 && c <= 57) && c != 40 && c != 41 && c != 43 && c != 45){
			alert("Invalid phone number");
			return false;
		}	
	}

	return true;
}


function editEntry(uuid){
	createForm(getEntryFromId(uuid));
}


function deleteEntry(uuid){
	$( "#"+uuid ).remove();
	
	var obj = getEntryFromId(uuid);

	for (var i = 0; i < contactList.length; i++) {
		
		var obj = contactList[i];
		
		if(uuid === obj.id){
			contactList.splice(i, 1);
			break;
		}
	}

	fillTableWithEntries();	
}


function clearTable(){

	$("#entries").off();
	$("#entries").empty();	
}


function fillTableWithEntries(){

	clearTable();

	for (var i = 0; i < contactList.length; i++) {
		createJEntry(contactList[i]);
	}
}

function getEntryFromId(uuid){

	for (var i = 0; i < contactList.length; i++) {
		
		var obj = contactList[i];
		
		if(uuid === obj.id){
			return obj;
		}
	}
	
	return null;
}


function sortContacts(sortOn){
	
	
	
	switch(sortOn){
	
	case "name":
		contactList.sort(function(a,b) {return a.name.localeCompare(b.name)});
	break;
	
	case "phone":
		contactList.sort(function(a,b) {return a.phone.localeCompare(b.phone)});
	break;
	
	case "email":
		contactList.sort(function(a,b) {return a.email.localeCompare(b.email)});
	break;
	
	}

	
	fillTableWithEntries();
}




function searchContacts(){
	
	clearTable();
	
	var query = $('#searchbox').val().toLowerCase();
	
	for (var i = 0; i < contactList.length; i++) {
		
		var obj = contactList[i];
		
		var chkName =  obj.name.toLowerCase().indexOf(query) != -1; 
		var chkPhone = obj.phone.toLowerCase().indexOf(query) != -1; 
		var chkEmail = obj.email.toLowerCase().indexOf(query) != -1; 
		
		if(chkName || chkPhone || chkEmail){
			createJEntry(obj);
		}
	}
}




window.onload = main;