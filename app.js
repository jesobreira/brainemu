Array.prototype.peek = function() {
	return this[this.length-1];
}
$(function() {
	window.cells = prompt("Enter the number of cells.\nBy default, Brainfuck specs tells about 30000 cells but you can set a lower number if you don't need that much.", 300);
	for(i = 1; i <= window.cells; i++) {
		$("#cell-names").append('<th id="cell-'+i+'-name">'+i+'</th>');
		$("#cell-values").append('<th id="cell-'+i+'-value">0</th>');
	}
	selectCell(parseInt(window.cells/2));
	
	$("#add button").click(function() {
		$("#bfcode").val($("#bfcode").val()+$(this).text().trim());
	});
	
	$("#run").click(function() {
		if($(this).text()=="Stop") {
			$("#run").text("Run");
			clearInterval(window.mainthread);
			return;
		}
		selectCell(parseInt(window.cells/2));
		$("#run").text("Stop");
		$("#parsedbf").val($("#bfcode").val().replace(/[^\+\-\>\<\.\,\[\]]/g, ""));
		for(i = 1; i <= window.cells; i++) {
			$("#cell-"+i+"-value").text("0");
		}
		$("#output").text("");
		var position = 0;
		var curcell = parseInt(window.cells/2);
		var nestedloops = [];
		window.mainthread = setInterval(function() {
			var cur = $("#parsedbf").val().substr(position, 1);
			$("#cur").text(cur);
			
			// process
			switch(cur) {
				case '+':
					var val = parseInt($("#cell-"+curcell+"-value").text().trim());
					val++;
					$("#cell-"+curcell+"-value").text(val);
					break;
					
				case '-':
					var val = parseInt($("#cell-"+curcell+"-value").text().trim());
					val--;
					$("#cell-"+curcell+"-value").text(val);
					break;
					
				case '<':
					curcell--;
					selectCell(curcell);
					break;
					
				case '>':
					curcell++;
					selectCell(curcell);
					break;
					
				case '.':
					$("#output").text($("#output").text() + String.fromCharCode(parseInt($("#cell-"+curcell+"-value").text().trim())));
					break;
					
				case ',':
					$("#cell-"+curcell+"-value").text(String(prompt("Insert 1 byte of data:")).charCodeAt(0));
					break;
					
				case '[':
					var delta = 0;
					if(!parseInt($("#cell-"+curcell+"-value").text().trim())) {
						while(true) {
							position++;
							var cur = $("#parsedbf").val().substr(position, 1);
							if(cur=='[') delta++;
							if(cur==']') {
								if(delta)
									delta--;
								else {
									break;
								}
							}
						}
					} else {
						nestedloops.push(position);
					}
					break;
					
				case ']':
					if(parseInt($("#cell-"+curcell+"-value").text().trim())) {
						position = nestedloops.peek();
					} else {
						nestedloops.pop();
					}
					break;
			}
			
			position++;
			
			if($("#parsedbf").val().length < position) {
				$("#run").text("Run");
				clearInterval(mainthread);
				return;
			}
		}, $("#speed").val());
	});
});

function selectCell(id) {
	scrollToCell("#cell-"+id+"-name", "#cells");
	$("#cells th").removeClass("active-cell");
	$("#cell-"+id+"-name").addClass("active-cell");
	$("#cell-"+id+"-value").addClass("active-cell");
}

function scrollToCell(element, parent) {
	element = $(element);
	parent = $(parent);

	var offset = element.offset().left;

	var visible_area_start = parent.scrollLeft();
	var visible_area_end = visible_area_start + parent.innerWidth();
	
	var half = parent.innerWidth()/2;
	if (offset < visible_area_start) {
		parent.animate({scrollLeft: visible_area_start +offset-half}, 100);
		return false;
	} else if (offset > visible_area_end) {
		parent.animate({scrollLeft: visible_area_start +offset-half }, 100);
		return false;

	}
	return true;
}