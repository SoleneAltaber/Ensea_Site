src="http://www.youtube.com/player_api";
var xhr = getXhr();
var gmarkers = [];
var map;
var firstPoint;


function changeFontWeightAt(ind){
	if(ind < 0) return;
	var _elt = document.getElementById('menu');
	var target_parent = _elt.getElementsByTagName('li')[ind];
	var target = target_parent.getElementsByTagName('a')[0];
	target.id = 'selected';
}
function displaySSMenu(id){
	if(id < 0) return;
	var menu = document.getElementById("menu");
	var currentSSMenu = menu.getElementsByTagName("li")[id];
	var _ul = currentSSMenu.getElementsByTagName("ul")[0];
	_ul.style.display = "block";
}
function hideSSMenu(id){
	if(id < 0) 
	{
		document.getElementById('ssmenu').innerHTML = '';
		return;
	}
	var menu = document.getElementById("menu");
	var currentSSMenu = menu.getElementsByTagName("li")[id];
	var _ul = currentSSMenu.getElementsByTagName("ul")[0];
	_ul.style.display = "none";
}
function setLastSSMenu(id){
	if(id < 0) return;
	_lastSSMenu = id;	
}
function getXhr(){
	var xhr = null;
	if(window.XMLHttpRequest){ // Firefox et autres
		xhr = new XMLHttpRequest(); 
	}
	else if(window.ActiveXObject){ // Internet Explorer 
        try {
			xhr = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	else { // XMLHttpRequest non support� par le navigateur 
		alert("Votre navigateur ne supporte pas les objets XMLHTTPRequest..."); 
		xhr = false; 
	} 
     return xhr;
}
function getHTML(tg,pg)
{
	var xhr = getXhr();
	xhr.open('GET', pg, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send(null);	
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == 4)
		{
			document.getElementById(tg).innerHTML = xhr.responseText;
		}
	}
}
function updateNewsList(s, cy, qs)
{
	var cm;
	var year = /^[0-9]{4}$/;
	var month = /^[0-9]{1,2}$/;
	var value = s.options[s.selectedIndex].value;
		
	if(year.test(value)) cy = value;
	qs = '&cy='+cy;
	if(month.test(value))
	{	
		cm = value;
		qs += '&cm='+cm;
	}
	
	getHTML('mainContent', 'actualites.php?'+qs);
}
function getNews(page){
	var sel = document.getElementById('monthsSelector').getElementsByTagName('select')[0];
	var date = sel.options[sel.selectedIndex].value;
	xhr.open("GET", "actualites.php?page="+page+"&date="+date, true);
	xhr.onreadystatechange = function(){
		if(xhr.readyState==4){
			document.getElementById('mainContent').innerHTML = xhr.responseText;
		}
	}
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send(null);	
}
function getSearchResults(search, page){
	xhr.open('POST', 'recherche.php', true);
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4){
			document.getElementById('intro').innerHTML = xhr.responseText;
		}
	}
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send('search='+search+'&page='+page);
}
function getPage(page, post){
	xhr.open('POST', page, true);
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4){
			document.getElementById('searchResultContent').innerHTML = xhr.responseText;
		}
	}
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	if(post!=''){
		xhr.send('rubrique='+post);
	}else{
		xhr.send(null);
	}
}
function getResultFromBDD(id, file){
	xhr.open('POST', file, true);
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4){
			document.getElementById('searchResultContent').innerHTML = xhr.responseText;
		}
	}
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send('id='+id);
}
function setClass(div, className){
	document.getElementById(div).className = className;
}
function refreshCalendar()
{
	var months = document.getElementById('cal-select-months');
	var cm = months.options[months.selectedIndex].value;
	
	var years = document.getElementById('cal-select-years');
	var cy = years.options[years.selectedIndex].value;
	
	getHTML('calendrier', base_url+'calendrier.php?cy='+cy+"&cm="+cm);
}
function showToolTip(cn, id)
{
	document.getElementById(id).style.visibility = 'visible';
	cn.style.zIndex = '3';
}
function hideTooltip(cn, id)
{
	document.getElementById(id).style.visibility = 'hidden';
	cn.style.zIndex = '2';
}
function hideGElts() {
	/*var eltCont = document.getElementById("map");
	var AElts = eltCont.getElementsByTagName("a");
	DIVElts = eltCont.getElementsByTagName("div");
	AElts[1].style.display = "none";
	DIVElts[DIVElts.length-1].style.visibility = "hidden";*/
}
function showInst(id){
	map.panTo(new GLatLng(gmarkers[id].getPoint().lat(),gmarkers[id].getPoint().lng()), 15);
	GEvent.trigger(gmarkers[id],"click");
}
function loadMap(part) {
	
	if (GBrowserIsCompatible()) {
	  
		 // build the icons
		 var baseIcon = new GIcon();
		baseIcon = new GIcon();
		baseIcon.iconSize = new GSize(16, 27);
		baseIcon.shadowSize = new GSize(30, 28);
		baseIcon.iconAnchor = new GPoint(8, 27);
		baseIcon.infoWindowAnchor = new GPoint(8, 27);
	
		function createMarker(point, infos) {
			var icon = new GIcon(baseIcon);
			icon.image = 'http://www.google.com/mapfiles/gadget/markerSmall80.png';
			icon.shadow = 'http://www.google.com/mapfiles/gadget/shadow50Small80.png';
			var marker = new GMarker(point,icon);
			GEvent.addListener(marker, "click", function() {
			var desc = "<p><strong>"+infos.nom+"</strong></p>";
			desc += "<p class=''><strong>Adresse postale : </strong><br />"+infos.addr+"<br />"+infos.cp+" "+infos.ville+"</p>";
			desc += "<p><strong>T&eacute;l&eacute;phone : </strong><span>"+infos.tel+"</span></p>";
			desc += "<p><strong>Email : </strong><a href='mailto:"+infos.mail+"'>"+infos.mail+"</a></p>";
			  
			marker.openInfoWindowHtml(desc);
			});
			gmarkers[infos.id] = marker;
			return marker;
		}
				
 		//cr�ation d'une carte nomm� "map"
		map = new GMap2(document.getElementById("map"));
		GEvent.addListener(map, "moveend", function() {
			var center = map.getCenter();
		});
		   
		//map.addControl(new GSmallMapControl());
		//map.addControl(new GMapTypeControl());          
		
		//on charge les projets � partir du xml
		var request = GXmlHttp.create();
		request.open("GET", base_url+"situations.php?set="+part, true);
		request.onreadystatechange = function() {
			if(request.readyState == 4){
				var xmlDoc = request.responseXML;
				var insts = xmlDoc.documentElement.getElementsByTagName("institution");
				for(var i=0; i < insts.length; i++){
					var infos = [];
					infos.id = insts[i].getAttribute('id');
					infos.nom = insts[i].getElementsByTagName("nom")[0].firstChild.nodeValue;
					infos.addr = insts[i].getElementsByTagName("addr")[0].firstChild.nodeValue;
					infos.cp = insts[i].getElementsByTagName("cp")[0].firstChild.nodeValue;
					infos.ville = insts[i].getElementsByTagName("ville")[0].firstChild.nodeValue;
					infos.tel = insts[i].getElementsByTagName("tel")[0].firstChild.nodeValue;
					infos.mail = insts[i].getElementsByTagName("mail")[0].firstChild.nodeValue;
					infos.img = insts[i].getElementsByTagName("img")[0].firstChild.nodeValue;
					var lat = insts[i].getElementsByTagName("lat")[0].firstChild.nodeValue;
					var lng = insts[i].getElementsByTagName("lng")[0].firstChild.nodeValue;
					if(i==0) map.setCenter(new GLatLng(lat, lng), 15);
					var point = new GLatLng(parseFloat(lat), parseFloat(lng));
					map.addOverlay(createMarker(point, infos));
				}
			}
		}
		request.send(null);  
	}
	hideGElts();
}

function ValidateVideo(checkboxElem) {
    if (checkboxElem.checked) {
    alert ("1");
    return 1;
  } else {
    alert ("0");
    return 0;
  }
}

function CloseDivTournage(OverlayId, DivIframeId)
{
	document.getElementById(DivIframeId).style.display='none'; document.getElementById(OverlayId).style.display='none'; 
	
}

function OpenDivTournage(OverlayId, DivIframeId)
{
	document.getElementById(DivIframeId).style.display='block'; document.getElementById(OverlayId).style.display='block';
}

function focusMethod(myButton) {
  document.getElementById(myButton).focus({preventScroll:true});
}
