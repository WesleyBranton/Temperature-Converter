function randomDemo() {
	var output = document.getElementById('tempconverttest');
	var temp = Math.floor((Math.random() * 100));
	var unit = Math.floor((Math.random() * 2) + 1);
	if (unit == 2) {
		unit = 'C';
	} else {
		unit = 'F';
	}
	output.textContent = temp + '\u00B0' + unit;
	output.addEventListener('change',demoComplete);
}

function demoComplete() {
	alert('Test');
}

window.onload = randomDemo();