<?php namespace Zizaco\Entrust;

use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

/**
 * Zizaco\Entrust\EntrustRole
 *
 * @property integer $id 
 * @property string $name 
 * @property \Carbon\Carbon $created_at 
 * @property \Carbon\Carbon $updated_at 
 * @property-read \Illuminate\Database\Eloquent\Collection|\config('auth.model')[] $users 
 * @property-read \Illuminate\Database\Eloquent\Collection|\Quiz\Models\Enstrust\Permission[] $perms 
 * @property mixed $permissions 
 * @property-read \Illuminate\Database\Eloquent\Collection|\$related[] $morphedByMany 
 * @method static \Illuminate\Database\Query\Builder|\Zizaco\Entrust\EntrustRole whereId($value)
 * @method static \Illuminate\Database\Query\Builder|\Zizaco\Entrust\EntrustRole whereName($value)
 * @method static \Illuminate\Database\Query\Builder|\Zizaco\Entrust\EntrustRole whereCreatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|\Zizaco\Entrust\EntrustRole whereUpdatedAt($value)
 */
class EntrustRole extends Model
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
        'name' => 'required|between:4,128'
    );

    /**
     * Creates a new instance of the model.
     *
     * @return void
     */
    public function __construct(array $attributes = array())
    {
        parent::__construct($attributes);
        $this->table = config('entrust.roles_table');
    }

    /**
     * Many-to-Many relations with Users.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(config('auth.model'), 'assigned_roles','role_id','user_id');
    }

    /**
     * Many-to-Many relations with Permission named perms as permissions is already taken.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function perms()
    {
        return $this->belongsToMany(\Quiz\Models\Enstrust\Permission::class, 'permission_role','role_id','permission_id');

    }

    /**
     * Before save should serialize permissions to save as text into the database.
     *
     * @param array $value
     *
     * @return void
     */
    public function setPermissionsAttribute($value)
    {
        $this->attributes['permissions'] = json_encode($value);
    }

    /**
     * When loading the object it should un-serialize permissions to be usable again.
     *
     * @param string $value permissions json.
     *
     * @return array
     */
    public function getPermissionsAttribute($value)
    {
        return (array) json_decode($value);
    }

    /**
     * Before delete all constrained foreign relations
     *
     * @param bool $forced
     *
     * @return bool
     */
    public function beforeDelete($forced = false)
    {
        try {
            DB::table(config('entrust.assigned_roles_table'))->where('role_id', $this->id)->delete();
            DB::table(config('entrust.permission_role_table'))->where('role_id', $this->id)->delete();
        } catch (Exception $e) {
            // do nothing
        }

        return true;
    }


    /**
     * Save the inputted permissions.
     *
     * @param mixed $inputPermissions
     *
     * @return void
     */
    public function savePermissions($inputPermissions)
    {
        if (!empty($inputPermissions)) {
            $this->perms()->sync($inputPermissions);
        } else {
            $this->perms()->detach();
        }
    }

    /**
     * Attach permission to current role.
     *
     * @param object|array $permission
     *
     * @return void
     */
    public function attachPermission($permission)
    {
        if (is_object($permission)) {
            $permission = $permission->getKey();
        }

        if (is_array($permission)) {
            $permission = $permission['id'];
        }

        $this->perms()->attach($permission);
    }

    /**
     * Detach permission form current role.
     *
     * @param object|array $permission
     *
     * @return void
     */
    public function detachPermission($permission)
    {
        if (is_object($permission))
            $permission = $permission->getKey();

        if (is_array($permission))
            $permission = $permission['id'];

        $this->perms()->detach( $permission );
    }

    /**
     * Attach multiple permissions to current role.
     *
     * @param mixed $permissions
     *
     * @return void
     */
    public function attachPermissions($permissions)
    {
        foreach ($permissions as $permission) {
            $this->attachPermission($permission);
        }
    }

    /**
     * Detach multiple permissions from current role
     *
     * @param mixed $permissions
     *
     * @return void
     */
    public function detachPermissions($permissions)
    {
        foreach ($permissions as $permission) {
            $this->detachPermission($permission);
        }
    }
}
