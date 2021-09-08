// Search By characteer
function charSearch() {
	var input, filter, checkbox, name, i, txtValue, parent, allParents;
	input = document.getElementById('script_input');
	filter = input.value.toUpperCase();
	checkbox = document.querySelectorAll('[id=search_box]');
	allParents = $('.dropdown');
	for (i = 0; i < checkbox.length; i++) {
		name = checkbox[i].getElementsByClassName('file_name');
		txtValue = name[0].textContent || name[0].innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			checkbox[i].style.display = 'block';
		} else {
			checkbox[i].style.display = 'none';
		}
	}

	for (i = 0; i <= allParents.length - 1; i++) {
		let t = $('#movie_' + i + ' .checkboxes')
			.children()
			.filter(function () {
				return $(this).css('display') == 'block';
			});
		if (t.length <= 0) {
			$('#movie_' + i).hide();
		} else {
			$('#movie_' + i).show();
		}
	}
}
