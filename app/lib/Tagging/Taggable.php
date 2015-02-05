<?php namespace Quiz\lib\Tagging;

use Illuminate\Database\Eloquent\Model as Eloquent;

/**
 * Copyright (C) 2014 Robert Conner
 *
 * @property integer $tag_id 
 * @property integer $taggable_id 
 * @property string $taggable_type 
 * @property-read \Illuminate\Database\Eloquent\Collection|\$related[] $morphedByMany 
 * @method static \Illuminate\Database\Query\Builder|\Quiz\lib\Tagging\Taggable whereTagId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\lib\Tagging\Taggable whereTaggableId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\lib\Tagging\Taggable whereTaggableType($value)
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