<?php namespace Quiz\lib\Helpers;

use Jenssegers\Date\Date;

/**
 * Trait LocalizationDateTrait
 * Helper trait to convert Carbon date into Localization Date
 * @package Quiz\lib\Helpers
 */

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