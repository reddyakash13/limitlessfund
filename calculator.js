var principal = 100000;
var interest = 5 / 100 / 12;
var payments = 10 * 12;
var rs_revenue = 60000;
var rs_monthly_revenue = rs_revenue / 12;
var rs_multiple = 3;
var rs_rate = 5 / 100;
var rs_current_payment = rs_monthly_revenue * rs_rate;
var rs_annual_growth = 1.2;
var rs_growth = Math.pow(rs_annual_growth, 1 / (12 - 1)) - 1;
var rs_hurdle = rs_multiple * principal;
//RS CALCULATIONS
//compute revenue share first monthly payment
var current_revenue = rs_monthly_revenue;
var rs_payment_array = [];
while (rs_payment_array.reduce((a, b) => a + b, 0) < rs_hurdle) {
	if (
		rs_payment_array.reduce((a, b) => a + b, 0) + rs_current_payment * 1.2 >
		rs_hurdle
	) {
		rs_payment_array.push(
			rs_hurdle - rs_payment_array.reduce((a, b) => a + b, 0)
		);
	} else {
		rs_payment_array.push(rs_current_payment);
	}
	current_revenue = current_revenue * (1 + rs_growth);
	rs_current_payment = current_revenue / 12;
}
// get longer of loan payment or RS period
var periods = Math.max(rs_payment_array.length, payments);
//set start and stop dates
var now = new Date();
if (now.getMonth() == 11) {
	var nextMonth = new Date(now.getFullYear() + 1, 0, 1);
	var stopMonth = new Date(
		new Date(now.getFullYear() + 1, 0, 1).setMonth(
			nextMonth.getMonth() + periods
		)
	);
} else {
	var nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
	var stopMonth = new Date(
		new Date(now.getFullYear() + 1, 0, 1).setMonth(
			nextMonth.getMonth() + periods
		)
	);
}
//LOAN CALCULATIONS
// compute monthly payment figure
var x = Math.pow(1 + interest, payments);
var monthly = principal * x * interest / (x - 1);
var loan_payment_array = [];
for (i = 0; i < payments; i++) {
	loan_payment_array.push(monthly);
}
//DATE CALCULATIONS
//function to add months
Date.prototype.addMonths = function(months) {
	var date = new Date(this.valueOf());
	date.setMonth(date.getMonth() + months);
	return date;
};
//get array of dates between start and stop dates
function getDates(startDate, stopDate) {
	var dateArray = [];
	var currentDate = startDate;
	while (currentDate <= stopDate) {
		dateArray.push(new Date(currentDate));
		currentDate = currentDate.addMonths(1);
	}
	return dateArray;
}
var date_array = getDates(nextMonth, stopMonth);
var data = {
	Period: date_array,
	Loan_Payment: loan_payment_array,
	RS_Payment: rs_payment_array
};
