/**
 * Utility script used to dynamically generate HTML.
 *
 * Author: Tomas Mudrunka
 */

define(function() {

	/** The HTML-Builder object. */
	function HTMLBuilder() {
		this.tableClass = 'table table-bordered table-condensed table-striped table-hover';
	}

	/**
	 * Builds HTML table with all provided users.
	 * @param allUsers array with all User objects to display
	 * @returns {jQuery|HTMLElement}
	 */
	HTMLBuilder.prototype.buildUsersTable = function(allUsers) {
		if (!allUsers || allUsers.length < 1) {
			var empty = this.new('div');
			empty.addClass('table-empty');
			empty.append('<span class="text-error">There are no user accounts yet, you need to create some first.</span>')
			return empty;
		}

		var table = this.new('table');
		table.addClass(this.tableClass);

		// make table-head
		var thead = this.new('thead');
		thead.append('<tr><td rowspan="2">Name</td><td colspan="2">High score</td><td rowspan="2"></td></tr>');
		thead.append('<tr><td class="text-right">Time [s]</td><td class="text-right">Kills</td></tr>');

		// make table-body
		var tbody = this.new('tbody');
		for (var i = 0; i < allUsers.length; i++) {
			var row = this.new('tr');
			row.attr('data-id', allUsers[i].id);
			row.attr('itemtype', 'http://schema.org/Person');
			row.append('<td itemprop="name">' + allUsers[i].name + '</td>');
			var score = allUsers[i].highScore;
			row.append('<td class="text-right">' + (score ? score.time : '-') + '</td>');
			row.append('<td class="text-right">' + (score ? score.kills : '-') + '</td>');
			row.append('<td class="action"><button class="btn" data-id="' + allUsers[i].id + '">Log in</button></td>');
			tbody.append(row);
		}

		table.append(thead);
		table.append(tbody);
		return table;
	};

	/**
	 * Creates new HTML element wrapped by jQuery.
	 * @param element String tag
	 * @returns {jQuery|HTMLElement} new HTML element
	 */
	HTMLBuilder.prototype.new = function(element) {
		return $(document.createElement(element));
	};

	return HTMLBuilder;
});
