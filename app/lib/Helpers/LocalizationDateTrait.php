<?php namespace Quiz\lib\Helpers;

use Jenssegers\Date\Date;

trait LocalizationDateTrait {

    public function getCreatedAtAttribute($date)
    {
        return Date::parse($date);
    }

    public function getUpdatedAtAttribute($date)
    {
        return Date::parse($date);
    }

    public function getDeletedAtAttribute($date)
    {
        return Date::parse($date);
    }

} 