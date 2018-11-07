function loadURLValue(URL,type,documentObject,data){
  if(URL!=''){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(xhttp) {
      if (this.readyState == 4 && this.status == 200) {
        var rsponseJSON = JSON.parse(this.responseText);
        // if(rsponseJSON.length == 1)
        if(documentObject.innerHTML == undefined )
          documentObject.innerHTML = "";
        else {
          documentObject.innerHTML = '';
          if(rsponseJSON.length == undefined){
            stringHtml = loadOrders(rsponseJSON);
          }
          else {
            stringHtml = loadShoppingCart(rsponseJSON);
          }
          if(stringHtml=="")
            stringHtml = "<h3>No Data to display</h3>"
          documentObject.innerHTML = stringHtml;
        }
      }
    }
    xhttp.open(type, URL, true);
    if(type == "POST"){

      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(data));
    }
    else{
      xhttp.send();
    }
  }
}
function loadOrders(rsponseJSON){
  var stringHtml = "";

        document.getElementById("orderId").innerHTML = rsponseJSON.id;
        document.getElementById("orderStatus").innerHTML = rsponseJSON.status;
        if(rsponseJSON.status != "Ordered")
          document.getElementById("mkpymt").className = "btn btn-block btn-lg btn-primary hideElem";
        else {
          document.getElementById("mkpymt").className = "btn btn-block btn-lg btn-primary";
        }
        document.getElementById("totalAmount").innerHTML = rsponseJSON.totalAmount;
        if(rsponseJSON.orderItems !=undefined){
          for(var j=0;j<rsponseJSON.orderItems.length;j++){
            stringHtml = stringHtml+applyCarttemplate(rsponseJSON.orderItems[j]);
          }
      }
  return stringHtml;
}
function loadShoppingCart(rsponseJSON){
  stringHtml = "";
  for(var i=0;i<rsponseJSON.length;i++){

    for(var j=0;j<rsponseJSON[i].items.length;j++){
      stringHtml = stringHtml+applyItemstemplate(rsponseJSON[i].items[j],rsponseJSON[i].name+" @"+rsponseJSON[i].address,rsponseJSON[i].id);
    }

  }
  return stringHtml
}
function addToCart(itemId){
  var  item = document.getElementById(itemId);
  if(item.value !=NaN){
    if((item.min!=NaN) && (parseInt(item.value) < parseInt(item.min)))
      item.value = item.min;
    if((item.max!=NaN) && (parseInt(item.value) > parseInt(item.max)))
      item.value = item.max;
  }
  if(parseInt(item.value)>0){
    cartItems[itemId]=parseInt(item.value);
  }
  if(Object.keys(cartItems).length>0){
    document.getElementById("checkoutCount").innerHTML =  Object.keys(cartItems).length;
    document.getElementById("checkoutCountLink").className =  "nav-link";
  }
  else{
    document.getElementById("checkoutCountLink").className =  "nav-link hideElem";
  }
  parseInt(item.value);
}
function applyItemstemplate(item,addr,id){
        str = '<div class="col-lg-4 col-md-6 mb-4"><div class="card h-100">'+
          '<a href="#"><img class="card-img-top" src="img\\'+item.image+'" alt=""></a>'+
          '<div class="card-body"><h4 class="card-title"><a href="#">'+item.name+'</a>'+
          '</h4><h5>₹'+item.price+'</h5><p class="card-text">from '+addr+'</p><p class="card-text"><i>'+item.description+'</i></p>'+
          '</div><div class="card-footer"><small class="text-muted">'+ratingStr(item.rating)+
          '</small></div><input type="number" min="0" onfocusout="addToCart(\''+id+"-"+item.id+'\')" max='+item.availability+' class="form-control form-control-lg bfh-number" id="'+id+"-"+item.id+'" placeholder="0"></div></div></div>';
        return str;
}
function applyCarttemplate(item){
        str = '<div class="row" ><tr><td>'+item.id+'</td><td>'+item.items[0].name+'</td><td>'+item.qtyOrdered+'</td><td>'+item.items[0].price+'</td></tr></div>';
        return str;
}
function ratingStr(stars){
  var ratingStr = "";
  for(let i=1;i<=5;i++){
    if(stars<=i){
      ratingStr = " &#9733; "+ratingStr ;
    }
    else {
        ratingStr = " &#9734; "+ratingStr ;
    }
  }
  return ratingStr;
}


function loadCart(){
  var orderId;
    var itemsContainer = document.getElementById("itemsContainer");
    if(itemsContainer !=null)
      itemsContainer.className = " container itemContainer hideElem";
    var ordersCantainer = document.getElementById("ordersContainer");
    if(ordersContainer !=null)
      ordersContainer.className = "container itemContainer";
    var headLabel = document.getElementById("headLabel");
    if(headLabel !=null)
      headLabel.innerHTML = "Searching for existing order?";
    var headValue = document.getElementById("headValue");
    if(headValue !=null){
      if(  headValue.placeholder == "Enter Order Id..." )
        orderId = headValue.value;
      headValue.placeholder = "Enter Order Id...";
    }

    var headButton = document.getElementById("headButton");
    if(headButton !=null){
      headButton.outerHTML = '<button type="submit" id="headButton" onclick="loadCart()" class="btn btn-block btn-lg btn-primary">Try !</button>';
  }
  var orderItems = document.getElementById("orderItemsList");
  if(orderId!=null){
    loadURLValue("http://127.0.0.1:5001/orders"+"/"+orderId,"GET",orderItems,cartItems);
  }
  else{
      loadURLValue("http://127.0.0.1:5001/orders","POST",orderItems,cartItems);
    }
  ;
}
function loadHome(){

    var itemName
    var itemsContainer = document.getElementById("itemsContainer");
    if(itemsContainer !=null)
      itemsContainer.className = " container itemContainer ";
    var ordersCantainer = document.getElementById("ordersContainer");
    if(ordersContainer !=null)
      ordersContainer.className = " container itemContainer hideElem";

      var headLabel = document.getElementById("headLabel");
      if(headLabel !=null)
      headLabel.innerHTML = "Searching for food?";
      var headValue = document.getElementById("headValue");
      if(headValue !=null){
        if(  headValue.placeholder == "Search a food..." )
          itemName = headValue.value;
      headValue.placeholder = "Search a food...";
    }
    var headButton = document.getElementById("headButton");
    if(headButton !=null){
      headButton.outerHTML = '<button type="submit" id="headButton" onclick="loadHome()" class="btn btn-block btn-lg btn-primary">Try !</button>';
  }
  var shoppingItems = document.getElementById("itemsList");
  if(itemName!=null && itemName!=""){
    loadURLValue("http://127.0.0.1:5001/restaurants/"+itemName,"GET",shoppingItems,null);
  }
  else{
    loadURLValue("http://127.0.0.1:5001/restaurants","GET",shoppingItems,null);
    window.cartItems = {};
  }
}
 loadHome();
