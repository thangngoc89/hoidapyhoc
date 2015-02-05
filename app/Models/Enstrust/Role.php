<?php namespace Quiz\Models\Enstrust;

use Zizaco\Entrust\EntrustRole;

/**
 * Quiz\Models\Enstrust\Role
 *
 * @property integer $id 
 * @property string $name 
 * @property \Carbon\Carbon $created_at 
 * @property \Carbon\Carbon $updated_at 
 * @property mixed $permissions 
 * @property-read \Illuminate\Database\Eloquent\Collection|\$related[] $morphedByMany 
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Enstrust\Role whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Enstrust\Role whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Enstrust\Role whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Quiz\Models\Enstrust\Role whereUpdatedAt($value)
 */
class Role extends EntrustRole {

    protected $fillable = ['name'];

}