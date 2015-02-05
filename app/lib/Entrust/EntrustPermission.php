<?php namespace Zizaco\Entrust;

use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * Zizaco\Entrust\EntrustPermission
 *
 * @property integer $id 
 * @property string $name 
 * @property string $display_name 
 * @property-read \Illuminate\Database\Eloquent\Collection|\Quiz\Models\Enstrust\Role[] $roles 
 * @property-read \Illuminate\Database\Eloquent\Collection|\$related[] $morphedByMany 
 * @method static \Illuminate\Database\Query\Builder|\Zizaco\Entrust\EntrustPermission whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Zizaco\Entrust\EntrustPermission whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\Zizaco\Entrust\EntrustPermission whereDisplayName($value)
 */
class EntrustPermission extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table;

    /**
     * Eloquent validation rules.
     *
     * @var array
     */
    public static $rules = array(
        'name' => 'required|between:4,128',
        'display_name' => 'required|between:4,128'
    );

    /**
     * Creates a new instance of the model.
     *
     * @return void
     */
    public function __construct(array $attributes = array())
    {
        parent::__construct($attributes);
        $this->table = config('entrust.permissions_table');
    }

    /**
     * Many-to-Many relations with Roles.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function roles()
    {
        return $this->belongsToMany(\Quiz\Models\Enstrust\Role::class,'permission_role', 'permission_id','role_id');
    }

    /**
     * Before delete all constrained foreign relations.
     *
     * @param bool $forced
     *
     * @return bool
     */
    public function beforeDelete($forced = false)
    {
        try {
            DB::table(config('entrust.permission_role_table'))->where('permission_id', $this->id)->delete();
        } catch (Exception $e) {
            // do nothing
        }

        return true;
    }
}
