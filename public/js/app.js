$(document).ready(function(){
    $('#newsSource a').on('click', function(){
        var thisId = this.id;
        console.log("Id of button: ", this.id);

        // Now make an ajax call for the articles
        $.ajax({
            method: "GET",
            url: "/scrape" + thisId
        })
        // With that done, add the note information to the page
        .done(function(data){
            window.location = "/";
            //call to get the articles

        });
    });

    //Open modal to get users comment
    $('.makeComment').on('click', function(){
        event.preventDefault();

        var thisId = this.value;
        console.log(thisId);

        var note = {
            text:"testing"
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

    //save users comment
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
});