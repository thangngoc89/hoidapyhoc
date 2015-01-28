<?php namespace Quiz\lib\Tagging;

use Illuminate\Database\Eloquent\Model as Eloquent;

/**
 * Copyright (C) 2014 Robert Conner
 */
class Taggable extends Eloquent {

	protected $table = 'taggables';
	public $timestamps = false;

    public static function boot() {
        Taggable::saving(function($taggable)
        {
//           return false;
        });
    }

}