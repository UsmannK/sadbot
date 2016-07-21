module.exports = {
	/**
	 * [removeArgs description]
	 * @param  bodyArray Array of body components
	 * @param  argCount  Number of args to remove
	 * @return String with args removed           
	 */
	removeArgs: function(bodyArray, argCount) {
		var workString = bodyArray.slice(argCount).join(" ");
		return workString;
	}
}
