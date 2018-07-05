/*----------------------------------------------------------------------------\
|							Askia Translation Library						  |
|-----------------------------------------------------------------------------|
|                          Created by Askia Company							  |
|							(http://www.askia.com)							  |
|-----------------------------------------------------------------------------|
| Translate the message on the script										  |
|-----------------------------------------------------------------------------|
|							Copyright Askia � 1994-2006						  |
|-----------------------------------------------------------------------------|
| {No Dependencies}															  |
|-----------------------------------------------------------------------------|
| 2006-05-31 |V 1.0.0														  |
|			 |+ Translation of error messages								  |
|			 |+ Translation of calendar										  |
|-----------------------------------------------------------------------------|
| 2007-01-12 |V 1.1.0														  |
|			 |+ New error message EMAIL_FORMAT_INVALID						  |
|-----------------------------------------------------------------------------|
| 2015-03-17 |V 1.2.0														  |
|			 |+ Deprecate the old calendar management    					  |
|-----------------------------------------------------------------------------|
| Created 2006-05-31 | All changes are in the log above. | Updated 2015-03-17 |
|-----------------------------------------------------------------------------|
|														All rights reserved	  |
|WebProd - Translation - API Version 1.2.0		Copyright Askia � 1994-2015   |
\----------------------------------------------------------------------------*/

/* ***************************************	*/
/*			ENGLISH TRANSLATION				*/
/* ***************************************	*/

//Translation of error messages
var ErrorMessages={
		RESPONSE_REQUIRE			: "A response is expected for question '" + ErrorReplacementString.QUESTION_CAPTION + "'." ,
		SEMI_OPEN_REQUIRE			: "You must specify a semi-open response",
		
		//Ranking question
		RANKING_DUPLICATE_VALUE		: "Rank " + ErrorReplacementString.VALUE + " has been given more than once for question '" + ErrorReplacementString.QUESTION_CAPTION + "'.",
		RANKING_REQUIRE_VALUE		: "Rank " + ErrorReplacementString.VALUE + " is missing for question '" + ErrorReplacementString.QUESTION_CAPTION + "'.",
		
		//Numeric
		NUMERIC_FORMAT_INVALID		: "The response to question '" + ErrorReplacementString.QUESTION_CAPTION + "' must be numeric.",
		NUMERIC_VALUE_INVALID		: "Response to question '" + ErrorReplacementString.QUESTION_CAPTION + "' must be between " + ErrorReplacementString.MIN + " and " + ErrorReplacementString.MAX + ".",
		NUMERIC_MINIMUM_INVALID		: "Response to question '" + ErrorReplacementString.QUESTION_CAPTION + "' must be above " + ErrorReplacementString.MIN + ".",
		NUMERIC_MAXIMUM_INVALID		: "Response to question '" + ErrorReplacementString.QUESTION_CAPTION + "' must be under " + ErrorReplacementString.MAX + ".",
		INVALID_NUMBER_OF_DECIMAL	: "Response to question '" + ErrorReplacementString.QUESTION_CAPTION + "' must have " + ErrorReplacementString.MAX_DEC + " maximum of decimals.",
		
		//Text
		TEXT_VALUE_INVALID			: "The number of characters for question '" + ErrorReplacementString.QUESTION_CAPTION + " must be between " + ErrorReplacementString.MIN + " and " + ErrorReplacementString.MAX + ".",
		TEXT_MINIMUM_INVALID		: "The minimum length of text is " + ErrorReplacementString.MIN + ".",
		TEXT_MAXIMUM_INVALID		: "The maximum length of text is " + ErrorReplacementString.MAX + ".",
		
		//Number of selected responses
		RESPONSES_SIZE_INVALID		   : "The number of responses must lie between " + ErrorReplacementString.MIN  + " and " + ErrorReplacementString.MAX + ".",
		RESPONSES_SIZE_MINIMUM_INVALID : "At least " + ErrorReplacementString.MIN + " responses require for the question '" + ErrorReplacementString.QUESTION_CAPTION + "'.",
		RESPONSES_SIZE_MAXIMUM_INVALID : "The maximum number of responses is " + ErrorReplacementString.MAX + " to question '" + ErrorReplacementString.QUESTION_CAPTION + "'.",
		
		//Date
		DATE_FORMAT_INVALID			: "Please enter a valid date for question '" + ErrorReplacementString.QUESTION_CAPTION + "'.\n(Valid format is 'dd/MM/yyyy')",
		DATE_VALUE_INVALID			: "Response to question '" + ErrorReplacementString.QUESTION_CAPTION + "' must be between " + ErrorReplacementString.MIN + " and " + ErrorReplacementString.MAX + ".",
		DATE_MINIMUM_INVALID		: "Response to question '" + ErrorReplacementString.QUESTION_CAPTION + "' must be above " + ErrorReplacementString.MIN + ".",
		DATE_MAXIMUM_INVALID		: "Response to question '" + ErrorReplacementString.QUESTION_CAPTION + "' must be under " + ErrorReplacementString.MAX + ".",
		
		//Misc
		EMAIL_FORMAT_INVALID		: "Please enter a valid email address for question '" + ErrorReplacementString.QUESTION_CAPTION + "'."
	};

var uiDatePickerOptions = {
	dayNamesMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	monthNamesShort:  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
};