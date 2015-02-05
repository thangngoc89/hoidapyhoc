<?php namespace Quiz\Models\Enstrust;

use Zizaco\Entrust\EntrustPermission;

/**
 * Quiz\Models\Enstrust\Permission
 *
 * @property integer $id 
 * @property string $name 
 * @property string $display_name 
 * @property-read \Illuminate\Database\Eloquent\Collection|\Quiz\Models\Enstrust\Role[] $beforeDelete 
 * @property-read \Illuminate\Database\Eloquent\Collection|\$related[] $morphedByMany 
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Enstrust\Permission whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Enstrust\Permission whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Enstrust\Permission whereDisplayName($value)
 */
class Permission extends EntrustPermission
{
    public $timestamps = false;

    protected $fillable = ['name','display_name'];
}