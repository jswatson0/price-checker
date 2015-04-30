$(document).ready(function(){
  window.onload = function() {
    var size_query = {
      query: "q=*:*&fl=sizeV_s&wt=json&indent=true&facet=true&facet.field=sizeV_s"
    };
    var style_query = {
      query: "q=*:*&fl=style_s&wt=json&indent=true&facet=true&facet.field=style_s"
    };
    var frame_query = {
      query: "q=*%3A*&fl=frame_s&wt=json&indent=true&facet=true&facet.field=frame_s"
    };

    // load the size dropdown with all the sizes
    $.get('http://localhost:8888/proxy.php', size_query, function (res) {
      var sizes = res.facet_counts.facet_fields.sizeV_s;
      var size_list = [];
      $.each(sizes, function(key, value){
        size_list.push(key);
      });
      size_list.sort();
      var select = document.getElementById("size");

      for(var i=0; i<size_list.length; i++){
        var size = size_list[i];
        var el = document.createElement("option");
        el.textContent = size;
        el.value = size;
        select.appendChild(el);
      }
    });

    // load the style dropdown with all the styles
    $.get('http://localhost:8888/proxy.php', style_query, function (res) {
      var styles = res.facet_counts.facet_fields.style_s;
      var style_list = [];
      $.each(styles, function(key, value){
        style_list.push(key);
      });
      style_list.sort();
      var select = document.getElementById("style");

      for(var i=0; i<style_list.length; i++){
        var style = style_list[i];
        var el = document.createElement("option");
        el.textContent = style;
        el.value = style;
        select.appendChild(el);
      }
    });

    // load the frame dropdown with all the frames
    $.get('http://localhost:8888/proxy.php', frame_query, function (res) {
      var frames = res.facet_counts.facet_fields.frame_s;
      var frame_list = [];
      $.each(frames, function(key, value){
        frame_list.push(key);
      });
      frame_list.sort();
      var select = document.getElementById("frame");

      for(var i=0; i<frame_list.length; i++){
        var frame = frame_list[i];
        var el = document.createElement("option");
        el.textContent = frame;
        el.value = frame;
        select.appendChild(el);
      }
    });
  };

  // submit the form
  $("#form").submit(function(e){
    // build the query string from form inputs
    var id = $("#size").val() + "-" +
             $('#style').val() + "-" +
             $('#frame').val() + "-" +
             $('#matte').val();

    // set the solr query
    var data = {
      query: "q=id:" + id
    };

    // query solr and return the the (in this case) Surya price book price
    $.get('http://localhost:8888/proxy.php', data, function (res) {
      var sku = res.response.docs[0];
      if(! sku || ! sku.price1006_i){
        alert("No product found. Please check your selections.")
      }else {
        $(".product-info").removeClass('hidden');
        $("#price").text("$" + sku.price1006_i);
        $("#id").text("ID: " + sku.id);
        $("#clear-btn").removeClass('hidden');
        $(".button-group").css("text-align", "right");
      }
    });
    e.preventDefault();
  });

  // reset all the form and the output
  $("#clear-btn").click(function(){
    $("#form").each(function(){
      this.reset();
    });
    $("#clear-btn").addClass('hidden');
    $(".product-info").addClass('hidden');
    $(".button-group").css("text-align", "center");
  })

  setStyle = function(){
    var style = $("#style").val()
    if(style == "CG" || style == "DB" || style == "MM" || style == "BW" || style == "AS" || style == "AU"){
      $("#frame").val("F0000");
      $("#matte").val("ML000");
    }
  }
});