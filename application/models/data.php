<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Data extends CI_Model {

  function allDatabases(){
    $query = $this->db->query('show databases;');
    return $query->result_array();
  }

  function allTables($dbName = 'mysql') {
    $queryStr = "show tables from $dbName;";
    $query = $this->db->query($queryStr);
    return $query->result_array();
  }

  function allColumns($dbName = 'mysql',$tableName='user') {
    $query = "show columns from $dbName.$tableName;\n";
    $query = $this->db->query($query);
    return $query->result_array();
  }

  function uniqueValues($dbName='mysql',$tableName='user',$colName='User'){
    $query = $this->db->query("select distinct $colName from $dbName.$tableName");
    return $query->result_array();
  }

}
