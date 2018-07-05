$(function () {

     // Verify if only single closed question
    var i, l, isSingleOnly = true, singles = [];
    for (i = 0, l = QuestionHandler.childNodes.length; i < l; i += 1) {
       if (QuestionHandler.childNodes[i].type !== eQuestionType.single) {
           isSingleOnly = false;
       } else {
         singles.push(QuestionHandler.childNodes[i].id);
       }
   } 

   // When only single questions
   if (isSingleOnly  && singles.length) {

         $("input[type=radio]").click(function () {
             // Verify if all questions have a response
              var i = 0, l = singles.length, selected = [];
              for (; i < l; i += 1) {
                  if (QuestionHandler.all[singles[i]]._selRespByIndex.length) {
                       selected.push(singles[i]);
                  }
              }
             // When all are selected then submit
             if (selected.length === singles.length) {
                 	setInterval(function() {
				 		$("#next").trigger("click");
				  	},300);
             }
        });

   }


});
