

self.port.on("scanPage", handleClick);

function handleClick(oldData) {

    var orderList;
    
    if(oldData === null)
    {
	orderList = new OrderList();
    }
    else
    {
	orderList = new OrderList();
	orderList.data = oldData;
    }

    var nextButtons = document.getElementsByClassName("ui-pagination-next ui-goto-page");
    
    if(nextButtons.length > 0)
    {
	orderList.data.hasNextPage = true;
	addToOrderList(orderList);
	self.port.emit("ready", orderList.data);	
	window.setTimeout(function(){nextButtons[0].click()}, 3000);
    }
    else
    {
	orderList.data.hasNextPage = false;
	self.port.emit("ready", orderList.data);
    }
}

function addToOrderList(orderList)
{
    var orders = document.getElementsByClassName("order-item-wraper");

    [].forEach.call(orders, function (e, i, l) {
	
	var date = getOrderDate(e.getElementsByClassName("order-head")[0]);

	var status = e.childElementCount > 1 ? getOrderStatus(e.children[1]) : null;

	for(var j = 1; j < e.childElementCount; j++)
	{
	    orderList.addItem(getOrderItem(e.children[j], date, status));
	}
    });
}

function OrderItem (name, value, currency, date, status, count) {
    this.name = name;
    this.value = value;
    this.currency = currency;
    this.date = date;
    this.status = status;
    this.count = count;
}

function OrderList () {
    this.data = {
	totalValue: 0,
	items: [],
	hasNextPage: false
    };


    this.addItem = function (item)
    {
	this.data.totalValue += parseInt(item.value.match(/\d*\d/));
	return this.data.items.push(item);
    }

    this.toJSON = function ()
    {
	return JSON.stringify(this.data);
    }

    this.append = function(other)
    {
	this.data.totalValue += other.data.totalValue;
	this.data.items.concat(other.data.items);
    }
}

function getOrderDate(orderHead)
{
    var rows = orderHead.getElementsByClassName("second-row");
    var bod = rows[0].getElementsByClassName("info-body")[0];
    return new Date(Date.parse(bod.textContent.replace(".", "")));
}

function getOrderStatus(orderBody)
{
//    console.log("status... ");
//    console.log(orderBody);   
    var status = orderBody.getElementsByClassName("order-status")[0].children[0].textContent;
    console.log("... ok: " + status.trim());
    return status.trim();
}

function getOrderItem(orderBody, date, status)
{

    var name = orderBody.getElementsByClassName("baobei-name")[0].title;
  //  console.log("name ok: " + name);
    var valueAndCount = orderBody.getElementsByClassName("product-amount")[0].children;
    var valueAndCurrency = valueAndCount[0].textContent.trim().split(" ");
    var value = valueAndCurrency[1];
    var currency = valueAndCurrency[0];
//    console.log("value ok: " + value);
    var count = valueAndCount[1].textContent.trim();
//    console.log("count ok: " + count.replace("X", ""));

    return new OrderItem(name, value, currency, date, status, count.replace("X", ""));
}
