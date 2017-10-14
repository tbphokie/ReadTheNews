$(document).ready(function(){
    //Make the id global to make sure we have the current id at all times
    var thisId = 1;
    var commentId = 1;
    $('#newsSource a').on('click', function(){
        filter = this.id;
        console.log("Id of button: ", filter);

        // Now make an ajax call for the articles
        $.ajax({
            method: "GET",
            url: "/scrape" + filter
        })
        // With that done, add the note information to the page
        .done(function(data){
            window.location = "/";
            //call to get the articles

        });
    });

    //Mark selected article as read so it won't display
    $('.makeRead').click(function(){
        event.preventDefault();
        //alert("inside makeRead");
        
        thisId = this.value;
        console.log(thisId);

        $.ajax({
            method: "POST",
            url:  "/articleRead/"+thisId
        })
        .done(function(data){
            window.location = "/";
        });
    });

    //Open modal to get users comment and Grab id before modal opens and get current comment if it exists
    $('.makeComment').on('click', function(){
        event.preventDefault();
        
        thisId = this.value;
        console.log(thisId);

        $.ajax({
            method: "GET",
            url: "/getComment/"+thisId,
        })
        .done(function(comment){
            console.log("COMMENT    : ", comment.text);
            $('#curComments').text(comment.text);
            commentId = comment._id;
        })        
    });

    //save new comment
    $('#addComment').on('click', function(){
        event.preventDefault();

        var comment = $('#curComments').val();

        console.log(thisId);
        console.log("Comment: ", comment);

        var note = {
            text: comment
        }
        $.ajax({
            method: "POST",
            url: "/articles/"+thisId,
            data: note
        })
        .done(function(data){
            console.log("DATA: ", data);
            window.location = "/";
        })
    });

    //delete comment
    $('#deleteComment').on('click', function(){
        event.preventDefault();
        $.ajax({
            method: "POST",
            url: "/deleteComment/"+commentId
        })
        .done(function(data){
            console.log("DATA:", data);
            window.location = "/";
        })

    });

/*    //save users comment
    $('#submitComment').on('click', function(){
        event.preventDefault();

        var note = {
            text: $("#inputNote").val()
          }

        var thisId = this.value();
        console.log(thisId);

        $.ajax({
            method: "POST",
            url: "/articles/"+thisId
        })
        .done(function(data){
            window.location = "/";
        })
    }); 
*/  
});