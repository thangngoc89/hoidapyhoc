<?php namespace Quiz\lib\Tagging;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Taggable extends Eloquent {

	protected $table = 'taggables';
	public $timestamps = false;

}