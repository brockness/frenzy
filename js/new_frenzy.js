
var frenzy_app = {

  'settings' : {
      'database' : 'default',
         'table' : 'default',
       'columns' : [],
         'where' : [],
       'mdlTmpl' : '<div class="mdl_bg"></div><div class="mdl"></div>',
  },

  dbList : function(){
    var self = this;
    this.dataAction({
      'config' : {
        'url' : this.settings.url + '/json/databases',
        'type' : 'GET'
      },
      'done' : function(data){
        $('#db_col').empty();
        $.each(data,function(key,value){
          $('#db_col').append($('<div class="btn btn-default btn-xs btn-block">' + value.Database + '</div>').on('click',function(e){
            $(this).siblings().removeClass('btn-success');
            if( $(this).hasClass('btn-success') != true ) {
              $(this).addClass('btn-success');
              self.settings.database = $(this).text();
              self.settings.table = '';
              self.settings.columns = [];
              $('#table_col,#colname_col,#where_col').empty();
              self.tableList();
            } else {
              $(this).removeClass('btn-success');
              self.settings.database = '';
              self.settings.table = '';
              self.settings.columns = [];
              $('#table_col,#colname_col,#where_col').empty();
            }
          }));
        });
      }
    });
  },

  tableList : function() {
    var self = this;
    this.dataAction({
      'config' : {
        'url' : this.settings.url + '/json/tables/' + self.settings.database,
        'type' : 'GET'
      },
      'done' : function(data){
        $('#table_col').empty();
        $.each(data,function(key,value){
          $('#table_col').append($('<div class="btn btn-default btn-xs btn-block">' + value['Tables_in_' + self.settings.database ] + '</div>').on('click',function(e){
            $(this).siblings().removeClass('btn-success');
            if( $(this).hasClass('btn-success') != true ) {
              $(this).addClass('btn-success');
              self.settings.table = $(this).text();
              self.settings.columns = [];
              $('#colname_col,#where_col').empty();
              self.columnsList();
            } else {
              $(this).removeClass('btn-success');
              self.settings.table = '';
              self.settings.columns = [];
              $('#colname_col,#where_col').empty();
            }
          }));
        });
      }
    });
  },

  columnsList : function(){
    var self = this;
    this.dataAction({
      'config' : {
        'url' : this.settings.url + '/json/columns/' + self.settings.database + '/' + self.settings.table,
        'type' : 'GET'
      },
      'done' : function(data){
        self.whereList(data);
        $('#colname_col').empty();
        $.each(data,function(key,value){
          $('#colname_col').append($('<div class="btn btn-default btn-xs btn-block">' + value.Field + '</div>').on('click',function(e){
            if( $(this).hasClass('btn-success') != true ) {
              $(this).addClass('btn-success');
              self.settings.columns.push($(this).text());
            } else {
              $(this).removeClass('btn-success');
              colIndex = self.settings.columns.indexOf($(this).text());
              if (colIndex > -1) {
                self.settings.columns.splice(colIndex, 1);
              }
            }
          }));
        });
      }
    });
  },

  whereList : function(dataObj) {
    var self = this;
    $('#where_col').empty();
    $.each(dataObj,function(key,value){
      $('#where_col').append($('<div class="btn btn-default btn-xs btn-block">' + value.Field + '</div>').on('click',function(e){
        if( $(this).hasClass('btn-primary') != true ) {
          $(this).addClass('btn-primary');
          self.whereConfig($(this).text());
        } else {
          $(this).removeClass('btn-success');

        }
      }));
    });
  },

  whereConfig : function(colName) {
    var self = this;
    console.log('x',colName);
    $('body').append($(self.settings.mdlTmpl));
    $('.mdl_bg').animate({
        'opacity' : .7
      },500,function(){

      });
    $('.mdl').animate({
         'width' : '500px',
        'height' : '450px',
      },500,function(){
        $(this).append($('<p class="text-center">' + colName + '</p>'));
      });
  },

  dataAction : function(getObj){
    configObj = $.extend({
                    'dataType' : 'JSON',
                    'success' : function(e){
                      console.log('success',e);
                    }
                  },
                  getObj.config);
    $.ajax(configObj).done(getObj.done);
  },

  init : function(options) {
    this.settings.url = options.url;
    this.dbList();

  }

}
