

var frenzy_app = {

  settings : {
    url : 'default',
    database : 'default',
    table : "default",
    columns : [],
    where : [],
    joins : [],
    tmpl : '<div class="btn btn-default btn-xs btn-block"></div>',
    mdlTmpl : '<div class="mdl_bg"></div><div class="mdl"></div>',
    mdlHd : '<p><span class="right glyphicon glyphicon-remove" id="rm_mdl"></span></p>'
  },

  getData : function (dataObj){
    var self = this;
    $.ajax({
       type : 'GET',
        url : self.settings.url + '/' + dataObj.resource,
        dataType : 'JSON',
        success : function(data) {
          return data;
        }
    }).done(function(data){
      if( data.length == 0 ) {
        if( dataObj.dom_el == '#db_col' ) {
          self.settings.table = '';
          $('#table_col').empty();
          self.settings.columns = [];
          $('#colname_col').empty();
          self.settings.where = [];
          $('#where_col').empty();
        }
        if( dataObj.dom_el == '#table_col' ) {
          $('#colname_col').empty();
        }
        $(dataObj.dom_el).empty().append($('<div class="btn btn-default btn-xs btn-block">No Results</div>'));
      } else {
        if( dataObj.dom_el == '#db_col' ) {
          self.settings.table = '';
          $('#table_col').empty();
          self.settings.columns = [];
          $('#colname_col').empty();
          self.settings.where = [];
          $('#where_col').empty();
          $('#db_col').empty();
          $.each(data,function(key,dbObj){
            $(dataObj.dom_el).append($('<div class="btn btn-default btn-xs btn-block">' + dbObj.Database + '</div>').on('click',function(){
              $(this).addClass('btn-success');
              $(this).siblings().removeClass('btn-success');
              self.settings.database = $(this).text();
              self.getData({'resource':'json/tables/' + self.settings.database,'dom_el':'#table_col','db_name':self.settings.database,'table_name':self.settings.table,'cols':self.settings.columns});
            }));
          });
        } else if ( dataObj.dom_el == '#table_col' ) {
          $('#where_col').empty();
          self.settings.where = [];
          $('#colname_col').empty();
          self.settings.columns = [];
          $('#table_col').empty();
          self.settings.table = '';
          $(dataObj.dom_el).empty();
          $.each(data,function(key,dbObj){
            if( dbObj[ 'Tables_in_' + self.settings.database ].search(/lkp/gi) < 0 ) {
              $(dataObj.dom_el).append($('<div class="btn btn-default btn-xs btn-block">' + dbObj['Tables_in_' + self.settings.database ] + '</div>').on('click',function(){
                $(this).siblings().removeClass('btn-success');
                $(this).addClass('btn-success');
                self.settings.table = $(this).text();
                self.getData({'resource':'json/columns/' + self.settings.database + '/' + self.settings.table ,'dom_el':'#colname_col','db_name':self.settings.database,'table_name':self.settings.table,'cols':self.settings.columns});
              }));
            }
          });
        } else if ( dataObj.dom_el == '#colname_col' ) {
          $('#colname_col,#where_col').empty();
          $.each(data,function(key,dbObj){
            $(dataObj.dom_el).append($( '<div class="btn btn-default btn-xs btn-block pct_w_88 left">'+ dbObj.Field + '</div> <span class="btn btn-default btn-xs btn-block glyphicon glyphicon-eye-open blockly pct_w_10 right"></span>').on('click',function(){
              if( $.inArray($(this).text(),self.settings.columns) > -1 ) {
                $(this).removeClass('btn-success')
                indexVar = self.settings.columns.indexOf($(this).text());
                self.settings.columns.splice(indexVar, 1);
              } else {
                $(this).addClass('btn-success');
                self.settings.columns.push($(this).text());
                // self.getData({'resource':'json/tables/' + self.settings.database + '/'  + self.settings.table,'dom_el':'#where_col','db_name':self.settings.database,'table_name':self.settings.table,'cols':self.settings.columns});
              }
            }));
            $('#where_col').append($('<div class="btn btn-default btn-xs btn-block">' + dbObj.Field + '</div>').on('click',function(e){
              offset = $(this).offset();
              $(this).addClass('btn-primary');
              self.whereBuilder($(this).text(),{'x':e.clientX,'y':e.clientY});
            }));
          });
          $('span:first').css('margin-top','0');
        }
      }
    });
  },

  whereBuilder : function (colName,coordsObj) {
    var self = this;
    $.ajax({
      url : self.settings.url + "/json/values/" + self.settings.database + '/' + self.settings.table + '/' + colName,
      type : 'GET',
      dataType : 'JSON',
      success : function () {

      }
    }).done(function(data){
      $('body').append($(self.settings.mdlTmpl));
      $('.mdl_bg').animate({
          'opacity' : .7
        },500,function(){

      });
      $('.mdl').animate({
           'width' : '500px',
          'height' : '450px',
        },500,function(){
        $('.mdl').append($(self.settings.mdlHd));
        $('span#rm_mdl').on('click',function(){
          $('.mdl,.mdl_bg').remove();
        });
        $('.mdl').append($('<br><p class="text-center pct_w_96 margin-zero margin-lr-auto">Configure WHERE clause for:'+ colName + '</p>'));
        selectorStr = "       <select multiple name=\"where_config\" id=\"where-config\">\r\n" +
                      "         <option value=\"Choose\">Choose One</option>\r\n" +
                      "         <option value=\"equal\">Equals value(s)</option>\r\n" +
                      "         <option value=\"range\">Value Range</option>\r\n" +
                      "         <option value=\"wildcard\">Wildcard</option>\r\n" +
                      "       </select>\r\n";
        $('.mdl').append($('<p class="text-center pct_w_96 margin-zero margin-lr-auto">' + selectorStr + '</p>')).on('change','select',function(){
          console.log('test',$(this).val())
          $('.mdl').html($('<br><p class="text-center pct_w_96 margin-zero margin-lr-auto">Configure WHERE clause for:'+ colName + '</p>'));
          if( $(this).val() == 'Choose' ) {
            alert('Please choose a type of WHERE clause');
            return false;
          } else if( $(this).val() == 'equal' ) {
            $.ajax({
              url : self.settings.url + '/json/values/' + self.settings.database + "/" + self.settings.table + "/" + colName,
              type : 'GET',
              dataType : 'JSON',
              success : function (data) {
                return data;
              }
            }).done(function(data){
              configCondStr = "   <p class=\"text-center pct_w_96 margin-zero margin-lr-auto\"><select name=\"config_cond\">\r\n";
              console.log('u values',data);
              $.each(data,function(key,value){
                configCondStr += "      <option value=\"" + value[colName] + "\">" + value[colName] + "</option>";
              });
              configCondStr += "   </select></p>\r\n";
              $('.mdl').append($(configCondStr));
            });
          } else if( $(this).val() == 'range' ) {
            $.ajax({
              url : self.settings.url + '/json/values/' + self.settings.database + "/" + self.settings.table + "/" + colName,
              type : 'GET',
              dataType : 'JSON',
              success : function (data) {
                return data;
              }
            }).done(function(data){
              configCondStr = "   <p class=\"text-center pct_w_96 margin-zero margin-lr-auto\"><select name=\"config_cond\">\r\n";
              console.log('u values',data);
              $.each(data,function(key,value){
                configCondStr += "      <option value=\"" + value[colName] + "\">" + value[colName] + "</option>";
              });
              configCondStr += "   </select>\r\n";
              $('.mdl').append($(configCondStr));
              lowerRangeStr = "<select name=\"lower_range\"><option value=\"greater_equal\">>=</option><option value=\"greater\">></option>" +
              "<option value=\"less\"><</option><option value=\"less_equal\"><=</option></select>";
              $('.mdl').append($(lowerRangeStr));
            });
          }
        });
      });
    });
  },

  getValues : function (colName) {
    var self = this;

  },

  init : function(options) {
    this.settings.url = options.url;
    this.getData({'resource':'json/databases','dom_el':'#db_col','db_name':'','table_name':'','cols':[]});
  }

}
