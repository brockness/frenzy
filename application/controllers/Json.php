<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Json extends CI_Controller {

	public function __construct() {
		parent::__construct();
		/* if( $this->session->user_data('') != true ){
		  die();
		} */
		date_default_timezone_set('America/New_York');
		$this->load->model('data');
	}

	public function index() {
		$data['payload'] = array('derp'=>'derp'); // placeholder
		$this->load->view('data/json_view',$data);
	}

	public function databases() {
		$data['payload'] = $this->data->allDatabases(); // placeholder
		$this->load->view('data/json_view',$data);
	}

	public function tables() {
		if( $this->uri->segment(3) != false ) { // segment 3 == db name
			$data['payload'] = $this->data->allTables($this->uri->segment(3));
			$this->load->view('data/json_view',$data);
		} else {
			die();
		}
	}

	public function columns() {
		if( $this->uri->segment(3) != false && $this->uri->segment(4) != false ) {  // segment 3 == db name, segment 4 == db table name
			$data['payload'] = $this->data->allColumns($this->uri->segment(3),$this->uri->segment(4));
			$this->load->view('data/json_view',$data);
		} else {
			die();
		}
	}

	public function values() { // unique values for column names, used for building `where clause` ,1=db,2=table,3=where (colname values)
		if( $this->uri->segment(3) != false && $this->uri->segment(4) != false && $this->uri->segment(5) != false ) {
			$data['payload'] = $this->data->uniqueValues($this->uri->segment(3),$this->uri->segment(4),$this->uri->segment(5));
			$this->load->view('data/json_view',$data);
		}
	}

}
