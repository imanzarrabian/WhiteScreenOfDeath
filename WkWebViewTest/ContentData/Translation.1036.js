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
/*			FRENCH TRANSLATION				*/
/* ***************************************	*/

//Translation of error messages
var ErrorMessages={
		RESPONSE_REQUIRE			: "Merci de r�pondre � la question '" + ErrorReplacementString.QUESTION_CAPTION + "'.",
		SEMI_OPEN_REQUIRE			: "Vous devez sp�cifier une r�ponse semi-ouverte",
		
		//Ranking question
		RANKING_DUPLICATE_VALUE		: "Rang " + ErrorReplacementString.VALUE + " a �t� donn� plus d'une fois pour la question '" + ErrorReplacementString.QUESTION_CAPTION + "'.",
		RANKING_REQUIRE_VALUE		: "Rang " + ErrorReplacementString.VALUE + " est manquant pour la question '" + ErrorReplacementString.QUESTION_CAPTION + "'.",
		
		//Numeric
		NUMERIC_FORMAT_INVALID		: "La r�ponse doit �tre num�rique pour la question '" + ErrorReplacementString.QUESTION_CAPTION + "'.",
		NUMERIC_VALUE_INVALID		: "La r�ponse � la question '" + ErrorReplacementString.QUESTION_CAPTION + "' doit �tre comprise entre " + ErrorReplacementString.MIN + " et " + ErrorReplacementString.MAX + ".",
		NUMERIC_MINIMUM_INVALID		: "La r�ponse � la question '" + ErrorReplacementString.QUESTION_CAPTION + "' doit �tre sup�rieure � " +  ErrorReplacementString.MIN + ".",
		NUMERIC_MAXIMUM_INVALID		: "La r�ponse � la question '" + ErrorReplacementString.QUESTION_CAPTION + "' doit �tre inf�rieure � " +  ErrorReplacementString.MAX + ".",
		INVALID_NUMBER_OF_DECIMAL	: "La r�ponse � la question '" + ErrorReplacementString.QUESTION_CAPTION + "' accepte un nombre maximum de " + ErrorReplacementString.MAX_DEC + " d�cimales.",
		
		//Text
		TEXT_VALUE_INVALID			: "Le nombre de caract�res � la question '" + ErrorReplacementString.QUESTION_CAPTION + " doit �tre compris entre " + ErrorReplacementString.MIN + " et " + ErrorReplacementString.MAX + "." ,
		TEXT_MINIMUM_INVALID		: "La r�ponse � la question '" + ErrorReplacementString.QUESTION_CAPTION + "' doit poss�der un minimum de " + ErrorReplacementString.MIN + " caract�res.",
		TEXT_MAXIMUM_INVALID		: "La r�ponse � la question '" + ErrorReplacementString.QUESTION_CAPTION + "' doit poss�der un maximum de " + ErrorReplacementString.MAX + " caract�res.",
		
		//Number of selected responses
		RESPONSES_SIZE_INVALID		   : "Le nombre de r�ponses � la question '" +  ErrorReplacementString.QUESTION_CAPTION + " doit �tre compris entre " + ErrorReplacementString.MIN  + " et " + ErrorReplacementString.MAX + ".",
		RESPONSES_SIZE_MINIMUM_INVALID : "Vous devez apporter au moins " +  ErrorReplacementString.MIN + " r�ponses � la question '" + ErrorReplacementString.QUESTION_CAPTION + "'." ,
		RESPONSES_SIZE_MAXIMUM_INVALID : "Vous ne pouvez apporter que " +  ErrorReplacementString.MAX + " r�ponses � la question '" + ErrorReplacementString.QUESTION_CAPTION + "'." ,
		
		//Date
		DATE_FORMAT_INVALID			: "Veuillez entrer une date valide � la question '" + ErrorReplacementString.QUESTION_CAPTION  + "'.\n(Format attendue 'jj/MM/aaaa')",
		DATE_VALUE_INVALID			: "La r�ponse � la question '" + ErrorReplacementString.QUESTION_CAPTION + "' doit �tre comprise entre " + ErrorReplacementString.MIN + " et " + ErrorReplacementString.MAX + ".",
		DATE_MINIMUM_INVALID		: "La r�ponse � la question '" + ErrorReplacementString.QUESTION_CAPTION + "' doit �tre inf�rieure � " +  ErrorReplacementString.MAX + ".",
		DATE_MAXIMUM_INVALID		: "La r�ponse � la question '" + ErrorReplacementString.QUESTION_CAPTION + "' doit �tre inf�rieure � " +  ErrorReplacementString.MAX + ".",
		
		//Misc
		EMAIL_FORMAT_INVALID		: "Veuillez entrer une adresse email valide � la question '" + ErrorReplacementString.QUESTION_CAPTION + "'."
	};

// For jQuery ui datepicker
var uiDatePickerOptions = {
	dayNamesMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
	monthNamesShort: ["Jan", "Fev", "Mar", "Avr", "Mai", "Juin", "Juil", "Aout", "Sep", "Oct", "Nov", "Dec"]
};